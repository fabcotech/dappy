import { takeEvery, select } from 'redux-saga/effects';

import { toHex } from '../../../src/utils/toHex';
import * as fromBrowserViews from '../browserViews';
import { DappyBrowserView } from '../../models';

function* eventuallyUpdateConnections(action: any) {
  const { payload } = action;
  const browserViews: {
    [tabId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);

  Object.keys(browserViews).forEach((id) => {
    const accountIds = Object.keys(browserViews[id].connections).filter((a) => {
      return a === payload.accountId;
    });
    if (accountIds.length) {
      accountIds.forEach((accountId: string) => {
        if (payload.chainId) {
          console.log(`[eth] chainId changed browser view ${id} and account ${accountId}`);
          browserViews[id].browserView.webContents.executeJavaScript(
            `window.ethereum.chainChanged({ chainId: "${toHex(payload.chainId as string)}"})`
          );
          browserViews[id].connections[accountId] = {
            ...browserViews[id].connections[accountId],
            chainId: payload.chainId,
          };
        } else {
          console.log(`[eth] disconnect browser view ${id} and account ${accountId}`);
          browserViews[id].browserView.webContents.executeJavaScript(
            'window.ethereum.disconnect()'
          );
          delete browserViews[id].connections[accountId];
        }
      });
    }
  });
}

export function* eventuallyUpdateConnectionsSaga() {
  yield takeEvery(fromBrowserViews.EVENTUALLY_UPDATE_CONNECTION, eventuallyUpdateConnections);
}
