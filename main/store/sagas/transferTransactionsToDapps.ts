import { takeEvery, select } from 'redux-saga/effects';

import * as fromTransactions from '../transactions';
import * as fromBrowserViews from '../browserViews';
import * as fromCommon from '../../../src/common';
import { State as BrowserViewsState } from '../browserViews';
import { TransactionState, TransactionOriginDapp } from '../../../src/models';

const transferTransactionsToDapps = function*(action: any) {
  const payload: { [transactionId: string]: TransactionState } = action.payload;

  const transactionsToTransfer: { [dappId: string]: { [transactionId: string]: TransactionState } } = {};
  Object.keys(payload).forEach(k => {
    if (payload[k].origin.origin === 'dapp') {
      const origin = payload[k].origin as TransactionOriginDapp;
      if (!transactionsToTransfer[origin.dappId]) {
        transactionsToTransfer[origin.dappId] = {};
      }
      transactionsToTransfer[origin.dappId] = {
        ...transactionsToTransfer[origin.dappId],
        [k]: payload[k],
      };
    }
  });

  const browserViews = yield select(fromBrowserViews.getBrowserViewsMain);

  Object.keys(transactionsToTransfer).forEach(dappId => {
    if (!browserViews[dappId]) {
      console.log('error cannot transfer transaction to not found browser view');
      return;
    }
    if (!browserViews[dappId].commEvent) {
      console.log('error cannot transfer transaction to browser view (no comm event)');
      return;
    }

    browserViews[dappId].commEvent.reply(
      'message-from-main',
      fromCommon.updateTransactionsAction({ transactions: transactionsToTransfer[dappId] })
    );
  });
};

export const transferTransactionsToDappsSaga = function*() {
  yield takeEvery(fromTransactions.TRANSFER_TRANSACTIONS, transferTransactionsToDapps);
};
