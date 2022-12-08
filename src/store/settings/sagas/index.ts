import { all } from 'redux-saga/effects';

import { updateSettingsSaga } from './updateSettings';
import { saveBlockchainsToStorageSaga } from './saveBlockchainsToStorageSaga';
import { removeBlockchainsToStorageSaga } from './removeBlockchainToStorageSaga';
import { createAccountSaga } from './createAccountSaga';
import { deleteAccountSaga } from './deleteAccountSaga';
import { updateAccountSaga } from './updateAccountSaga';
import { executeAccountsCronJobsSaga } from './executeAccountsCronJobsSaga';
import { updateBlockchainsCompletedSaga } from './updateBlockchainsCompleted';
import { updateSettingsCompletedSaga } from './updateSettingsCompleted';

export const sagas = function* rootSaga() {
  yield all([
    updateSettingsSaga(),
    saveBlockchainsToStorageSaga(),
    removeBlockchainsToStorageSaga(),
    createAccountSaga(),
    deleteAccountSaga(),
    updateAccountSaga(),
    executeAccountsCronJobsSaga(),
    updateBlockchainsCompletedSaga(),
    updateSettingsCompletedSaga(),
  ]);
};
