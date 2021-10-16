import { takeEvery, select } from 'redux-saga/effects';

import * as fromDapps from '..';
import * as fromSettings from '../../settings';
import * as fromCookies from '../../cookies';
import * as fromHistory from '../../history';
import { searchToAddress } from '../../../utils/searchToAddress';
import { Session, Cookie, Tab, IPServer, Record, SessionItem } from '../../../models';
import { Action } from '../../';
import { dispatchInMain } from '/interProcess';

const launchIpAppCompleted = function* (action: Action) {
  const payload: fromDapps.LaunchIpAppCompletedPayload = action.payload;
  const settings: fromSettings.Settings = yield select(fromSettings.getSettings);
  const tabs: Tab[] = yield select(fromDapps.getTabs);
  const cookies: { [address: string]: Cookie[] } = yield select(fromCookies.getCookies);
  const sessions: { [tabId: string]: Session } = yield select(fromHistory.getSessions);

  const tab: Tab = tabs.find((t) => t.id === payload.ipApp.tabId) as Tab;

  // used as identifier for session, indexeddb etc..., do not put path
  const dappyDomain = searchToAddress(payload.ipApp.search, payload.ipApp.chainId, '');

  // we know there are IP servers if it is an IP application
  const ipServers = payload.ipApp.record.servers as IPServer[];
  const serverIndex = ipServers.findIndex((s) => s.primary);

  let sessionItem: undefined | SessionItem = undefined;
  if (
    sessions[tab.id] &&
    // cursor not at last index
    sessions[tab.id].items.length - 1 !== sessions[tab.id].cursor &&
    sessions[tab.id].items[sessions[tab.id].cursor]
  ) {
    sessionItem = sessions[tab.id].items[sessions[tab.id].cursor];
  }

  let currentUrl = `https://${ipServers[serverIndex].host}`;
  // todo ????????
  // First check if we are navigating
  if (sessionItem && sessionItem.address) {
    currentUrl = sessionItem.address;
    // if not, check if there is a path ex: rchain/alphanetwork/dappy/contact (/contact is the path)
  } else if (payload.ipApp.path) {
    currentUrl = currentUrl + payload.ipApp.path;
    // if not, check if the ipApp has been loaded with a default url
  } else if (payload.ipApp.url) {
    currentUrl = payload.ipApp.url;
  }

  dispatchInMain({
    type: '[MAIN] Load or reload browser view',
    payload: {
      currentUrl: currentUrl,
      resourceId: payload.ipApp.id,
      tabId: payload.ipApp.tabId,
      muted: tab.muted,
      randomId: payload.ipApp.randomId,
      path: payload.ipApp.path,
      dappyDomain: dappyDomain,
      record: payload.ipApp.record,
      devMode: settings.devMode,
      html: undefined,
      title: payload.ipApp.name,
      cookies: cookies[dappyDomain] || [],
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
