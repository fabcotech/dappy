import { all } from 'redux-saga/effects';

import { saveBenchmarkToStorageSaga } from './saveBenchmarkToStorage';
import { saveRChainBlockchainInfoToStorageSaga } from './saveRChainBlockchaInInfoToStorage';
import { removeBlockchainInStorageSaga } from './removeBlockchainInStorage';
import { executeRChainCronJobsInfoSaga } from './executeRChainCronJobsInfo';
import { executeRecordsByPublicKeyCronJobsSaga } from './executeRecordsByPublicKeyCronJobs';
import { executeNodesCronJobsSaga } from './executeNodesCronJobs';
import { saveRecordsToStorageSaga } from './saveRecordsToStorage';
import { addRecordToStorageSaga } from './addRecordToStorage';
import { sendRChainTransactionSaga } from './sendRChainTransaction';
import { sendRChainTransactionWithFileSaga } from './sendRChainTransactionWithFile';
import { saveTransactionsToStorageSaga } from './saveTransactionsToStorage';
import { performPostTransactionSaga } from './performPostTransaction';
import { rChainTransactionErrorSaga } from './rChainTransactionError';
import { transferRChainTransactionSaga } from './transferRChainTransaction';
import { removeOldRecordsSaga } from './removeOldRecords';

export const sagas = function* rootSaga() {
  yield all([
    saveBenchmarkToStorageSaga(),
    saveRChainBlockchainInfoToStorageSaga(),
    removeBlockchainInStorageSaga(),
    executeRChainCronJobsInfoSaga(),
    executeNodesCronJobsSaga(),
    executeRecordsByPublicKeyCronJobsSaga(),
    saveRecordsToStorageSaga(),
    addRecordToStorageSaga(),
    sendRChainTransactionSaga(),
    sendRChainTransactionWithFileSaga(),
    performPostTransactionSaga(),
    rChainTransactionErrorSaga(),
    transferRChainTransactionSaga(),
    removeOldRecordsSaga(),
    saveTransactionsToStorageSaga(),
  ]);
};
