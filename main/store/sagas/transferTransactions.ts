import { takeEvery, select } from 'redux-saga/effects';

import * as fromBrowserViews from '../browserViews';
import * as fromTransactions from '../transactions';
import { TransactionOriginDapp, TransactionState } from '../../../src/models';
import { DappyBrowserView } from '../../models';

const transferTransactions = function* (action: any) {
  const payload: TransactionState = action.payload;
  const tabId = (payload.origin as TransactionOriginDapp).tabId;
  const browserViews: {
    [tabId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);

  if (browserViews[tabId] && browserViews[tabId].browserView) {
    try {
      browserViews[tabId].browserView.webContents.executeJavaScript(`
      if (typeof dappyRChain !== 'undefined') { dappyRChain.requestTransactions() };
      if (typeof dappyEthereum !== 'undefined') { dappyEthereum.requestTransactions() };
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
