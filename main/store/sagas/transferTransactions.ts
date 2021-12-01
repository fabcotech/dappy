import { takeEvery, select } from 'redux-saga/effects';

import * as fromBrowserViews from '../browserViews';
import * as fromTransactions from '../transactions';
import { TransactionOriginDapp, TransactionState } from '../../../src/models';
import { DappyBrowserView } from '../../models';

const transferTransactions = function* (action: any) {
  const payload: TransactionState = action.payload;
  const resourceId = (payload.origin as TransactionOriginDapp).resourceId;
  const browserViews: {
    [resourceId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);

  if (browserViews[resourceId] && browserViews[resourceId].browserView) {
    try {
      browserViews[resourceId].browserView.webContents.executeJavaScript(`
      if (typeof dappyRChain !== 'undefined') { dappyRChain.requestTransactions() };
      `);
    } catch (e) {
      console.error('Could not execute javascript and transfer transactions');
      console.log(e);
    }
  } else {
    console.error('Did not find browserView, cannot transfer transactions');
  }

  return undefined;
};

export const transferTransactionsSaga = function* () {
  yield takeEvery(fromTransactions.TRANSFER_TRANSACTIONS, transferTransactions);
};
