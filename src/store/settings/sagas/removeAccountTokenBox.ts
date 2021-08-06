import { takeEvery, put, select } from 'redux-saga/effects';

import { browserUtils } from '../../browser-utils';
import * as fromSettings from '..';
import { Action } from '../..';
import { Account } from '../../../models';
import * as fromMain from '../../main';

const removeAccountTokenBox = function* (action: Action) {
  const payload: fromSettings.SaveAccountTokenBoxPayload = action.payload;
  const accounts: {
    [key: string]: Account;
  } = yield select(fromSettings.getAccounts);

  if (!accounts[payload.accountName]) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2058,
        error: 'Account not found',
      })
    );
  }
  const account = accounts[payload.accountName];
  const accountsToUpdate = {
    [payload.accountName]: {
      ...account,
      boxes: account.boxes.filter((s: string) => s !== payload.boxId),
    },
  };

  try {
    yield browserUtils.saveStorageIndexed('accounts', accountsToUpdate);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2057,
        error: 'Unable to update account',
        trace: e,
      })
    );
  }

  yield put(fromSettings.updateAccountCompletedAction({ accounts: { ...accountsToUpdate } }));
};

export const removeAccountTokenBoxSaga = function* () {
  yield takeEvery(fromSettings.REMOVE_ACCOUNT_TOKEN_BOX, removeAccountTokenBox);
};
