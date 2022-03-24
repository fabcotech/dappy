import { takeEvery, select, put } from 'redux-saga/effects';

import * as fromBrowserViewsMain from '../browserViews';
import { DappyBrowserView } from '../../models';

const displayOnlyBrowserViewX = function*(action: any) {
  const payload = action.payload;
  const browserViews: {
    [tabId: string]: DappyBrowserView;
  } = yield select(fromBrowserViewsMain.getBrowserViewsMain);
  const position: { x: number; y: number; width: number; height: number } = yield select(
    fromBrowserViewsMain.getBrowserViewsPositionMain
  );
  let newBrowserViews = {};
  let modified = false;
  Object.keys(browserViews).forEach(id => {
    if (id !== payload.tabId && browserViews[id].visible) {
      modified = true;
      browserViews[id].browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      newBrowserViews = {
        ...newBrowserViews,
        [id]: {
          ...browserViews[id],
          visible: false,
        },
      };
    } else if (id === payload.tabId && !browserViews[id].visible) {
      modified = true;
      browserViews[id].browserView.setBounds(position);
      newBrowserViews = {
        ...newBrowserViews,
        [id]: {
          ...browserViews[id],
          visible: true,
        },
      };
    }
  });

  if (modified) {
    yield put({
      type: fromBrowserViewsMain.DISPLAY_ONLY_BROWSER_VIEW_X_COMPLETED,
      payload: newBrowserViews,
    });
  }

  return undefined;
};

export const displayOnlyBrowserViewXSaga = function*() {
  yield takeEvery(fromBrowserViewsMain.DISPLAY_ONLY_BROWSER_VIEW_X, displayOnlyBrowserViewX);
};
