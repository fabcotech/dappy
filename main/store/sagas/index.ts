import { all } from 'redux-saga/effects';

import { loadOrReloadBrowserViewSaga } from './loadOrReloadBrowserView';
import { displayOnlyBrowserViewXSaga } from './displayOnlyBrowserViewX';
import { setBrowserViewMutedSaga } from './setBrowserViewMuted';

export const sagas = function* rootSaga() {
  yield all([loadOrReloadBrowserViewSaga(), displayOnlyBrowserViewXSaga(), setBrowserViewMutedSaga()]);
};
