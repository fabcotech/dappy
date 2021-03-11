import { all } from 'redux-saga/effects';

import { updateSettingsSaga } from './updateSettings';
import { saveBlockchainsToStorageSaga } from './saveBlockchainsToStorageSaga';
import { removeBlockchainsToStorageSaga } from './removeBlockchainToStorageSaga';
import { createAccountSaga } from './createAccountSaga';
import { deleteAccountSaga } from './deleteAccountSaga';
import { updateAccountSaga } from './updateAccountSaga';
import { updateBlockchainsCompletedSaga } from './updateBlockchainsCompleted';
import { updateSettingsCompletedSaga } from './updateSettingsCompleted';
import { executeAccountsCronJobsSaga } from './executeAccountsCronJobs';
import { saveAccountTokenBoxSaga } from './saveAccountTokenBox';
import { removeAccountTokenBoxSaga } from './removeAccountTokenBox';

export const sagas = function* rootSaga() {
  yield all([
    updateSettingsSaga(),
    saveBlockchainsToStorageSaga(),
    removeBlockchainsToStorageSaga(),
    createAccountSaga(),
    deleteAccountSaga(),
    updateAccountSaga(),
    updateBlockchainsCompletedSaga(),
    updateSettingsCompletedSaga(),
    executeAccountsCronJobsSaga(),
    saveAccountTokenBoxSaga(),
    removeAccountTokenBoxSaga(),
  ]);
};
