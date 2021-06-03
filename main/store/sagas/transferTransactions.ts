import { takeEvery, select } from 'redux-saga/effects';

import * as fromBrowserViews from '../browserViews';
import * as fromTransactions from '../transactions';
import { TransactionOriginDapp, TransactionState } from '../../../src/models';
import { DappyBrowserView } from '../../models';

const transferTransactions = function* (action: any) {
  const payload: TransactionState = action.payload;
  const dappId = (payload.origin as TransactionOriginDapp).dappId;
  const browserViews: {
    [resourceId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);

  if (browserViews[dappId] && browserViews[dappId].browserView) {
    try {
      browserViews[dappId].browserView.webContents.executeJavaScript(`
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
