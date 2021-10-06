import { takeEvery, select } from 'redux-saga/effects';

import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import * as fromMain from '../';
import { Action } from '/store';

// todo can it be triggered not for every actions ????
const browserViewToBeDisplayed = function* (action: Action) {
  const shouldBrowserViewsBeDisplayed: undefined | string = yield select(fromMain.getShouldBrowserViewsBeDisplayed);
  window.dispatchInMain({
    type: '[MAIN] Display only browser view x',
    payload: {
      resourceId: shouldBrowserViewsBeDisplayed,
    },
  });
  return undefined;
};

export const browserViewToBeDisplayedSaga = function* () {
  yield takeEvery(fromUi.NAVIGATE, browserViewToBeDisplayed);
  yield takeEvery(fromUi.UPDATE_NAVIGATION_SUGGESTIONS_DISPLAY, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.FOCUS_TAB, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.FOCUS_SEARCH_DAPP, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.FOCUS_AND_ACTIVATE_TAB, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.STOP_TAB, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.LAUNCH_DAPP_COMPLETED, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.LAUNCH_IP_APP_COMPLETED, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.LAUNCH_FILE_COMPLETED, browserViewToBeDisplayed);
  yield takeEvery(fromMain.UPDATE_INITIALIZATION_OVER, browserViewToBeDisplayed);
  yield takeEvery(fromMain.OPEN_DAPP_MODAL, browserViewToBeDisplayed);
  yield takeEvery(fromMain.OPEN_MODAL, browserViewToBeDisplayed);
  yield takeEvery(fromMain.CLOSE_MODAL, browserViewToBeDisplayed);
  yield takeEvery(fromMain.CLOSE_DAPP_MODAL, browserViewToBeDisplayed);
  yield takeEvery(fromMain.CLOSE_ALL_DAPP_MODALS, browserViewToBeDisplayed);
};
