import { takeEvery, put, select } from 'redux-saga/effects';

import { browserUtils } from '../../browser-utils';
import * as fromSettings from '..';
import { Action } from '../..';
import * as fromMain from '../../main';

const saveAccountTokenBox = function* (action: Action) {
  const payload: fromSettings.SaveAccountTokenBoxPayload = action.payload;
  const accounts = yield select(fromSettings.getAccounts);

  if (!accounts[payload.accountName]) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2056,
        error: 'Account not found',
      })
    );
  }
  const account = accounts[payload.accountName];
  const accountsToUpdate = {
    [payload.accountName]: account,
  };
  if (!account.boxes.includes(payload.registryUri)) {
    accountsToUpdate[payload.accountName] = {
      ...account,
      boxes: account.boxes.concat(payload.registryUri),
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
