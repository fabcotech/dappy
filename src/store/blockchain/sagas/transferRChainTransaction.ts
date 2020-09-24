import { takeEvery, select } from 'redux-saga/effects';

import * as fromBlockchain from '..';
import { Action } from '../..';

const transferRChainTransaction = function*(action: Action) {
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

  const transactions = yield select(fromBlockchain.getTransactions);
  const transaction = transactions[payload.id];
  window.dispatchInMain(window.uniqueEphemeralToken, {
    type: '[MAIN] Transfer transactions',
    payload: { [payload.id]: transaction },
  });
};

export const transferRChainTransactionSaga = function*() {
  yield takeEvery(fromBlockchain.UPDATE_RCHAIN_TRANSACTION_STATUS, transferRChainTransaction);
  yield takeEvery(fromBlockchain.UPDATE_RCHAIN_TRANSACTION_VALUE, transferRChainTransaction);
  yield takeEvery(fromBlockchain.SAVE_FAILED_RCHAIN_TRANSACTION, transferRChainTransaction);
};
