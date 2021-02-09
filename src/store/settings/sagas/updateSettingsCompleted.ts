import { put, takeEvery, select } from 'redux-saga/effects';

import { browserUtils } from '../../browser-utils';
import * as fromSettings from '..';
import { Action } from '../..';

const updateSettingsCompleted = function* (action: Action) {
  let settings: fromSettings.Settings = yield select(fromSettings.getSettings);

  window.dispatchInMain({ type: '[MAIN] Sync settings', payload: settings });

  return undefined;
};

export const updateSettingsCompletedSaga = function* () {
  yield takeEvery(fromSettings.UPDATE_SETTINGS_COMPLETED, updateSettingsCompleted);
};
