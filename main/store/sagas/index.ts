import { all } from 'redux-saga/effects';

import { loadOrReloadBrowserViewSaga } from './loadOrReloadBrowserView';
import { displayOnlyBrowserViewXSaga } from './displayOnlyBrowserViewX';
import { setBrowserViewMutedSaga } from './setBrowserViewMuted';
import { transferIdentificationsSaga } from './transferIdentifications';
import { transferTransactionsSaga } from './transferTransactions';

export const sagas = function* rootSaga() {
  yield all([
    loadOrReloadBrowserViewSaga(),
    displayOnlyBrowserViewXSaga(),
    setBrowserViewMutedSaga(),
    transferTransactionsSaga(),
    transferIdentificationsSaga(),
  ]);
};
