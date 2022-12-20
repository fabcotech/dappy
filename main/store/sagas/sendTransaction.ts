import { call, takeEvery } from 'redux-saga/effects';
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import { sendRawTransaction } from '../../jsonRPCRequest';

import * as fromBlockchainsMain from '../blockchains';

export function* sendTransaction(action: any) {
  const serializedTransaction = FeeMarketEIP1559Transaction.fromTxData(action.payload.transaction)
    .serialize()
    .toString('hex');
  yield call(sendRawTransaction, action.payload.transaction.chainId, `0x${serializedTransaction}`);
}

export function* sendTransactionSaga() {
  yield takeEvery(fromBlockchainsMain.TRANSFER_TRANSACTION, sendTransaction);
}
