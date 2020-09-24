import { put, takeEvery, select } from 'redux-saga/effects';

import { browserUtils } from '../../browser-utils';
import * as fromSettings from '..';
import { Action } from '../..';

const updateSettings = function*(action: Action) {
  let settings: fromSettings.Settings = yield select(fromSettings.getSettings);
  if (action.type === fromSettings.UPDATE_DEV_MODE) {
    const payload: fromSettings.UpdateDevModePayload = action.payload;
    settings.devMode = payload.flag;
  } else if (action.type === fromSettings.UPDATE_RESOLVER_SETTINGS) {
    const payload: fromSettings.Settings = action.payload;
    settings = {
      ...settings,
      ...payload,
    };
  }

  try {
    yield browserUtils.saveStorage('settings', settings);
  } catch (e) {
    yield put(
      fromSettings.updateSettingsFailedAction({
        errorCode: 2000,
        error: 'Unable to save settings',
        trace: e,
      })
    );
  }

  yield put(fromSettings.updateSettingsCompletedAction(settings));
};

export const updateSettingsSaga = function*() {
  yield takeEvery(fromSettings.UPDATE_RESOLVER_SETTINGS, updateSettings);
  yield takeEvery(fromSettings.UPDATE_DEV_MODE, updateSettings);
};
