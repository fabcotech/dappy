import { takeEvery, select } from 'redux-saga/effects';

import * as fromBrowserViews from '../browserViews';
import { DappyBrowserView } from '../../models';

function* setBrowserViewMuted(action: any) {
  const payload = action.payload;
  const browserViews: {
    [tabId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);

  if (!browserViews[payload.tabId]) {
    console.error('Did not find browserView, cannot mute/unmute');
    return;
  }

  browserViews[payload.tabId].browserView.webContents.setAudioMuted(payload.muted);
}

export function* setBrowserViewMutedSaga() {
  yield takeEvery(fromBrowserViews.SET_BROWSER_VIEW_MUTED, setBrowserViewMuted);
}
