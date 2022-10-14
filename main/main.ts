// Modules to control application life and create native browser window
import { app, BrowserWindow, protocol, shell, session } from 'electron';

import { validateSearch } from '../src/utils/validateSearch';
import * as fromDapps from '../src/store/dapps';

import { overrideHttpProtocol } from './overrideHttpProtocol';
import { overrideHttpsProtocol } from './overrideHttpsProtocol';
import { registerInterProcessProtocol } from './registerInterProcessProtocol';
import { store } from './store';
import { installDevToolsExtensionsOnlyForDev } from './devTools';
import { preventAllPermissionRequests } from './preventAllPermissionRequests';

import { initAutoUpdater } from './autoUpdater';
import { getRendererParams } from './rendererParams';

/*
  CAREFUL
  Partition is the cold storage identifier on the OS where dappy is installed,
  changing this will remove everything that is in dappy localStorage
  PRIVATE KEYS LOST, ACCOUNTS LOST, TABS LOST etc.....
*/
const partition = process.env.PARTITION || 'persist:dappy0.3.0';

protocol.registerSchemesAsPrivileged([
  { scheme: 'dappy', privileges: { standard: true, secure: true, bypassCSP: true } },
]);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let browserWindow: undefined | BrowserWindow = undefined;

let dispatchesFromMainAwaiting: {
  type: string;
  payload: any;
}[] = [
  {
    type: '[Ui] Update Platform',
    payload: {
      platform: process.platform,
    },
  },
];
const getDispatchesFromMainAwaiting = () => {
  const t = (
    [] as {
      type: string;
      payload: any;
    }[]
  ).concat(dispatchesFromMainAwaiting);
  dispatchesFromMainAwaiting = [];

  return t;
};
/*
  Dispatches coming from MAIN process
  to browser process store
*/
/* browser process - main process */
export interface DispatchFromMainArg {
  action: { type: string; payload: any };
}
const dispatchFromMain = (a: DispatchFromMainArg) => {
  dispatchesFromMainAwaiting.push(a.action);
};

const isHttpsUrl = (uri: string) =>
  /^https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(uri);

/*
  Open external link
*/
const openExternal = (url: string) => {
  if (isHttpsUrl(url)) shell.openExternal(url);
  else console.error('Only open external https urls');
};

let loadResourceWhenReady = undefined;
const getLoadResourceWhenReady = () => loadResourceWhenReady;
const validateAndProcessAddresses = (addresses: string[]) => {
  const validDappyAddress = addresses.find((a) => {
    const withoutProtocol = a.replace('dappy://', '');
    return !withoutProtocol.startsWith('/') && validateSearch(withoutProtocol);
  });

  if (validDappyAddress) {
    if (browserWindow) {
      if (browserWindow.isMinimized()) {
        browserWindow.restore();
      }
      browserWindow.focus();
    }

    loadResourceWhenReady = validDappyAddress.replace('dappy://', '');
  }
  return loadResourceWhenReady;
};
validateAndProcessAddresses(process.argv);

// macOS only
app.on('open-url', function (event, data) {
  validateAndProcessAddresses([data]);
});

app.setAsDefaultProtocolClient('dappy');

const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
}

installDevToolsExtensionsOnlyForDev(partition);

app.on('second-instance', (event, argv, cwd) => {
  const a = validateAndProcessAddresses(argv);
  if (typeof a === 'string') {
    dispatchFromMain({
      action: fromDapps.loadResourceAction({
        url: a,
      }),
    });
  }
  return;
});

function createWindow() {
  // Create the browser window.
  browserWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // leave frame on osx / mac
    frame: true,
    transparent: false,
    webPreferences: {
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
      partition: partition,
      devTools: /^true$/i.test(process.env.DAPPY_DEVTOOLS) || !process.env.PRODUCTION,
    },
  });
  const browserSession = session.fromPartition(partition);
  preventAllPermissionRequests(browserSession);
  overrideHttpProtocol({ session: browserSession });
  overrideHttpsProtocol({
    chainId: '',
    dappyNetworkMembers: [],
    dappyBrowserView: undefined,
    session: browserSession,
    dispatchFromMain,
    partitionIdHash: '',
    setIsFirstRequest: () => false,
    getIsFirstRequest: () => false,
  });
  registerInterProcessProtocol(
    browserSession,
    store,
    getLoadResourceWhenReady,
    openExternal,
    browserWindow,
    dispatchFromMain,
    getDispatchesFromMainAwaiting
  );

  browserWindow.setMenuBarVisibility(false);

  const rendererParams = getRendererParams(process.argv.slice(2));
  // and load the index.html of the app.
  if (process.env.PRODUCTION) {
    browserWindow.loadFile('dist/renderer/index.html', {
      search: rendererParams,
    });
  } else {
    browserWindow.loadURL(`http://localhost:3033${rendererParams}`);
  }

  // Open the DevTools.
  // browserWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  browserWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    browserWindow = undefined;
  });

  initAutoUpdater();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (browserWindow === undefined) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
