import { all } from 'redux-saga/effects';

import { loadResourceSaga } from './loadResource';
import { launchTabCompletedSaga } from './launchTabCompleted';
import { removeTabSaga } from './removeTab';
import { saveTabsSaga } from './saveTabs';
import { saveFavsSaga } from './saveFavs';
import { transferIdentificationSaga } from './transferIdentification';
import { loadOrReloadResourceFailedSaga } from './loadOrReloadResourceFailed';
import { setTabMutedSaga } from './setTabMuted';

export const sagas = function* rootSaga() {
  yield all([
    loadResourceSaga(),
    launchTabCompletedSaga(),
    removeTabSaga(),
    saveTabsSaga(),
    saveFavsSaga(),
    transferIdentificationSaga(),
    loadOrReloadResourceFailedSaga(),
    setTabMutedSaga(),
  ]);
};
