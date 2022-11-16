import { put, takeEvery } from 'redux-saga/effects';

import { browserUtils } from '/store/browser-utils';
import * as fromSettings from '..';
import * as fromMain from '/store/main';
import { Action } from '/store';

function* deleteAccount(action: Action) {
  const { payload } = action;

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
}

export function* deleteAccountSaga() {
  yield takeEvery(fromSettings.DELETE_ACCOUNT, deleteAccount);
}
