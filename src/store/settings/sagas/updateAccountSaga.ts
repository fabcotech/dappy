import { put, takeEvery, select } from 'redux-saga/effects';

import { Account } from '/models';
import { browserUtils } from '/store/browser-utils';
import * as fromSettings from '..';
import * as fromMain from '/store/main';
import { Action } from '/store';

const updateAccount = function*(action: Action) {
  const accounts: {
    [key: string]: Account;
  } = yield select(fromSettings.getAccounts);
  let accountsToUpdate: {
    [key: string]: Account;
  } = {};
  if (action.type === fromSettings.UPDATE_ACCOUNT) {
    const payload: fromSettings.CreateAccountPayload = action.payload;
    let account = payload.account;

    accountsToUpdate = {
      [account.name]: account,
    };

    const otherMainAccountName: undefined | string = Object.keys(accounts).find(
      k => otherMainAccountName !== account.name && accounts[k].main == true
    );
    if (account.main && otherMainAccountName) {
      accountsToUpdate[otherMainAccountName] = {
        ...accounts[otherMainAccountName],
        main: false,
      };
    }
  } else if (action.type === fromSettings.UPDATE_ACCOUNTS_BALANCE) {
    accountsToUpdate = accounts;
  }

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
};

export const updateAccountSaga = function*() {
  yield takeEvery(fromSettings.UPDATE_ACCOUNT, updateAccount);
  yield takeEvery(fromSettings.UPDATE_ACCOUNTS_BALANCE, updateAccount);
};
