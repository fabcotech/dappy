import { takeEvery, select } from 'redux-saga/effects';

import * as fromBlockchain from '..';
import * as fromMain from '/store/main';
import { browserUtils } from '/store/browser-utils';
import { Action, store } from '/store/';
import { TransactionState } from '/models';

const saveTransactionsToStorage = function* (action: Action) {
  const payload: fromBlockchain.SaveFailedRChainTransactionPayload | fromBlockchain.SendRChainTransactionPayload =
    action.payload;

  const transactions: {
    [transactionId: string]: TransactionState;
  } = yield select(fromBlockchain.getTransactions);

  const transaction: TransactionState = transactions[payload.id];
  // should never happen
  if (!transaction) {
    return true;
  }

  browserUtils.saveStorageIndexed('transactions', { [transaction.id]: transaction }).catch((err) => {
    store.dispatch(
      fromMain.saveErrorAction({
        errorCode: 2048,
        error: 'Unable to save transactions to storage',
        trace: err,
      })
    );
  });
  return true;
};

export const saveTransactionsToStorageSaga = function* () {
  yield takeEvery(fromBlockchain.ADD_RCHAIN_TRANSACTION, saveTransactionsToStorage);
  yield takeEvery(fromBlockchain.SEND_RCHAIN_TRANSACTION, saveTransactionsToStorage);
  yield takeEvery(fromBlockchain.SAVE_FAILED_RCHAIN_TRANSACTION, saveTransactionsToStorage);
  yield takeEvery(fromBlockchain.UPDATE_RCHAIN_TRANSACTION_STATUS, saveTransactionsToStorage);
  yield takeEvery(fromBlockchain.UPDATE_RCHAIN_TRANSACTION_VALUE, saveTransactionsToStorage);
};
