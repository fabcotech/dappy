import { takeEvery, select } from 'redux-saga/effects';

import * as fromSettings from '..';
import { Action } from '/store';
import { dispatchInMain } from '/interProcess';

const updateSettingsCompleted = function* (action: Action) {
  let settings: fromSettings.Settings = yield select(fromSettings.getSettings);

  dispatchInMain({ type: '[MAIN] Sync settings', payload: settings });

  return undefined;
};

export const updateSettingsCompletedSaga = function* () {
  yield takeEvery(fromSettings.UPDATE_SETTINGS_COMPLETED, updateSettingsCompleted);
};
