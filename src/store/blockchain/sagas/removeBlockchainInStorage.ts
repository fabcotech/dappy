import { put, takeEvery } from 'redux-saga/effects';

import * as fromMain from '/store/main';
import * as fromSettings from '/store/settings';
import { browserUtils } from '/store/browser-utils';
import { Action } from '/store/';

const removeBlockchainInStorage = function* (action: Action) {
  const payload: fromSettings.RemoveBlockchainPayload = action.payload;
  try {
    yield browserUtils.removeInStorage('blockchains', payload.chainId);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2050,
        error: 'Unable to remove blockchain in storage',
        trace: e,
      })
    );
  }
};

export const removeBlockchainInStorageSaga = function* () {
  yield takeEvery(fromSettings.REMOVE_BLOCKCHAIN, removeBlockchainInStorage);
};
