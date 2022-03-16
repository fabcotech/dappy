import { takeEvery, select } from 'redux-saga/effects';

import * as fromDapps from '..';
import * as fromSettings from '../../settings';
import * as fromCookies from '../../cookies';
import { searchToAddress } from '../../../utils/searchToAddress';
import {  Cookie, Tab } from '../../../models';
import { Action } from '../../';
import { dispatchInMain } from '/interProcess';

const launchIpAppCompleted = function* (action: Action) {
  const payload: fromDapps.LaunchIpAppCompletedPayload = action.payload;
  const settings: fromSettings.Settings = yield select(fromSettings.getSettings);
  const tabs: Tab[] = yield select(fromDapps.getTabs);
  const cookies: { [address: string]: Cookie[] } = yield select(fromCookies.getCookies);

  const tab: Tab = tabs.find((t) => t.id === payload.ipApp.tabId) as Tab;

  const url = new URL(payload.ipApp.url);
  dispatchInMain({
    type: '[MAIN] Load or reload browser view',
    payload: {
      resourceId: payload.ipApp.id,
      tabId: payload.ipApp.tabId,
      muted: tab.muted,
      url: payload.ipApp.url,
      devMode: settings.devMode,
      html: undefined,
      title: payload.ipApp.url,
      cookies: cookies[url.host] || [],
    },
  });
};

export const launchIpAppCompletedSaga = function* () {
  try {
    yield takeEvery(fromDapps.LAUNCH_IP_APP_COMPLETED, launchIpAppCompleted);
  } catch (err) {
    console.log(err);
  }
};
