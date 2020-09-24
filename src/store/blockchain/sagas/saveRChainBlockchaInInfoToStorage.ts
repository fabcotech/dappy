import { put, takeEvery, select } from 'redux-saga/effects';

import * as fromBlockchain from '..';
import * as fromMain from '../../main';
import { browserUtils } from '../../browser-utils';
import { RChainInfos } from '../../../models';
import { Action } from '../../';

const saveRChainBlockchainInfoToStorage = function*(action: Action) {
  const payload: fromBlockchain.UpdateRChainBlockchainInfoCompletedPayload = action.payload;
  const rchainInfos: { [chainId: string]: RChainInfos } = yield select(fromBlockchain.getRChainInfos);
  try {
    yield browserUtils.saveStorage('rchainInfos', rchainInfos[payload.chainId], true);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2013,
        error: 'Unable to save rchain infos to storage',
        trace: e,
      })
    );
  }
};

export const saveRChainBlockchainInfoToStorageSaga = function*() {
  yield takeEvery(fromBlockchain.UPDATE_RCHAIN_BLOCKCHAIN_INFO_COMPLETED, saveRChainBlockchainInfoToStorage);
};
