import { takeEvery, put, select } from 'redux-saga/effects';

import { browserUtils } from '/store/browser-utils';
import * as fromSettings from '..';
import { Action } from '/store';
import * as fromMain from '/store/main';
import { Account } from '/models/'

const saveAccountTokenBox = function* (action: Action) {
  const payload: fromSettings.SaveAccountTokenBoxPayload = action.payload;
  const accounts: { [key: string]: Account } = yield select(fromSettings.getAccounts);

  if (!accounts[payload.accountName]) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2056,
        error: 'Account not found',
      })
    );
  }
  const account = accounts[payload.accountName] as Account;
  const accountsToUpdate = {
    [payload.accountName]: account,
  };
  if (!account.boxes.includes(payload.boxId)) {
    accountsToUpdate[payload.accountName] = {
      ...account,
      boxes: account.boxes.concat(payload.boxId),
    };
  }
  console.log(accountsToUpdate);

  try {
    yield browserUtils.saveStorageIndexed('accounts', accountsToUpdate);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2054,
        error: 'Unable to update account',
        trace: e,
      })
    );
  }

  yield put(fromSettings.updateAccountCompletedAction({ accounts: { ...accountsToUpdate } }));
};

export const saveAccountTokenBoxSaga = function* () {
  yield takeEvery(fromSettings.SAVE_ACCOUNT_TOKEN_BOX, saveAccountTokenBox);
};
