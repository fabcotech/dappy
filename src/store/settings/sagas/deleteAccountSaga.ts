import { put, takeEvery } from 'redux-saga/effects';

import { browserUtils } from '../../browser-utils';
import * as fromSettings from '..';
import * as fromMain from '../../main';
import { Action } from '../..';

const deleteAccount = function*(action: Action) {
  const payload: fromSettings.CreateAccountPayload = action.payload;

  try {
    yield browserUtils.removeInStorage('accounts', payload.account.name);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2034,
        error: 'Unable to delete account',
        trace: e,
      })
    );
  }

  yield put(fromSettings.deleteAccountCompletedAction(payload));
};

export const deleteAccountSaga = function*() {
  yield takeEvery(fromSettings.DELETE_ACCOUNT, deleteAccount);
};
