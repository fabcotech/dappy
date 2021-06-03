import { takeEvery, select } from 'redux-saga/effects';

import * as fromBrowserViews from '../browserViews';
import * as fromIdentifications from '../identifications';
import * as fromDapps from '../../../src/store/dapps';
import { DappyBrowserView } from '../../models';

const transferIdentifications = function* (action: any) {
  const payload: fromDapps.SaveIdentificationPayload = action.payload;
  const browserViews: {
    [resourceId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);

  if (browserViews[payload.dappId] && browserViews[payload.dappId].browserView) {
    try {
      browserViews[payload.dappId].browserView.webContents.executeJavaScript(`
      if (typeof dappyRChain !== 'undefined') { dappyRChain.requestIdentifications() };
      `);
    } catch (e) {
      console.error('Could not execute javascript and transfer identifications');
      console.log(e);
    }
  } else {
    console.error('Did not find browserView, cannot transfer identifications');
  }

  return undefined;
};

export const transferIdentificationsSaga = function* () {
  yield takeEvery(fromIdentifications.TRANSFER_IDENTIFICATIONS, transferIdentifications);
};
