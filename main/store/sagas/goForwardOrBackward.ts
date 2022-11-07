import { takeEvery, select } from 'redux-saga/effects';

import * as fromBrowserViews from '../browserViews';
import { DappyBrowserView } from '../../models';

function* goForwardOrBackward(action: any) {
  const { payload, type }: { type: string; payload: { tabId: string } } = action;
  const browserViews: {
    [tabId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);

  console.log(browserViews[payload.tabId]);
  console.log(payload);

  if (browserViews[payload.tabId]) {
    if (type === fromBrowserViews.GO_BACKWARD) {
      if (browserViews[payload.tabId].browserView.webContents.canGoBack()) {
        browserViews[payload.tabId].browserView.webContents.goBack();
      } else {
        console.warn('[nav] Browser tries to go backward but bv cannot');
      }
      return;
    }
    if (browserViews[payload.tabId].browserView.webContents.canGoForward()) {
      browserViews[payload.tabId].browserView.webContents.goForward();
    } else {
      console.warn('[nav] Browser tries to go forward but bv cannot');
    }
  } else {
    console.warn('[nav] Browser tries to go forward or backward on a bv that does not exist');
  }
}

export function* goForwardOrBackwardSaga() {
  yield takeEvery(fromBrowserViews.GO_FORWARD, goForwardOrBackward);
  yield takeEvery(fromBrowserViews.GO_BACKWARD, goForwardOrBackward);
}
