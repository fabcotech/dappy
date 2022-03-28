import { all } from 'redux-saga/effects';

import { saveRChainBlockchainInfoToStorageSaga } from './saveRChainBlockchaInInfoToStorage';
import { executeRChainCronJobsInfoSaga } from './executeRChainCronJobsInfo';
import { executeRecordsByPublicKeyCronJobsSaga } from './executeRecordsByPublicKeyCronJobs';
import { addRecordToStorageSaga } from './addRecordToStorage';
import { sendRChainTransactionSaga } from './sendRChainTransaction';
import { saveTransactionsToStorageSaga } from './saveTransactionsToStorage';
import { performPostTransactionSaga } from './performPostTransaction';
import { rChainTransactionErrorSaga } from './rChainTransactionError';
import { transferTransactionStateSaga } from './transferTransactionState';
import { removeOldRecordsSaga } from './removeOldRecords';

export const sagas = function* rootSaga() {
  yield all([
    saveRChainBlockchainInfoToStorageSaga(),
    executeRChainCronJobsInfoSaga(),
    executeRecordsByPublicKeyCronJobsSaga(),
    addRecordToStorageSaga(),
    sendRChainTransactionSaga(),
    performPostTransactionSaga(),
    rChainTransactionErrorSaga(),
    transferTransactionStateSaga(),
    removeOldRecordsSaga(),
    saveTransactionsToStorageSaga(),
  ]);
};
