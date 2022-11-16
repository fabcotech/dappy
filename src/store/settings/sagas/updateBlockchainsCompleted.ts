import { takeEvery, select } from 'redux-saga/effects';

import * as fromSettings from '..';
import { Action } from '/store';
import { Blockchain } from '/models';
import { triggerCommand, dispatchInMain } from '/interProcess';

function* updateBlockchainsCompleted(action: Action) {
  const blockchains: {
    [chainId: string]: Blockchain;
  } = yield select(fromSettings.getBlockchains);

  dispatchInMain({
    type: '[MAIN] Sync blockchains',
    payload: blockchains,
  });

  if ([fromSettings.REMOVE_BLOCKCHAIN_COMPLETED].includes(action.type)) {
    triggerCommand('run-ws-cron');
  }

  return undefined;
}

export function* updateBlockchainsCompletedSaga() {
  yield takeEvery(fromSettings.CREATE_BLOCKCHAIN_COMPLETED, updateBlockchainsCompleted);
  yield takeEvery(fromSettings.REMOVE_BLOCKCHAIN_COMPLETED, updateBlockchainsCompleted);
  yield takeEvery(fromSettings.UPDATE_BLOCKCHAINS_FROM_STORAGE, updateBlockchainsCompleted);
  yield takeEvery(fromSettings.UPDATE_NODES_COMPLETED, updateBlockchainsCompleted);
}
