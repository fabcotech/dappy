import { Transaction } from 'electron';
import { takeEvery, select } from 'redux-saga/effects';

import * as fromBlockchain from '..';
import { Action } from '/store';
import { TransactionState } from '/models';
import { dispatchInMain } from '/interProcess';

const transferTransactionState = function* (action: Action) {
  let payload:
    | fromBlockchain.UpdateRChainTransactionStatusPayload
    | fromBlockchain.UpdateRChainTransactionValuePayload
    | fromBlockchain.SaveFailedRChainTransactionPayload
    | undefined;
  if (action.type === fromBlockchain.UPDATE_RCHAIN_TRANSACTION_STATUS) {
    payload = action.payload as fromBlockchain.UpdateRChainTransactionStatusPayload;
  } else if (action.type === fromBlockchain.UPDATE_RCHAIN_TRANSACTION_VALUE) {
    payload = action.payload as fromBlockchain.UpdateRChainTransactionValuePayload;
  } else {
    payload = action.payload as fromBlockchain.SaveFailedRChainTransactionPayload;
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
};

export const transferTransactionStateSaga = function* () {
  yield takeEvery(fromBlockchain.UPDATE_RCHAIN_TRANSACTION_STATUS, transferTransactionState);
  yield takeEvery(fromBlockchain.UPDATE_RCHAIN_TRANSACTION_VALUE, transferTransactionState);
  yield takeEvery(fromBlockchain.SAVE_FAILED_RCHAIN_TRANSACTION, transferTransactionState);
  yield takeEvery(fromBlockchain.SAVE_ETHEREUM_TRANSACTION, transferTransactionState);
};