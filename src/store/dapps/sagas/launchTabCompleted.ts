import { takeEvery, select } from 'redux-saga/effects';

import { CertificateAccount, Tab } from '/models';
import { dispatchInMain } from '/interProcess';
import { getCertificateAccounts } from '/store/settings';
import * as fromDapps from '..';
import { Action } from '../..';

export function getDomainClientCertificate(
  clientCertificates: Record<string, CertificateAccount>,
  domain: string
) {
  return Object.entries(clientCertificates)
    .map(([, a]) => a)
    .sort((a1, a2) => Number(a2.main) - Number(a1.main))
    .find((a) => {
      const hosts = a.whitelist.map(({ host }) => host);
      return hosts.includes(domain) || hosts.includes('*');
    });
}

function* launchTabCompleted(action: Action) {
  const { payload } = action;
  const tabs: Tab[] = yield select(fromDapps.getTabs);

  const tab: Tab = tabs.find((t) => t.id === payload.tab.id) as Tab;

  const clientCertificates: Record<string, CertificateAccount> = yield select(
    getCertificateAccounts
  );

  dispatchInMain({
    type: '[MAIN] Load or reload browser view',
    payload: {
      tab,
      clientCertificate: getDomainClientCertificate(clientCertificates, new URL(tab.url).hostname),
    },
  });
}

export function* launchTabCompletedSaga() {
  try {
    yield takeEvery(fromDapps.LAUNCH_TAB_COMPLETED, launchTabCompleted);
  } catch (err) {
    console.log(err);
  }
}
