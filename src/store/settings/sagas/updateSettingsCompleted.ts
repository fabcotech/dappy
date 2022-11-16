import { takeEvery, select } from 'redux-saga/effects';

import * as fromSettings from '..';
import { dispatchInMain } from '/interProcess';

function* updateSettingsCompleted() {
  const settings: fromSettings.Settings = yield select(fromSettings.getSettings);

  dispatchInMain({ type: '[MAIN] Sync settings', payload: settings });

  return undefined;
}

export function* updateSettingsCompletedSaga() {
  yield takeEvery(fromSettings.UPDATE_SETTINGS_COMPLETED, updateSettingsCompleted);
}
