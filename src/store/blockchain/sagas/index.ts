import { all } from 'redux-saga/effects';

import { saveBenchmarkToStorageSaga } from './saveBenchmarkToStorage';
import { saveRChainBlockchainInfoToStorageSaga } from './saveRChainBlockchaInInfoToStorage';
import { removeBlockchainInStorageSaga } from './removeBlockchainInStorage';
import { executeRChainCronJobsInfoSaga } from './executeRChainCronJobsInfo';
import { executeRecordsByPublicKeyCronJobsSaga } from './executeRecordsByPublicKeyCronJobs';
import { executeNodesCronJobsSaga } from './executeNodesCronJobs';
import { addRecordToStorageSaga } from './addRecordToStorage';
import { sendRChainTransactionSaga } from './sendRChainTransaction';
import { saveTransactionsToStorageSaga } from './saveTransactionsToStorage';
import { performPostTransactionSaga } from './performPostTransaction';
import { rChainTransactionErrorSaga } from './rChainTransactionError';
import { transferTransactionStateSaga } from './transferTransactionState';
import { removeOldRecordsSaga } from './removeOldRecords';

export const sagas = function* rootSaga() {
  yield all([
    saveBenchmarkToStorageSaga(),
    saveRChainBlockchainInfoToStorageSaga(),
    removeBlockchainInStorageSaga(),
    executeRChainCronJobsInfoSaga(),
    executeNodesCronJobsSaga(),
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
