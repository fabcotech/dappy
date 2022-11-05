import { all } from 'redux-saga/effects';

import { saveRChainBlockchainInfoToStorageSaga } from './saveRChainBlockchaInInfoToStorage';
import { sendRChainTransactionSaga } from './sendRChainTransaction';
import { saveTransactionsToStorageSaga } from './saveTransactionsToStorage';
import { performPostTransactionSaga } from './performPostTransaction';
import { rChainTransactionErrorSaga } from './rChainTransactionError';
import { transferTransactionStateSaga } from './transferTransactionState';

export const sagas = function* rootSaga() {
  yield all([
    saveRChainBlockchainInfoToStorageSaga(),
    sendRChainTransactionSaga(),
    performPostTransactionSaga(),
    rChainTransactionErrorSaga(),
    transferTransactionStateSaga(),
    saveTransactionsToStorageSaga(),
  ]);
};
