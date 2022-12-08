import { put, takeEvery, select } from 'redux-saga/effects';

import { Account } from '/models';
import { browserUtils } from '/store/browser-utils';
import * as fromSettings from '..';
import * as fromMain from '/store/main';
import { Action } from '/store';
import { dispatchInMain } from '/interProcess';

function* updateAccount(action: Action) {
  const accounts: {
    [key: string]: Account;
  } = yield select(fromSettings.getAccounts);
  let accountsToUpdate: {
    [key: string]: Account;
  } = {};

  const { payload } = action;
  const { account } = payload;

  accountsToUpdate = {
    [account.name]: account,
  };

  const otherMainAccountName: undefined | string = Object.keys(accounts).find(
    (k) => otherMainAccountName !== account.name && accounts[k].main === true
  );
  if (account.main && otherMainAccountName) {
    accountsToUpdate[otherMainAccountName] = {
      ...accounts[otherMainAccountName],
      main: false,
    };
  }

  dispatchInMain({
    type: '[MAIN] Eventually update connections',
    payload: { accountId: account.name, chainId: account.chainId },
  });

  try {
    yield browserUtils.saveStorageIndexed('accounts', accountsToUpdate);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2035,
        error: 'Unable to update account',
        trace: e,
      })
    );
  }

  yield put(fromSettings.updateAccountCompletedAction({ accounts: { ...accountsToUpdate } }));
}

export function* updateAccountSaga() {
  yield takeEvery(fromSettings.UPDATE_ACCOUNT, updateAccount);
}
