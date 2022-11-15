import { takeEvery, select } from 'redux-saga/effects';

import { CertificateAccount, Tab } from '/models';
import { dispatchInMain } from '/interProcess';
import { getCertificateAccounts } from '/store/settings';
import * as fromDapps from '..';
import { Action } from '../..';
import { getDomainWallets } from '/utils/wallets';

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
      clientCertificate: getDomainWallets(clientCertificates, {
        domain: new URL(tab.url).hostname,
        platform: 'certificate',
      }),
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
