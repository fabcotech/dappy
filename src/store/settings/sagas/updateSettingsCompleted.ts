import { takeEvery, select } from 'redux-saga/effects';

import * as fromSettings from '..';
import { dispatchInMain } from '/interProcess';

function* updateSettingsCompleted() {
  const settings: fromSettings.Settings = yield select(fromSettings.getSettings);
  const accounts: fromSettings.State['accounts'] = yield select(fromSettings.getAccounts);

  dispatchInMain({ type: '[MAIN] Sync settings', payload: { settings, accounts } });

  return undefined;
}

export function* updateSettingsCompletedSaga() {
  yield takeEvery(fromSettings.UPDATE_SETTINGS_COMPLETED, updateSettingsCompleted);
  yield takeEvery(fromSettings.UPDATE_ACCOUNTS_COMPLETED, updateSettingsCompleted);
  yield takeEvery(fromSettings.UPDATE_ACCOUNTS_FROM_STORAGE, updateSettingsCompleted);
  yield takeEvery(fromSettings.UPDATE_SETTINGS_COMPLETED, updateSettingsCompleted);
  yield takeEvery(fromSettings.CREATE_ACCOUNT_COMPLETED, updateSettingsCompleted);
}
