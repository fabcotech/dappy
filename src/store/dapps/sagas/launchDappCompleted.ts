import { takeEvery, select } from 'redux-saga/effects';

import * as fromDapps from '..';
import * as fromSettings from '../../settings';
import * as fromCookies from '../../cookies';
import { searchToAddress } from '../../../utils/searchToAddress';
import { Cookie, Tab } from '../../../models';
import { Action } from '../../';
import { dispatchInMain } from '/interProcess';

const launchDappCompleted = function* (action: Action) {
  const payload: fromDapps.LaunchDappCompletedPayload = action.payload;
  const settings: fromSettings.Settings = yield select(fromSettings.getSettings);
  const tabs: Tab[] = yield select(fromDapps.getTabs);
  const cookies: { [address: string]: Cookie[] } = yield select(fromCookies.getCookies);

  const tab: Tab = tabs.find((t) => t.id === payload.dapp.tabId) as Tab;


  const url = new URL(payload.dapp.url);
  dispatchInMain({
    type: '[MAIN] Load or reload browser view',
    payload: {
      resourceId: payload.dapp.id,
      tabId: tab.id,
      muted: tab.muted,
      title: payload.dapp.url,
      url: payload.dapp.url,
      devMode: settings.devMode,
      html: payload.dapp.html,
      cookies: cookies[url.host] || [],
    },
  });
};

export const launchDappCompletedSaga = function* () {
  try {
    yield takeEvery(fromDapps.LAUNCH_DAPP_COMPLETED, launchDappCompleted);
  } catch (err) {
    console.log(err);
  }
};
