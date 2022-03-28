import { put, takeEvery, select } from 'redux-saga/effects';

import { Blockchain, RChainInfos } from '/models';
import { browserUtils } from '/store/browser-utils';
import * as fromSettings from '..';
import * as fromBlockchain from '/store/blockchain';
import * as fromMain from '/store/main';
import { Action } from '/store/';

const saveBlockchainsToStorage = function* (action: Action) {
  const rchainInfos: { [chainId: string]: RChainInfos } = yield select(fromBlockchain.getRChainInfos);
  let blockchains: { [chainId: string]: Blockchain } = yield select(fromSettings.getBlockchains);

  let blockchain: undefined | Blockchain = undefined;
  let executeRChainCronJobs = false;
  if (action.type === fromSettings.CREATE_BLOCKCHAIN) {
    const payload: fromSettings.CreateBlockchainPayload = action.payload;
    yield put(fromSettings.createBlockchainCompletedAction(payload));
  } else if (action.type === fromSettings.UPDATE_NODES) {
    const payload: fromSettings.UpdateNodesPayload = action.payload;
    blockchain = blockchains[payload.chainId];
    yield put(fromSettings.updateNodeUrlsCompletedAction(payload));
    executeRChainCronJobs = (blockchain.platform === 'rchain' && !rchainInfos) || !rchainInfos[payload.chainId];
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

  if (executeRChainCronJobs) {
    yield new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
    yield put(fromBlockchain.executeRChainCronJobsAction());
  }
};

export const saveBlockchainsToStorageSaga = function* () {
  yield takeEvery(fromSettings.UPDATE_BLOCKCHAINS_FROM_STORAGE, saveBlockchainsToStorage);
  yield takeEvery(fromSettings.UPDATE_NODES, saveBlockchainsToStorage);
  yield takeEvery(fromSettings.CREATE_BLOCKCHAIN, saveBlockchainsToStorage);
  yield takeEvery(fromSettings.UPDATE_BLOCKCHAINS_FROM_STORAGE, saveBlockchainsToStorage);
};
