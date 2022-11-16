import { takeEvery, select } from 'redux-saga/effects';

import * as fromBlockchain from '..';
import { Action } from '/store';
import { TransactionState } from '/models';
import { dispatchInMain } from '/interProcess';

function* transferTransactionState(action: Action) {
  let payload: undefined | fromBlockchain.SaveEthereumTransactionStatePayload;
  if (action.type === fromBlockchain.SAVE_ETHEREUM_TRANSACTION) {
    payload = action.payload as fromBlockchain.SaveEthereumTransactionStatePayload;
  }
  // should never happen
  if (!payload) {
    return;
  }

  const transactions: {
    [transactionId: string]: TransactionState;
  } = yield select(fromBlockchain.getTransactions);
  const transaction: TransactionState = transactions[payload.id];
  if (transaction.origin.origin === 'dapp') {
    dispatchInMain({
      type: '[MAIN] Transfer transactions',
      payload: transaction,
    });
  }
}

export function* transferTransactionStateSaga() {
  yield takeEvery(fromBlockchain.SAVE_ETHEREUM_TRANSACTION, transferTransactionState);
}
