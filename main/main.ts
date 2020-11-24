// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain, protocol, shell, dialog, session, clipboard } from 'electron';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

import * as fromCommon from '../src/common';
import { UPDATE_NODE_READY_STATE, UpdateNodeReadyStatePayload } from '../src/store/settings/actions';
import { EXECUTE_ACCOUNTS_CRON_JOBS } from '../src/store/settings';
import { validateSearch } from '../src/utils/validateSearch';
import {
  EXECUTE_RCHAIN_CRON_JOBS,
  EXECUTE_RECORDS_CRON_JOBS,
  LISTEN_FOR_DATA_AT_NAME,
  GET_ONE_RECORD,
  EXECUTE_NODES_CRON_JOBS,
} from '../src/store/blockchain';

import * as fromMainBrowserViews from './store/browserViews';
import * as fromConnections from './store/connections';
import * as fromBlockchains from './store/blockchains';
import { WS_RECONNECT_PERIOD } from '../src/CONSTANTS';
import { registerDappyProtocol } from './registerDappyProtocol';
import { overrideHttpProtocols } from './overrideHttpProtocols';
import { wsCron } from './wsCron';
import { performMultiRequest } from './performMultiRequest';
import { MultiCallParameters, SingleCallParameters } from '../src/models/WebSocket';
import { performSingleRequest } from './performSingleRequest';
import { browserViewsMiddleware } from './browserViewsMiddleware';
import { getIpAddressAndCert } from './getIpAddressAndCert';
import { getDapps } from './getDapps';

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

ipcMain.on('copy-to-clipboard', (event, arg) => {
  clipboard.writeText(arg);
});

/*
  MESSAGE FROM BROWSER WINDOW
  uniqueEphemeralToken is a token wich is only known by the renderer and 
  main process, the webviews don't know its value
*/
/* browser process - main process */
let uniqueEphemeralToken;
ipcMain.on('ask-unique-ephemeral-token', (event, arg) => {
  commEventToRenderer = event;
  crypto.randomBytes(256, (err, buf) => {
    uniqueEphemeralToken = buf.toString('hex');
    commEventToRenderer.reply('ask-unique-ephemeral-token-reply', uniqueEphemeralToken);
  });
  // dappy has been openned with a URL
  if (loadResourceWhenReady) {
    commEventToRenderer.reply('dispatch-from-main', {
      type: '[Main] Update load resource when ready',
      payload: {
        loadResource: loadResourceWhenReady,
      },
    });
  }
});

/*
  MESSAGE FROM BROWSER WINDOW
  Dappy query handlers
*/
/* browser to node */
/* browser process - main process */
ipcMain.on('single-dappy-call', (event, arg) => {
  if (!arg.uniqueEphemeralToken || arg.uniqueEphemeralToken !== uniqueEphemeralToken) {
    commEventToRenderer.reply('single-dappy-call-reply-' + arg.requestId, {
      success: false,
      error: { message: 'Wrong ephemeral unique token' },
    });
    return;
  }

  const parameters: SingleCallParameters = arg.parameters;

  try {
    let newBodyForRequest = {
      ...arg.body,
      requestId: arg.requestId,
    };

    const connections = fromConnections.getConnections(store.getState());
    if (connections[parameters.chainId] && connections[parameters.chainId][parameters.url]) {
      const connection = connections[parameters.chainId][parameters.url];
      performSingleRequest(newBodyForRequest, connection)
        .then((a) => {
          commEventToRenderer.reply('single-dappy-call-reply-' + arg.requestId, a);
        })
        .catch((err) => {
          commEventToRenderer.reply('single-dappy-call-reply-' + arg.requestId, err);
        });
    } else {
      commEventToRenderer.reply('single-dappy-call-reply-' + arg.requestId, {
        error: { message: 'Node not available' },
      });
    }
  } catch (err) {
    console.log(err);
    commEventToRenderer.reply('single-dappy-call-reply-' + arg.requestId, { error: { message: err.message } });
  }
});

/*
  MESSAGE FROM BROWSER WINDOW
  Dappy query handlers
*/
/* browser to network */
/* browser process - main process */
ipcMain.on('multi-dappy-call', (event, arg) => {
  if (!arg.uniqueEphemeralToken || arg.uniqueEphemeralToken !== uniqueEphemeralToken) {
    commEventToRenderer.reply('multi-dappy-call-reply-' + arg.requestId, {
      success: false,
      error: { message: 'Wrong ephemeral unique token' },
    });
    return;
  }

  const parameters: MultiCallParameters = arg.parameters;

  if (parameters.multiCallId === EXECUTE_RCHAIN_CRON_JOBS) {
    parameters.comparer = (res: any) => {
      const json = JSON.parse(res as string);
      if (json.success) {
        return `${json.data.rchainNetwork}-${json.data.lastFinalizedBlockNumber}-${json.data.rchainNamesRegistryUri}`;
      } else {
        return '';
      }
    };
  } else if (parameters.multiCallId === EXECUTE_RECORDS_CRON_JOBS) {
    parameters.comparer = (res: any) => {
      const json = JSON.parse(res as string);
      if (json.success) {
        return json.data;
      } else {
        return '';
      }
    };
  } else if (parameters.multiCallId === LISTEN_FOR_DATA_AT_NAME) {
    parameters.comparer = (res: any) => {
      const json = JSON.parse(res as string);
      if (json.success) {
        return JSON.stringify(json.data);
      } else {
        return '';
      }
    };
  } else if (parameters.multiCallId === GET_ONE_RECORD) {
    parameters.comparer = (res: any) => {
      const json = JSON.parse(res as string);
      if (json.success) {
        return JSON.stringify(json.data);
      } else {
        return '';
      }
    };
  } else if (parameters.multiCallId === EXECUTE_NODES_CRON_JOBS) {
    parameters.comparer = (res: any) => {
      const json = JSON.parse(res as string);
      // Comes from WS/SSL call
      if (json.requestId) {
        return JSON.stringify(json.data);
        // Comes from HTTP call
      } else {
        return res;
      }
    };
  } else if (parameters.multiCallId === EXECUTE_ACCOUNTS_CRON_JOBS) {
    parameters.comparer = (res: any) => {
      const json = JSON.parse(res as string);
      if (json.success) {
        return JSON.stringify(json.data);
      } else {
        return '';
      }
    };
  } else {
    parameters.comparer = (res) => res;
  }

  const connections = fromConnections.getConnections(store.getState());
  performMultiRequest(arg.body, parameters, connections)
    .then((result) => {
      commEventToRenderer.reply('multi-dappy-call-reply-' + arg.requestId, {
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      commEventToRenderer.reply('multi-dappy-call-reply-' + arg.requestId, err);
    });
});

// Get predefined dapps
/* browser process - main process */
ipcMain.on('get-dapps', (event, arg) => {
  if (!arg.uniqueEphemeralToken || arg.uniqueEphemeralToken !== uniqueEphemeralToken) {
    commEventToRenderer.reply('get-dapps-reply-' + arg.requestId, {
      success: false,
      error: { message: 'Wrong ephemeral unique token' },
    });
    return;
  }

  try {
    const dapps = getDapps(app.getAppPath());

    commEventToRenderer.reply('get-dapps-reply-' + arg.requestId, {
      success: true,
      data: JSON.stringify(dapps),
    });
  } catch (err) {
    commEventToRenderer.reply('get-dapps-reply-' + arg.requestId, {
      success: false,
      error: { message: err.message },
    });
  }
});

// Get IP address + cert from hostname
/* browser process - main process */
ipcMain.on('get-ip-address-and-cert', (event, arg) => {
  if (!arg.uniqueEphemeralToken || arg.uniqueEphemeralToken !== uniqueEphemeralToken) {
    commEventToRenderer.reply('get-ip-address-and-cert-reply-' + arg.requestId, {
      success: false,
      error: { message: 'Wrong ephemeral unique token' },
    });
    return;
  }

  getIpAddressAndCert(arg.parameters.host)
    .then((response) => {
      commEventToRenderer.reply('get-ip-address-and-cert-reply-' + arg.requestId, {
        success: true,
        data: response,
      });
      return;
    })
    .catch((err) => {
      commEventToRenderer.reply('get-ip-address-and-cert-reply-' + arg.requestId, {
        success: false,
        error: { message: err.message },
      });
    });
});

/*
  Dispatches coming from MAIN process
  to browser process store
*/
/* browser process - main process */
export interface DispatchFromMainArg {
  data?: { [key: string]: any };
  action: { type: string; payload: any };
}
const dispatchFromMain = (a: DispatchFromMainArg) => {
  /*
    Keep a reference to every active websocket connection
  */
  const connections = fromConnections.getConnections(store.getState());
  if (a.action.type === 'REMOVE_BLOCKCHAIN') {
    const payload: { chainId: string } = a.action.payload;
    let newConnections = { ...connections };
    delete newConnections[payload.chainId];
    store.dispatch({
      type: fromConnections.UPDATE_CONNECTIONS,
      payload: newConnections,
    });
  } else if (a.action.type === UPDATE_NODE_READY_STATE) {
    const payload: UpdateNodeReadyStatePayload = a.action.payload;
    if (a.action.payload.readyState === 1) {
      let newConnections = { ...connections };
      if (!newConnections[payload.chainId]) {
        newConnections[payload.chainId] = {};
      }
      newConnections[payload.chainId][`${payload.ip}---${payload.host}`] = a.data.connection;
      store.dispatch({
        type: fromConnections.UPDATE_CONNECTIONS,
        payload: newConnections,
      });
    } else {
      const index = `${payload.ip}---${payload.host}`;
      if (connections[payload.chainId] && connections[payload.chainId][index]) {
        console.log(`[ws] closing connection ${index}`);
        let newConnections = { ...connections };
        newConnections[payload.chainId][index].removeAllListeners();
        newConnections[payload.chainId][index].close();
        delete newConnections[payload.chainId][index];
        store.dispatch({
          type: fromConnections.UPDATE_CONNECTIONS,
          payload: newConnections,
        });
      }
    }
    commEventToRenderer.reply('dispatch-from-main', a.action);
  } else {
    commEventToRenderer.reply('dispatch-from-main', a.action);
  }
};

/*
  Dispatches coming from browser window
  to MAIN process store
*/
/* browser process - main process */
let wsCronRanOnce = false;
ipcMain.on('dispatch-in-main', (event, a) => {
  if (a.uniqueEphemeralToken === uniqueEphemeralToken) {
    if (a.action.type === fromMainBrowserViews.LOAD_OR_RELOAD_BROWSER_VIEW) {
      store.dispatch({
        ...a.action,
        meta: { openExternal: openExternal, browserWindow: browserWindow, dispatchFromMain: dispatchFromMain },
      });
    } else if (a.action.type === fromMainBrowserViews.DESTROY_BROWSER_VIEW) {
      store.dispatch({ ...a.action, meta: { browserWindow: browserWindow } });
    } else if (a.action.type === fromBlockchains.SYNC_BLOCKCHAINS) {
      store.dispatch(a.action);
      /*
        Do not wait the setInterval to run wsCron
        do it instantly after dispatch
      */
      if (wsCronRanOnce === false) {
        wsCronRanOnce = true;
        wsCron(store.getState, dispatchFromMain);
      }
    } else {
      store.dispatch(a.action);
    }
  }
});

/*
  Commands / jobs coming from browser window
*/
ipcMain.on('trigger-command', (event, arg) => {
  console.log('trigger-command', arg.command);
  if (arg.uniqueEphemeralToken === uniqueEphemeralToken) {
    if (arg.command === 'run-ws-cron') {
      wsCron(store.getState, dispatchFromMain);
    }
    if (arg.command === 'download-file') {
      dialog
        .showOpenDialog({
          title: 'Save file',
          properties: ['openDirectory', 'createDirectory'],
        })
        .then((a) => {
          if (!a.canceled) {
            if (a.filePaths[0]) {
              fs.writeFile(
                path.join(a.filePaths[0], arg.payload.name || 'file'),
                arg.payload.data,
                { encoding: 'base64' },
                (b) => {}
              );
            } else {
              console.error('a.filePaths[0] is not defined ' + a.filePaths[0]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });

      /* dialog.showOpenDialogSync(browserWindow, {
        properties: ['openDirectory'],
      }); */
      /* dialog
        .showSaveDialog(browserWindow, {
          title: 'Save file',
        })
        .then(result => {
          console.log(result);
          console.log(result);
        }); */
    }
  }
});

/*
  Open external link
*/
const openExternal = (url) => {
  shell.openExternal(url);
};
ipcMain.on('open-external', (event, arg) => {
  if (arg.uniqueEphemeralToken === uniqueEphemeralToken) {
    openExternal(arg.value);
  }
});

let loadResourceWhenReady = undefined;
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
      commEventToRenderer.reply('dispatch-from-main', {
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
    wsCron(store.getState, dispatchFromMain);
  }, WS_RECONNECT_PERIOD);
  browserViewsMiddleware(store, dispatchFromMain);

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
      nodeIntegration: false,
      preload: development
        ? path.join(app.getAppPath(), 'src/preload.js')
        : path.join(app.getAppPath(), 'dist/preload.js'),
    },
  });
  registerDappyProtocol(session.fromPartition(partition), store.getState);
  overrideHttpProtocols(
    session.fromPartition(partition),
    store.getState,
    development,
    dispatchFromMain,
    true
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
