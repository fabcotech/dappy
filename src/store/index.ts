import { createStore, applyMiddleware, combineReducers, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
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

import * as fromMain from './main';
import * as fromUi from './ui';
import * as fromDapps from './dapps';
import * as fromSettings from './settings';
import * as fromBlockchain from './blockchain';
import * as fromHistory from './history';

import {
  validateSettings,
  validateBenchmarks,
  validateBlockchains,
  validateUi,
  validateRecords,
  validateDappyNodeFullInfo,
  validateTabs,
  validateTransactionStates,
} from './decoders';
import fromEvent from 'xstream/extra/fromEvent';
import { DEVELOPMENT } from '../CONSTANTS';
import { validateAccounts } from './decoders/Account';
import { loggerSaga } from './utils';
import { validatePreviews } from './decoders/Preview';
import { PREDEFINED_BLOCKCHAINS } from '../BLOCKCHAINS';
import { PREDEFINED_TABS } from '../TABS';
import { initCronJobs } from './initCronJobs';
// import { upgrades } from './upgrades';

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
}

const errorCatcherMiddleware = store => next => action => {
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

export const store: Store<State> = createStore(
  combineReducers({
    main: fromMain.reducer,
    ui: fromUi.reducer,
    dapps: fromDapps.reducer,
    settings: fromSettings.reducer,
    blockchain: fromBlockchain.reducer,
    history: fromHistory.reducer,
  }),
  applyMiddleware(...middlewares)
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
    ];
  } else {
    sagas = [
      loggerSaga(),
      fromMainSagas(),
      fromDappsSagas(),
      fromSettingsSagas(),
      fromBlockchainSagas(),
      fromUiSagas(),
      fromHistorySagas(),
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
  if (asyncActionsOver === 11) {
    store.dispatch(
      fromUi.setBodyDimensionsAction({ bodyDimensions: [document.body.clientWidth, document.body.clientHeight] })
    );
    setTimeout(
      () => {
        initCronJobs(store)
      }, 10000
    )
    store.dispatch(fromMain.updateInitializationOverAction());
  }
};

export const dbReq = window.indexedDB.open('dappy', 18);
export let db;

export const getDb = () => db;

dbReq.onupgradeneeded = event => {
  if (!event.target) {
    console.error('DB onupgradeneeded failed to initialize');
    return;
  }
  db = event.target.result;

  if (!db.objectStoreNames.contains('ui')) {
    db.createObjectStore('ui', {});
  }
  if (!db.objectStoreNames.contains('settings')) {
    db.createObjectStore('settings', {});
  }
  if (!db.objectStoreNames.contains('tabs')) {
    db.createObjectStore('tabs', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('previews')) {
    db.createObjectStore('previews', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('blockchains')) {
    db.createObjectStore('blockchains', { keyPath: 'chainId' });
  }
  if (!db.objectStoreNames.contains('transactions')) {
    db.createObjectStore('transactions', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('benchmarks')) {
    db.createObjectStore('benchmarks', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('rchainInfos')) {
    db.createObjectStore('rchainInfos', { keyPath: 'chainId' });
  }
  if (!db.objectStoreNames.contains('records')) {
    db.createObjectStore('records', { keyPath: 'name' });
  }
  if (!db.objectStoreNames.contains('accounts')) {
    db.createObjectStore('accounts', { keyPath: 'name' });
  }
};

let asyncActionsOver = 0;
dbReq.onsuccess = event => {
  if (!event.target) {
    console.error('DB onsuccess failed to initialize');
    return;
  }
  db = event.target.result;

  // UI
  const uiTx = db.transaction('ui', 'readonly');
  var uiObjectStore = uiTx.objectStore('ui');

  const requestUI = uiObjectStore.get(0);
  requestUI.onsuccess = e => {
    let ui = requestUI.result;
    if (typeof ui === 'undefined') {
      console.warn('ui not found in storage, probably first launch');
      asyncActionsOver += 1;
      dispatchInitActions();
      return;
    }

    validateUi(ui)
      .then(() => {
        asyncActionsOver += 1;
        store.dispatch(fromUi.updateUiFromStorageAction({ uiState: ui }));
        dispatchInitActions();
      })
      .catch(e => {
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
  const settingsTx = db.transaction('settings', 'readonly');
  var settingsObjectStore = settingsTx.objectStore('settings');
  const requestSettings = settingsObjectStore.get(0);
  requestSettings.onsuccess = e => {
    let settings = requestSettings.result;
    if (typeof settings === 'undefined') {
      console.warn('settings not found in storage, probably first launch');
      asyncActionsOver += 1;
      const txReadWrite = db.transaction('settings', 'readwrite');
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
      .catch(e => {
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
  const tabsTx = db.transaction('tabs', 'readonly');
  var tabsStore = tabsTx.objectStore('tabs');
  const requestTabs = tabsStore.getAll();
  requestTabs.onsuccess = e => {
    let tabsToCheck = requestTabs.result;

    validateTabs(tabsToCheck)
      .then(tabs => {
        asyncActionsOver += 1;
        if (tabs.length) {
          store.dispatch(fromDapps.updatTabsFromStorageAction({ tabs: tabs }));
        } else {
          store.dispatch(fromDapps.updatTabsFromStorageAction({ tabs: PREDEFINED_TABS }));
        }
        dispatchInitActions();
      })
      .catch(e => {
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

    // PREVIEWS
    const previewsTx = db.transaction('previews', 'readonly');
    var previewsStore = previewsTx.objectStore('previews');
    const requestPreviews = previewsStore.getAll();
    requestPreviews.onsuccess = e => {
      const previewsToCheck = requestPreviews.result;
      validatePreviews(previewsToCheck)
        .then(previews => {
          asyncActionsOver += 1;
          store.dispatch(fromHistory.updatPreviewsFromStorageAction({ previews: previews }));
          dispatchInitActions();
        })
        .catch(e => {
          asyncActionsOver += 1;
          store.dispatch(
            fromMain.saveErrorAction({
              errorCode: 2041,
              error: 'Unable to read previews from storage',
              trace: e,
            })
          );
          dispatchInitActions();
        });
    };

  // BLOCKCHAINS
  const blockchainsTx = db.transaction('blockchains', 'readonly');
  var blockchainsStore = blockchainsTx.objectStore('blockchains');
  const requestBlockchains = blockchainsStore.getAll();
  requestBlockchains.onsuccess = e => {
    const blockchainsToCheck = requestBlockchains.result;
    validateBlockchains(blockchainsToCheck)
      .then(blockchains => {
        asyncActionsOver += 1;
        if (blockchains.length) {
          store.dispatch(fromSettings.updateBlockchainsFromStorageAction(blockchains));
        } else {
          store.dispatch(fromSettings.updateBlockchainsFromStorageAction([PREDEFINED_BLOCKCHAINS[0]]))
        }
        dispatchInitActions();
      })
      .catch(e => {
        asyncActionsOver += 1;
        store.dispatch(fromSettings.updateBlockchainsFromStorageAction([PREDEFINED_BLOCKCHAINS[0]]))
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2004,
            error: 'Unable to read blockchains from storage',
            trace: e,
          })
        );
        dispatchInitActions();
      })
  };

    // TRANSACTIONS
    const transactionsTx = db.transaction('transactions', 'readonly');
    var transactionsStore = transactionsTx.objectStore('transactions');
    const requestTransactions = transactionsStore.getAll();
    requestTransactions.onsuccess = e => {
      const transactionsToCheck = requestTransactions.result;
      validateTransactionStates(transactionsToCheck)
        .then(transactions => {
          asyncActionsOver += 1;
          store.dispatch(fromBlockchain.updateTransactionsFromStorageAction({
            transactions: transactions
          }));
          dispatchInitActions();
        })
        .catch(e => {
          asyncActionsOver += 1;
          store.dispatch(fromSettings.updateBlockchainsFromStorageAction(PREDEFINED_BLOCKCHAINS))
          store.dispatch(
            fromMain.saveErrorAction({
              errorCode: 2047,
              error: 'Unable to read transactions from storage',
              trace: e,
            })
          );
          dispatchInitActions();
        })
    };

  // RECORDS
  const recordsTx = db.transaction('records', 'readonly');
  var recordsStore = recordsTx.objectStore('records');
  const requestRecords = recordsStore.getAll();
  requestRecords.onsuccess = e => {
    const records = requestRecords.result;
    validateRecords(records)
      .then(() => {
        asyncActionsOver += 1;
        store.dispatch(
          fromBlockchain.updateRecordsFromStorageAction({
            records: records,
          })
        );
        dispatchInitActions();
      })
      .catch(err => {
        asyncActionsOver += 1;
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2029,
            error: 'Unable to read records from storage',
            trace: records,
          })
        );
        dispatchInitActions()
      });

  // ACCOUNTS
  const accountsTx = db.transaction('accounts', 'readonly');
  var accountsStore = accountsTx.objectStore('accounts');
  const requestAccounts = accountsStore.getAll();
  requestAccounts.onsuccess = e => {
    const accounts = requestAccounts.result;

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
      .catch(err => {
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

  // BENCHMARKS
  const benchmarksTx = db.transaction('benchmarks', 'readonly');
  var benchmarksStore = benchmarksTx.objectStore('benchmarks');
  const requestBenchmarks = benchmarksStore.getAll();
  requestBenchmarks.onsuccess = e => {
    const benchmarks = requestBenchmarks.result;
    if (typeof benchmarks === 'undefined') {
      console.warn('benchmarks not found in storage, probably first launch');
      asyncActionsOver += 1;
      dispatchInitActions();
      return;
    }
    validateBenchmarks(benchmarks)
      .then(() => {
        asyncActionsOver += 1;
        store.dispatch(
          fromBlockchain.updateBenchmarksFromStorageAction({
            benchmarks: benchmarks,
          })
        );
        dispatchInitActions();
      })
      .catch(e => {
        asyncActionsOver += 1;
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2015,
            error: 'Unable to read benchmarks from storage',
            trace: benchmarks,
          })
        );
        dispatchInitActions();
      });
  };

  // RCHAIN INFOS
  const rchainInfosTx = db.transaction('rchainInfos', 'readonly');
  var rchainInfosStore = rchainInfosTx.objectStore('rchainInfos');
  const requestRChainInfos = rchainInfosStore.getAll();
  requestRChainInfos.onsuccess = e => {
    let rchainInfos = requestRChainInfos.result;
    if (!rchainInfos) {
      asyncActionsOver += 1;
      dispatchInitActions();
      return;
    }

    Promise.all(rchainInfos.map((ri: any) => {
      return validateDappyNodeFullInfo(ri);
    }))
      .then(valid => {
        asyncActionsOver += 1;
        store.dispatch(fromBlockchain.updateRChainBlockchainInfosFromStorageAction({ rchainInfos: rchainInfos }));
        dispatchInitActions();
      })
      .catch(err => {
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
};

const uniqueEphemeralTokenInterval =  setInterval(() => {
  if (window.uniqueEphemeralToken) {
    asyncActionsOver += 1;
    dispatchInitActions();
    clearInterval(uniqueEphemeralTokenInterval)
  }
}, 100)

window.dispatchFromMainProcess = (action) => {
  store.dispatch(action);
}
if (window.dispatchWhenReady) {
  store.dispatch(window.dispatchWhenReady);
}

dbReq.onerror = err => {
  store.dispatch(
    fromMain.saveErrorAction({
      errorCode: 2017,
      error: 'indexDB error',
      trace: err,
    })
  );
};

const windowResizeStream = fromEvent(window, 'resize', true);
xstream.merge(windowResizeStream.compose(throttle(600)), windowResizeStream.compose(debounce(600))).subscribe({
  next: x => {
    store.dispatch(
      fromUi.setBodyDimensionsAction({ bodyDimensions: [document.body.clientWidth, document.body.clientHeight] })
    );
  },
});
