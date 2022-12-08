import { all } from 'redux-saga/effects';

import { loadOrReloadBrowserViewSaga } from './loadOrReloadBrowserView';
import { goForwardOrBackwardSaga } from './goForwardOrBackward';
import { displayOnlyBrowserViewXSaga } from './displayOnlyBrowserViewX';
import { setBrowserViewMutedSaga } from './setBrowserViewMuted';
import { eventuallyUpdateConnectionsSaga } from './eventuallyUpdateConnections';

export const sagas = function* rootSaga() {
  yield all([
    loadOrReloadBrowserViewSaga(),
    displayOnlyBrowserViewXSaga(),
    goForwardOrBackwardSaga(),
    setBrowserViewMutedSaga(),
    eventuallyUpdateConnectionsSaga(),
  ]);
};
