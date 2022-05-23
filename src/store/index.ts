import { createStore, applyMiddleware, combineReducers, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { DappyNetworkId, NamePacket, dappyNetworks } from '@fabcotech/dappy-lookup';
import { all } from 'redux-saga/effects';
import xstream from 'xstream';
import throttle from 'xstream/extra/throttle';
import debounce from 'xstream/extra/debounce';

import { sagas as fromMainSagas } from './main/sagas';
import { sagas as fromUiSagas } from './ui/sagas';
import { sagas as fromDappsSagas } from './dapps/sagas';
import { sagas as fromSettingsSagas } from './settings/sagas';
import { sagas as fromBlockchainSagas } from './blockchain/sagas';
import { sagas as fromHistorySagas } from './history/sagas';
import { sagas as fromCookiesSagas } from './cookies/sagas';

import * as fromMain from './main';
import * as fromUi from './ui';
import * as fromDapps from './dapps';
import * as fromSettings from './settings';
import * as fromBlockchain from './blockchain';
import * as fromHistory from './history';
import * as fromCookies from './cookies';

import {
  validateSettings,
  validateBlockchains,
  validateUi,
  validateDappyNodeFullInfo,
  validateTabs,
  validateTransactionStates,
} from './decoders';
import fromEvent from 'xstream/extra/fromEvent';
import { DEVELOPMENT, RELOAD_INDEXEDDB_PERIOD } from '../CONSTANTS';
import { validateAccounts } from './decoders/Account';
import { loggerSaga } from './utils';
import { PREDEFINED_TABS } from '../TABS';
import { initCronJobs } from './initCronJobs';
import { interProcess } from '../interProcess';

import { MultiRequestResult } from '../models';
// import { upgrades } from './upgrades';

declare global {
  interface Window {
    Sentry: any;
    uniqueEphemeralToken: string;
    messageFromMain: (a: any) => void;
    dappyLookup: (parameters: any) => Promise<NamePacket>;
    dappySingleRequest: (body: any, parameters: any) => Promise<any>;
    dappyMultiRequest: (body: any, parameters: any) => Promise<MultiRequestResult>;
    getIpAddressAndCert: (a: { host: string }) => Promise<{ cert: string; ip: string }>;
    generateCertificateAndKey: (altNames: string[]) => Promise<{ key: string; certificate: string }>;
    triggerCommand: (command: string, payload?: { [key: string]: string }) => void;
    initContextMenu: () => void;
    copyToClipboard: (a: string) => void;
    dispatchInMain: (a: Action) => void;
    maximize: () => void;
    minimize: () => void;
    close: () => void;
    openExternal: (url: string) => void;
    t: (a: string, plural?: boolean) => void;
    translations: {
      [key: string]: {
        one: string;
        other?: string;
      };
    };
    dispatchFromMainProcess: (a: Action) => void;
    dispatchWhenReady: undefined | Action;
  }
}

export interface Action {
  type: string;
  payload: any;
}

export interface State {
  main: fromMain.State;
  ui: fromUi.State;
  dapps: fromDapps.State;
  settings: fromSettings.State;
  blockchain: fromBlockchain.State;
  history: fromHistory.State;
  cookies: fromCookies.State;
}

const errorCatcherMiddleware = () => (next: (a: Action) => void) => (action: Action) => {
  try {
    return next(action);
  } catch (err) {
    console.error('An error occured in reducers');
    if (DEVELOPMENT) {
      console.log(err);
    } else {
      window.Sentry.captureException(err);
    }
    return err;
  }
};

const sagaMiddleware = createSagaMiddleware();
let middlewares = [errorCatcherMiddleware, sagaMiddleware];

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || ((a: any) => a);

export const store: Store<State> = createStore(
  combineReducers({
    main: fromMain.reducer,
    ui: fromUi.reducer,
    dapps: fromDapps.reducer,
    settings: fromSettings.reducer,
    blockchain: fromBlockchain.reducer,
    history: fromHistory.reducer,
    cookies: fromCookies.reducer,
  }),
  composeEnhancers(applyMiddleware(...middlewares))
);

const sagas = function* rootSaga() {
  let sagas;
  if (DEVELOPMENT) {
    sagas = [
      loggerSaga(),
      fromMainSagas(),
      fromDappsSagas(),
      fromSettingsSagas(),
      fromBlockchainSagas(),
      fromUiSagas(),
      fromHistorySagas(),
      fromCookiesSagas(),
    ];
  } else {
    sagas = [
      loggerSaga(), // todo: remove logger in prod ?
      fromMainSagas(),
      fromDappsSagas(),
      fromSettingsSagas(),
      fromBlockchainSagas(),
      fromUiSagas(),
      fromHistorySagas(),
      fromCookiesSagas(),
    ];
  }

  try {
    yield all(sagas);
  } catch (err) {
    console.error('An error occured in sagas');
    if (DEVELOPMENT) {
      console.log(err);
    } else {
      window.Sentry.captureException(err);
    }
    return err;
  }
};

sagaMiddleware.run(sagas);

const dispatchInitActions = () => {
  if (asyncActionsOver === 8) {
    store.dispatch(
      fromUi.setBodyDimensionsAction({ bodyDimensions: [document.body.clientWidth, document.body.clientHeight] })
    );
    setTimeout(() => {
      initCronJobs(store);
    }, 10000);
    store.dispatch(fromMain.updateInitializationOverAction());
  }
};

const DB_MIGRATION_NUMBER = 24;
export const dbReq: IDBOpenDBRequest = window.indexedDB.open('dappy', DB_MIGRATION_NUMBER);
export let db: undefined | IDBDatabase;

export const getDb: () => IDBDatabase = () => db as IDBDatabase;

dbReq.onupgradeneeded = (event) => {
  if (!event.target) {
    console.error('DB onupgradeneeded failed to initialize');
    return;
  }
  db = (event.target as any).result as IDBDatabase;

  if (!db.objectStoreNames.contains('ui')) {
    db.createObjectStore('ui', {});
  }
  if (!db.objectStoreNames.contains('settings')) {
    db.createObjectStore('settings', {});
  }
  if (!db.objectStoreNames.contains('tabs')) {
    db.createObjectStore('tabs', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('networks')) {
    db.createObjectStore('networks', { keyPath: 'chainId' });
  }
  if (!db.objectStoreNames.contains('transactions')) {
    db.createObjectStore('transactions', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('rchainInfos')) {
    db.createObjectStore('rchainInfos', { keyPath: 'chainId' });
  }
  if (!db.objectStoreNames.contains('accounts')) {
    db.createObjectStore('accounts', { keyPath: 'name' });
  }
};

const registerIDBOpenDBRequestErrorListener = (idbOpenRequest: IDBOpenDBRequest) => {
  idbOpenRequest.onerror = (err) => {
    store.dispatch(
      fromMain.saveErrorAction({
        errorCode: 2017,
        error: 'indexDB error',
        trace: err,
      })
    );
  };
};

export const openConnection = () => {
  return new Promise<void>((resolve, reject) => {
    const a = window.indexedDB.open('dappy', DB_MIGRATION_NUMBER);
    a.onerror = (event) => {
      console.log('IndexedDB open: error');
      store.dispatch(
        fromMain.saveErrorAction({
          errorCode: 2060,
          error: 'Error opening IndexedDB',
          trace: event,
        })
      );
      reject(event);
    };
    a.onsuccess = (event) => {
      console.log('IndexedDB open: successful');
      db = (event.target as any).result as IDBDatabase;
      registerIDBOpenDBRequestErrorListener(a);
      resolve();
    };
  });
};

/*
  Is this setInterval to close/reopen connection still
  useful ? browser-utils reopens connection in case the
  transaction to indexedDB fails
*/
setInterval(() => {
  const openedDB = getDb();
  console.log('IndexedDB reload: closing connection');
  try {
    openedDB.close();
  } catch (e) {
    console.log(e);
    store.dispatch(
      fromMain.saveErrorAction({
        errorCode: 2059,
        error: 'Error closing IndexedDB',
        trace: e,
      })
    );
  }
  setTimeout(openConnection, 100);
}, RELOAD_INDEXEDDB_PERIOD);

let asyncActionsOver = 0;
dbReq.onsuccess = (event) => {
  if (!event.target) {
    console.error('DB onsuccess failed to initialize');
    return;
  }
  db = (event.target as any).result as IDBDatabase;
  const openedDB = getDb();

  // UI
  const uiTx = openedDB.transaction('ui', 'readonly');
  var uiObjectStore = uiTx.objectStore('ui');

  const requestUI = uiObjectStore.get(0);
  requestUI.onsuccess = (e) => {
    let ui = requestUI.result;
    if (typeof ui === 'undefined') {
      console.warn('ui not found in storage, probably first launch');
      asyncActionsOver += 1;
      dispatchInitActions();
      return;
    }

    if (ui.navigationUrl === '/settings/accounts') {
      ui.navigationUrl = '/accounts';
    } else if (ui.navigationUrl === '/settings/names') {
      ui.navigationUrl = '/names';
    }
    if (ui.hasOwnProperty('dappsListDisplay')) {
      ui = { ...ui, tabsListDisplay: ui.dappsListDisplay };
      delete ui.dappsListDisplay;
    }

    validateUi(ui)
      .then(() => {
        asyncActionsOver += 1;
        store.dispatch(fromUi.updateUiFromStorageAction({ uiState: ui }));
        dispatchInitActions();
      })
      .catch((e) => {
        if (ui) {
          console.error(e);
        }
        asyncActionsOver += 1;
        dispatchInitActions();
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2003,
            error: 'Unable to read ui from storage',
            trace: e,
          })
        );
      });
  };

  // SETTINGS
  const settingsTx = openedDB.transaction('settings', 'readonly');
  var settingsObjectStore = settingsTx.objectStore('settings');
  const requestSettings = settingsObjectStore.get(0);
  requestSettings.onsuccess = (e) => {
    let settings = requestSettings.result;
    if (typeof settings === 'undefined') {
      console.warn('settings not found in storage, probably first launch');
      asyncActionsOver += 1;
      const txReadWrite = openedDB.transaction('settings', 'readwrite');
      const objectStore = txReadWrite.objectStore('settings');
      objectStore.put(fromSettings.initialState.settings, 0);
      dispatchInitActions();
      return;
    }
    validateSettings(settings)
      .then(() => {
        asyncActionsOver += 1;
        store.dispatch(fromSettings.updateSettingsCompletedAction(settings));
        dispatchInitActions();
      })
      .catch((e) => {
        if (settings) {
          console.error(e);
        }
        asyncActionsOver += 1;
        dispatchInitActions();
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2011,
            error: 'Unable to read settings from storage',
            trace: e,
          })
        );
      });
  };

  // TABS
  const tabsTx = openedDB.transaction('tabs', 'readonly');
  var tabsStore = tabsTx.objectStore('tabs');
  const requestTabs = tabsStore.getAll();
  requestTabs.onsuccess = (e) => {
    let tabsToCheck = requestTabs.result;

    tabsToCheck = tabsToCheck
      .filter((t) => !!t.url)
      .map((t) => {
        if (t.resourceId) {
          delete t.resourceId;
        }
        t.favorite = t.favorite || false;
        return t;
      });

    validateTabs(tabsToCheck)
      .then((tabs) => {
        asyncActionsOver += 1;
        if (tabs.length) {
          store.dispatch(fromDapps.updatTabsFromStorageAction({ tabs: tabs }));
        } else {
          store.dispatch(fromDapps.updatTabsFromStorageAction({ tabs: PREDEFINED_TABS }));
        }
        dispatchInitActions();
      })
      .catch((e) => {
        asyncActionsOver += 1;
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2005,
            error: 'Unable to read tabs from storage',
            trace: e,
          })
        );
        dispatchInitActions();
      });
  };

  // BLOCKCHAINS
  const blockchainsTx = openedDB.transaction('networks', 'readonly');
  var blockchainsStore = blockchainsTx.objectStore('networks');
  const requestBlockchains = blockchainsStore.getAll();
  requestBlockchains.onsuccess = (e) => {
    let blockchainsToCheck = requestBlockchains.result;
    blockchainsToCheck.map(bc => {
      if (!bc.hasOwnProperty('auto')) {
        bc.auto = true;
      }
      if (bc.auto && !!dappyNetworks[bc.chainId as DappyNetworkId]) {
        bc.auto = true;
        bc.nodes = dappyNetworks[bc.chainId as DappyNetworkId];
      }
      return bc;
    })
    validateBlockchains(blockchainsToCheck)
      .then((blockchains) => {
        asyncActionsOver += 1;
        // todo what if blockchains from dappy-lookup have changed ?
        // we need to update store
        if (blockchains.length) {
          store.dispatch(fromSettings.updateBlockchainsFromStorageAction(blockchains));
        } else {
          const chainId = Object.keys(dappyNetworks)[0];
          store.dispatch(fromSettings.updateBlockchainsFromStorageAction([{
            platform: 'rchain',
            auto: true,
            chainId: chainId,
            chainName: chainId,
            nodes: dappyNetworks[chainId as DappyNetworkId]
          }]));
        }
        dispatchInitActions();
      })
      .catch((e) => {
        console.log(e)
        asyncActionsOver += 1;
        const chainId = Object.keys(dappyNetworks)[0];
        store.dispatch(fromSettings.updateBlockchainsFromStorageAction([{
          platform: 'rchain',
          auto: true,
          chainId: chainId,
          chainName: chainId,
          nodes: dappyNetworks[chainId as DappyNetworkId]
        }]));
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2004,
            error: 'Unable to read blockchains from storage',
            trace: e,
          })
        );
        dispatchInitActions();
      });
  };

  // TRANSACTIONS
  const transactionsTx = openedDB.transaction('transactions', 'readonly');
  var transactionsStore = transactionsTx.objectStore('transactions');
  const requestTransactions = transactionsStore.getAll();
  requestTransactions.onsuccess = (e) => {
    const transactionsToCheck = requestTransactions.result;
    validateTransactionStates(transactionsToCheck)
      .then((transactions) => {
        asyncActionsOver += 1;
        store.dispatch(
          fromBlockchain.updateTransactionsFromStorageAction({
            transactions: transactions,
          })
        );
        dispatchInitActions();
      })
      .catch((e) => {
        asyncActionsOver += 1;
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2047,
            error: 'Unable to read transactions from storage',
            trace: e,
          })
        );
        dispatchInitActions();
      });
  };

  // ACCOUNTS
  const accountsTx = openedDB.transaction('accounts', 'readonly');
  var accountsStore = accountsTx.objectStore('accounts');
  const requestAccounts = accountsStore.getAll();
  requestAccounts.onsuccess = (e) => {
    let accounts = requestAccounts.result;
    accounts = accounts.map((a) => {
      return {
        ...a,
        boxes: a.boxes || [],
      };
    });

    validateAccounts(accounts)
      .then(() => {
        asyncActionsOver += 1;
        store.dispatch(
          fromSettings.updateAccountsFromStorageAction({
            accounts: accounts,
          })
        );
        dispatchInitActions();
      })
      .catch((err) => {
        console.error(err);
        asyncActionsOver += 1;
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2037,
            error: 'Unable to read accounts from storage',
            trace: accounts,
          })
        );
        dispatchInitActions();
      });
  };

  // RCHAIN INFOS
  const rchainInfosTx = openedDB.transaction('rchainInfos', 'readonly');
  var rchainInfosStore = rchainInfosTx.objectStore('rchainInfos');
  const requestRChainInfos = rchainInfosStore.getAll();
  requestRChainInfos.onsuccess = (e) => {
    let rchainInfos = requestRChainInfos.result;
    if (!rchainInfos) {
      asyncActionsOver += 1;
      dispatchInitActions();
      return;
    }

    rchainInfos = rchainInfos.map(ri => {
      // .wrappedRevContractId introuced in 0.5.4
      if (ri.info && !ri.info.wrappedRevContractId) {
        ri.info.wrappedRevContractId = 'notconfigured'
      }
      // rchain-token 16 new price format
      if (ri.info && typeof ri.info.namePrice === 'number') {
        ri.info.namePrice = null
      }
      // dappy browser 0.5.5 and shardId in RChain DeployData
      if (ri.info && typeof ri.info.rchainShardId !== 'string') {
        ri.info.rchainShardId = 'unknown';
      }

      return ri;
    });

    Promise.all(
      rchainInfos.map((ri: any) => {
        return validateDappyNodeFullInfo(ri);
      })
    )
      .then((valid) => {
        asyncActionsOver += 1;
        store.dispatch(fromBlockchain.updateRChainBlockchainInfosFromStorageAction({ rchainInfos: rchainInfos }));
        dispatchInitActions();
      })
      .catch((err) => {
        console.error(err);
        asyncActionsOver += 1;
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2016,
            error: 'Unable to read RChain infos from storage',
            trace: err,
          })
        );
        dispatchInitActions();
      });
  };

  registerIDBOpenDBRequestErrorListener(dbReq);

  const uniqueEphemeralTokenInterval = setInterval(() => {
    if (window.uniqueEphemeralToken) {
      asyncActionsOver += 1;
      dispatchInitActions();
      clearInterval(uniqueEphemeralTokenInterval);
    }
  }, 100);

  window.dispatchFromMainProcess = (action) => {
    store.dispatch(action);
  };
  if (window.dispatchWhenReady) {
    store.dispatch(window.dispatchWhenReady);
  }
  interProcess(store);

  const windowResizeStream = fromEvent(window, 'resize', true);
  xstream.merge(windowResizeStream.compose(throttle(600)), windowResizeStream.compose(debounce(600))).subscribe({
    next: (x) => {
      store.dispatch(
        fromUi.setBodyDimensionsAction({ bodyDimensions: [document.body.clientWidth, document.body.clientHeight] })
      );
    },
  });
};
