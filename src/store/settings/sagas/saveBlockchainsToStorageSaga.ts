import { put, takeEvery, select } from 'redux-saga/effects';

import { Blockchain } from '/models';
import { browserUtils } from '/store/browser-utils';
import * as fromSettings from '..';
import * as fromMain from '/store/main';
import { Action } from '/store/';

function* saveBlockchainsToStorage(action: Action) {
  let blockchains: { [chainId: string]: Blockchain } = yield select(fromSettings.getBlockchains);

  if (action.type === fromSettings.CREATE_BLOCKCHAIN) {
    yield put(fromSettings.createBlockchainCompletedAction(action.payload));
  } else if (action.type === fromSettings.UPDATE_NODES) {
    yield put(fromSettings.updateNodeUrlsCompletedAction(action.payload));
  }

  blockchains = yield select(fromSettings.getBlockchains);
  try {
    yield browserUtils.saveStorageIndexed('networks', blockchains);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2001,
        error: 'Unable to save networks',
        trace: e,
      })
    );
  }
}

export function* saveBlockchainsToStorageSaga() {
  yield takeEvery(fromSettings.UPDATE_BLOCKCHAINS_FROM_STORAGE, saveBlockchainsToStorage);
  yield takeEvery(fromSettings.UPDATE_NODES, saveBlockchainsToStorage);
  yield takeEvery(fromSettings.CREATE_BLOCKCHAIN, saveBlockchainsToStorage);
  yield takeEvery(fromSettings.UPDATE_BLOCKCHAINS_FROM_STORAGE, saveBlockchainsToStorage);
}
