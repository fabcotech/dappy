// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain, protocol, shell, session } from 'electron';
import path from 'path';

import * as fromCommon from '../src/common';
import { UPDATE_NODE_READY_STATE, UpdateNodeReadyStatePayload } from '../src/store/settings';
import { validateSearch } from '../src/utils/validateSearch';

import * as fromMainBrowserViews from './store/browserViews';
import { WS_RECONNECT_PERIOD } from '../src/CONSTANTS';
import { registerDappyProtocol } from './registerDappyProtocol';
import { overrideHttpProtocols } from './overrideHttpProtocols';
import { registerInterProcessProtocol } from './registerInterProcessProtocol';
import { benchmarkCron } from './benchmarkCron';
import { store } from './store';

protocol.registerSchemesAsPrivileged([
  { scheme: 'dappy', privileges: { standard: true, secure: true, bypassCSP: true } },
]);

const development = !!process.defaultApp;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let browserWindow;

let commEventToRenderer = undefined;

/*
  MESSAGE FROM BROWSER VIEWS / TABS (dapps and IP apps)
  first message from dapps to get the initial payload
*/
/* tab process - main process */
ipcMain.on('hi-from-dapp-sandboxed', (commEvent, userAgent) => {
  const browserViews = fromMainBrowserViews.getBrowserViewsMain(store.getState());
  let randomId = '';
  try {
    const io = userAgent.indexOf('randomId=');
    randomId = userAgent.substring(io + 'randomId='.length);
    const id = Object.keys(browserViews).find((k) => browserViews[k].randomId === randomId);
    if (!id) {
      console.error('Could find browser view from hi-from-dapp-sandboxed message');
      return;
    }

    commEvent.reply('hi-from-dapp-sandboxed-reply', {
      type: fromCommon.DAPP_INITIAL_SETUP,
      payload: {
        html: browserViews[id].html,
        address: browserViews[id].address,
        path: browserViews[id].path,
        title: browserViews[id].title,
        dappId: browserViews[id].resourceId,
        randomId: browserViews[id].randomId,
        appPath: path.join(app.getAppPath(), 'dist/'),
      },
    });
    store.dispatch({
      type: fromMainBrowserViews.SAVE_BROWSER_VIEW_COMM_EVENT,
      payload: {
        id: id,
        commEvent: commEvent,
      },
    });
  } catch (err) {
    console.error('Could not get randomId from hi-from-dapp-sandboxed message');
    return;
  }
});

let dispatchesFromMainAwaiting = [];
const getDispatchesFromMainAwaiting = () => {
  const t = [].concat(dispatchesFromMainAwaiting);
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

/*
  Open external link
*/
const openExternal = (url) => {
  shell.openExternal(url);
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

    if (commEventToRenderer) {
      dispatchesFromMainAwaiting.push({
        type: '[Dapps] Load resource',
        payload: {
          address: validDappyAddress.replace('dappy://', ''),
        },
      });
    } else {
      loadResourceWhenReady = validDappyAddress.replace('dappy://', '');
    }
  }
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
app.on('second-instance', (event, argv, cwd) => {
  validateAndProcessAddresses(argv);
  return;
});

function createWindow() {
  setInterval(() => {
    benchmarkCron(store.getState, dispatchFromMain);
  }, WS_RECONNECT_PERIOD);

  /*
    CAREFUL
    Partition is the cold storage identifier on the OS where dappy is installed,
    changing this will remove everything that is in dappy localStorage
    PRIVATE KEYS LOST, ACCOUNTS LOST, TABS LOST etc.....
  */
  const partition = `persist:dappy0.3.0`;

  // Create the browser window.
  browserWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // frame: false,
    webPreferences: {
      partition: partition,
      sandbox: true,
      contextIsolation: true,
    },
  });
  registerDappyProtocol(session.fromPartition(partition), store.getState);
  overrideHttpProtocols(session.fromPartition(partition), store.getState, development, dispatchFromMain, true);
  registerInterProcessProtocol(
    session.fromPartition(partition),
    store,
    getLoadResourceWhenReady,
    openExternal,
    browserWindow,
    dispatchFromMain,
    getDispatchesFromMainAwaiting
  );

  browserWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  if (development) {
    browserWindow.loadURL('http://localhost:3033');
  } else {
    browserWindow.loadFile('dist/index.html');
  }

  // Open the DevTools.
  // browserWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  browserWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    browserWindow = null;
  });
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
  if (browserWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
