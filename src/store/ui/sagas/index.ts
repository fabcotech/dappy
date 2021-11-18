import { fork, all } from 'redux-saga/effects';

import { saveUiToStorageSaga } from './saveUiToStorageSaga';
import { cronJobContractLogs } from './cronJobContractLogs';

export const sagas = function* rootSaga() {
  yield all([saveUiToStorageSaga(), cronJobContractLogs()]);
};
