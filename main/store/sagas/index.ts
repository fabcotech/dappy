import { all } from 'redux-saga/effects';

import { transferTransactionsToDappsSaga } from './transferTransactionsToDapps';
import { transferIdentificationtionsToDappsSaga } from './transferIdentificationsToDapps';
import { loadOrReloadBrowserViewSaga } from './loadOrReloadBrowserView';
import { displayOnlyBrowserViewXSaga } from './displayOnlyBrowserViewX';
import { setBrowserViewMutedSaga } from './setBrowserViewMuted';

export const sagas = function* rootSaga() {
  yield all([
    transferTransactionsToDappsSaga(),
    transferIdentificationtionsToDappsSaga(),
    loadOrReloadBrowserViewSaga(),
    displayOnlyBrowserViewXSaga(),
    setBrowserViewMutedSaga(),
  ]);
};
