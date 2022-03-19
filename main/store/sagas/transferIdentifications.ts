import { takeEvery, select } from 'redux-saga/effects';

import * as fromBrowserViews from '../browserViews';
import * as fromIdentifications from '../identifications';
import * as fromDapps from '../../../src/store/dapps';
import { DappyBrowserView } from '../../models';

const transferIdentifications = function* (action: any) {
  const payload: fromDapps.SaveIdentificationPayload = action.payload;
  const browserViews: {
    [tabId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);

  if (browserViews[payload.tabId] && browserViews[payload.tabId].browserView) {
    try {
      browserViews[payload.tabId].browserView.webContents.executeJavaScript(`
      if (typeof dappyRChain !== 'undefined') { dappyRChain.requestIdentifications() };
      if (typeof dappyEthereum !== 'undefined') { dappyEthereum.requestIdentifications() };
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
