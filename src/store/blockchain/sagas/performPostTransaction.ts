import { takeEvery, select } from 'redux-saga/effects';

import { TransactionStatus, TransactionState } from '/models';
import * as fromBlockchain from '..';
import * as fromMain from '/store/main';
import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import { Action, store } from '/store/';
import { searchToAddress } from '/utils/searchToAddress';

const performPostTransaction = function* (action: Action) {
  const payload: fromBlockchain.UpdateRChainTransactionStatusPayload = action.payload;
  if (payload.status !== TransactionStatus.Completed) {
    return true;
  }

  const transactions: {
    [transactionId: string]: TransactionState;
  } = yield select(fromBlockchain.getTransactions);

  return true;
};

export const performPostTransactionSaga = function* () {
  yield takeEvery(fromBlockchain.UPDATE_RCHAIN_TRANSACTION_STATUS, performPostTransaction);
};
