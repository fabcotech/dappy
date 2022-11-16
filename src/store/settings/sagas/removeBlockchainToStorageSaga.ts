import { put, takeEvery } from 'redux-saga/effects';

import { browserUtils } from '/store/browser-utils';
import * as fromSettings from '..';
import * as fromMain from '/store/main';
import { Action } from '/store/';

function* removeBlockchainsToStorage(action: Action) {
  const { payload } = action;

  try {
    yield browserUtils.removeInStorage('networks', payload.chainId);
  } catch (e) {
    console.log(e);
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2032,
        error: 'Unable to save blockchains',
        trace: e,
      })
    );
  }

  yield put(fromSettings.removeBlockchainCompletedAction(payload));
}

export function* removeBlockchainsToStorageSaga() {
  yield takeEvery(fromSettings.REMOVE_BLOCKCHAIN, removeBlockchainsToStorage);
}
