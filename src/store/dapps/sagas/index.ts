import { all } from 'redux-saga/effects';

import { loadResourceSaga } from './loadResource';
import { reloadResourceSaga } from './reloadResource';
import { removeTabSaga } from './removeTab';
import { saveTabsSaga } from './saveTabs';
import { transferIdentificationSaga } from './transferIdentification';
import { stopSaga } from './stopTab';
import { loadOrReloadResourceFailedSaga } from './loadOrReloadResourceFailed';
import { setTabMutedSaga } from './setTabMuted';

export const sagas = function* rootSaga() {
  yield all([
    loadResourceSaga(),
    reloadResourceSaga(),
    removeTabSaga(),
    saveTabsSaga(),
    transferIdentificationSaga(),
    stopSaga(),
    loadOrReloadResourceFailedSaga(),
    setTabMutedSaga(),
  ]);
};
