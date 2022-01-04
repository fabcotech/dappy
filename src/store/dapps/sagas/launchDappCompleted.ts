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

  // used as identifier for session, indexeddb etc..., do not put path
  const dappyDomain = searchToAddress(payload.dapp.search, payload.dapp.chainId, '');

  dispatchInMain({
    type: '[MAIN] Load or reload browser view',
    payload: {
      // $ is forbidden character, we know that this will
      // be a dapp and not IP app if it starts with $
      currentUrl: `$dapp`,
      resourceId: payload.dapp.id,
      tabId: tab.id,
      muted: tab.muted,
      path: payload.dapp.path,
      title: payload.dapp.title,
      dappyDomain: dappyDomain,
      devMode: settings.devMode,
      record: payload.dapp.record,
      html: payload.dapp.html,
      cookies: cookies[dappyDomain] || [],
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
