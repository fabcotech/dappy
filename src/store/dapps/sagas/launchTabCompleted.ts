import { takeEvery, select } from 'redux-saga/effects';

import * as fromDapps from '..';
import * as fromSettings from '../../settings';
import { Tab } from '../../../models';
import { Action } from '../..';
import { dispatchInMain } from '/interProcess';

const launchTabCompleted = function* (action: Action) {
  const payload: fromDapps.LaunchTabCompletedPayload = action.payload;
  const settings: fromSettings.Settings = yield select(fromSettings.getSettings);
  const tabs: Tab[] = yield select(fromDapps.getTabs);

  const tab: Tab = tabs.find((t) => t.id === payload.tab.id) as Tab;

  const url = new URL(payload.tab.url);
  dispatchInMain({
    type: '[MAIN] Load or reload browser view',
    payload: {
      resourceId: tab.id,
      tabId: tab.id,
      muted: tab.muted,
      title: tab.title,
      url: tab.url,
      devMode: settings.devMode,
      html: undefined,
    },
  });
};

export const launchTabCompletedSaga = function* () {
  try {
    yield takeEvery(fromDapps.LAUNCH_TAB_COMPLETED, launchTabCompleted);
  } catch (err) {
    console.log(err);
  }
};
