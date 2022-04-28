import { takeEvery, select, put } from 'redux-saga/effects';
import { BeesLoadError } from '@fabcotech/bees';

import { store } from '/store';
import * as fromBlockchain from '..';
import * as fromSettings from '/store/settings';
import * as fromMain from '/store/main';
import { DappyLoadError, Blockchain, RChainInfos, RChainInfo, MultiRequestError } from '/models';
import { Action } from '/store/';
import { validateDappyNodeInfo } from '/store/decoders';
import { multiRequest } from '/interProcess';
import { getNodeIndex } from '/utils/getNodeIndex';
import { RCHAIN_INFOS_EXPIRATION } from '/CONSTANTS';

const executeRChainCronJobsInfo = function* (action: Action) {
  const rchainInfos: { [chainId: string]: RChainInfos } = yield select(fromBlockchain.getRChainInfos);
  const rchainBlockchains: {
    [chainId: string]: Blockchain;
  } = yield select(fromSettings.getAvailableRChainBlockchains);

  yield put(fromBlockchain.removeOldRecordsAction({ before: new Date(new Date().getTime() - 3600000).toString() }));

  try {
    let chainId = Object.keys(rchainBlockchains).find((k) => {
      if (!rchainInfos[k] || new Date(rchainInfos[k].date).getTime() + RCHAIN_INFOS_EXPIRATION < new Date().getTime()) {
        return true;
      }
      return false;
    });

    if (!chainId || !rchainBlockchains[chainId]) {
      return;
    }

    const blockchain = rchainBlockchains[chainId];

    /*
      RChainInfos is level 1 data, it must be retreived by asking ALL members of
      the Dappy network
    */
    const indexes = blockchain.nodes.map(getNodeIndex);
    multiRequest(
      { type: 'info' },
      {
        chainId: chainId,
        urls: indexes,
        resolverMode: 'absolute',
        resolverAccuracy: 100,
        resolverAbsolute: indexes.length,
        multiCallId: fromBlockchain.EXECUTE_RCHAIN_CRON_JOBS,
      }
    )
      .then((a) => {
        const resultFromDappyNode = JSON.parse(a.result);
        validateDappyNodeInfo(resultFromDappyNode.data)
          .then((valid) => {
            store.dispatch(
              fromBlockchain.updateRChainBlockchainInfoCompletedAction({
                chainId: blockchain.chainId,
                date: new Date().toISOString(),
                info: resultFromDappyNode.data as RChainInfo,
              })
            );
          })
          .catch((err) => {
            store.dispatch(
              fromBlockchain.updateRChainBlockchainInfoFailedAction({
                chainId: blockchain.chainId,
                date: new Date().toISOString(),
                error: {
                  error: DappyLoadError.FailedToParseResponse,
                  args: {},
                },
              })
            );
          });
      })
      .catch((err: MultiRequestError) => {
        store.dispatch(
          fromBlockchain.updateRChainBlockchainInfoFailedAction({
            chainId: blockchain.chainId,
            date: new Date().toISOString(),
            error: err.error,
          })
        );
      });
  } catch (e) {
    store.dispatch(
      fromMain.saveErrorAction({
        errorCode: 2010,
        error: '[Blockchain] Failed to get RChain blockchain info',
        trace: e,
      })
    );
  }
};

export const executeRChainCronJobsInfoSaga = function* () {
  yield takeEvery(fromBlockchain.EXECUTE_RCHAIN_CRON_JOBS, executeRChainCronJobsInfo);
};
