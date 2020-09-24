import { put, takeEvery } from 'redux-saga/effects';

import { browserUtils } from '../../browser-utils';
import * as fromSettings from '..';
import * as fromMain from '../../main';
import { Action } from '../../';

const removeBlockchainsToStorage = function*(action: Action) {
  const payload: fromSettings.RemoveBlockchainPayload = action.payload;

  try {
    yield browserUtils.removeInStorage('blockchains', payload.chainId);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2032,
        error: 'Unable to save blockchains',
        trace: e,
      })
    );
  }

  yield put(fromSettings.removeBlockchainCompletedAction(payload));
};

export const removeBlockchainsToStorageSaga = function*() {
  yield takeEvery(fromSettings.REMOVE_BLOCKCHAIN, removeBlockchainsToStorage);
};
