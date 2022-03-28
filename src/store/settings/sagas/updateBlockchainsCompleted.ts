import { takeEvery, select, put } from 'redux-saga/effects';

import * as fromSettings from '..';
import * as fromMain from '/store/main';
import * as fromDapps from '/store/dapps';
import { Action } from '/store';
import { Blockchain } from '/models';
import { triggerCommand, dispatchInMain } from '/interProcess';

const updateBlockchainsCompleted = function* (action: Action) {
  const blockchains: {
    [chainId: string]: Blockchain;
  } = yield select(fromSettings.getBlockchains);
  const loadResourceWhenReady: string | undefined = yield select(fromMain.getLoadResourceWhenReady);

  dispatchInMain({
    type: '[MAIN] Sync blockchains',
    payload: blockchains,
  });

  if (
    [
      fromSettings.UPDATE_NODE_ACTIVE_COMPLETED,
      fromSettings.REMOVE_BLOCKCHAIN_COMPLETED,
      fromSettings.UPDATE_NODE_ACTIVE,
    ].includes(action.type)
  ) {
    triggerCommand('run-ws-cron');
  }

  if (loadResourceWhenReady && [fromSettings.UPDATE_NODE_READY_STATE].includes(action.type)) {
    const isLoadReady: boolean = yield select(fromSettings.getIsLoadReady);
    console.log('isLoadReady', isLoadReady);
    if (isLoadReady) {
      yield put(
        fromDapps.loadResourceAction({
          url: loadResourceWhenReady,
        })
      );
      yield put(
        fromMain.updateLoadResourceWhenReadyAction({
          loadResource: undefined,
        })
      );
    }
  }

  return undefined;
};

export const updateBlockchainsCompletedSaga = function* () {
  yield takeEvery(fromSettings.CREATE_BLOCKCHAIN_COMPLETED, updateBlockchainsCompleted);
  yield takeEvery(fromSettings.REMOVE_BLOCKCHAIN_COMPLETED, updateBlockchainsCompleted);
  yield takeEvery(fromSettings.UPDATE_BLOCKCHAINS_FROM_STORAGE, updateBlockchainsCompleted);
  yield takeEvery(fromSettings.UPDATE_NODES_COMPLETED, updateBlockchainsCompleted);
};
