import { put, takeEvery, select } from 'redux-saga/effects';

import { browserUtils } from '/store/browser-utils';
import * as fromSettings from '..';
import * as fromMain from '/store/main';
import { Action } from '/store';
import { Account } from '/models';

function* createAccount(action: Action) {
  const { payload } = action;
  let { account } = payload;
  const accounts: {
    [key: string]: Account;
  } = yield select(fromSettings.getAccounts);
  if (Object.keys(accounts).length === 0) {
    account = {
      ...account,
      main: true,
    };
  }

  try {
    yield browserUtils.saveStorageIndexed('accounts', { [account.name]: account });
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2034,
        error: 'Unable to create account',
        trace: e,
      })
    );
  }

  yield put(fromSettings.createAccountCompletedAction({ account }));
}

export function* createAccountSaga() {
  yield takeEvery(fromSettings.CREATE_ACCOUNT, createAccount);
}
