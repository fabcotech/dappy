import { takeEvery, select } from 'redux-saga/effects';

import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import * as fromMain from '..';
import { dispatchInMain } from '/interProcess';

// todo can it be triggered not for every actions ????
function* browserViewToBeDisplayed() {
  const shouldBrowserViewsBeDisplayed: undefined | string = yield select(
    fromMain.getShouldBrowserViewsBeDisplayed
  );

  dispatchInMain({
    type: '[MAIN] Display only browser view x',
    payload: {
      tabId: shouldBrowserViewsBeDisplayed,
    },
  });
  return undefined;
}

export function* browserViewToBeDisplayedSaga() {
  yield takeEvery(fromUi.NAVIGATE, browserViewToBeDisplayed);
  yield takeEvery(fromUi.UPDATE_NAVIGATION_SUGGESTIONS_DISPLAY, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.FOCUS_TAB, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.UNFOCUS_ALL_TABS, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.FOCUS_AND_ACTIVATE_TAB, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.STOP_TAB, browserViewToBeDisplayed);
  yield takeEvery(fromDapps.LAUNCH_TAB_COMPLETED, browserViewToBeDisplayed);
  yield takeEvery(fromMain.UPDATE_INITIALIZATION_OVER, browserViewToBeDisplayed);
  yield takeEvery(fromMain.OPEN_DAPP_MODAL, browserViewToBeDisplayed);
  yield takeEvery(fromMain.OPEN_MODAL, browserViewToBeDisplayed);
  yield takeEvery(fromMain.CLOSE_MODAL, browserViewToBeDisplayed);
  yield takeEvery(fromMain.CLOSE_DAPP_MODAL, browserViewToBeDisplayed);
  yield takeEvery(fromMain.CLOSE_ALL_DAPP_MODALS, browserViewToBeDisplayed);
}
