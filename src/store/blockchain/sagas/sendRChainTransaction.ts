import { takeEvery, put, select } from 'redux-saga/effects';
import * as rchainToolkit from '@fabcotech/rchain-toolkit';
import { DappyNetworkMember } from '@fabcotech/dappy-lookup';

import { Blockchain, TransactionStatus, MultiRequestError, SingleRequestResult } from '/models';
import * as fromBlockchain from '..';
import { buildUnforgeableNameQuery } from '/utils/buildUnforgeableNameQuery';
import * as fromMain from '/store/main';
import { Action, store } from '/store/';
import * as fromSettings from '/store/settings';
import { singleRequest, multiRequest } from '/interProcess';
import { getNodeIndex } from '/utils/getNodeIndex';

const sendRChainTransaction = function* (action: Action) {
  const { payload } = action;
  const rchainBlockchains: {
    [chainId: string]: Blockchain;
  } = yield select(fromSettings.getOkBlockchains);

  if (!rchainBlockchains[payload.blockchainId]) {
    yield put(
      fromMain.openModalAction({
        title: 'Failed to send transaction',
        text: `The RChain chain "${payload.blockchainId}" has not been found or there is not enough nodes available, cannot execute transaction`,
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
        ],
      })
    );
    return;
  }

  if (!rchainBlockchains[payload.blockchainId].nodes[0]) {
    yield put(
      fromMain.openModalAction({
        title: 'Failed to send transaction',
        text: `No nodes configured for RChain chain "${payload.blockchainId}" cannot send transaction`,
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
        ],
      })
    );
    return;
  }

  const node = rchainBlockchains[payload.blockchainId].nodes[0];

  const previewPrivateName = ['record', 'rchain-token', 'transfer'].includes(payload.origin.origin);

  let deployResponse: undefined | SingleRequestResult;
  try {
    deployResponse = yield singleRequest(
      { type: 'api/deploy', body: payload.transaction },
      node as DappyNetworkMember
    );
    const resp = (deployResponse as SingleRequestResult).data as string;
    if (!resp.startsWith('"Success')) {
      yield put(
        fromBlockchain.rChainTransactionErrorAction({
          id: payload.id,
          value: { status: 'failed', message: deployResponse },
          alert: payload.alert,
        })
      );
      return;
    }

    const unforgeableId = resp
      .toString()
      .slice(resp.toString().indexOf(': ') + 2)
      .replace('"', '');
    console.log('unforgeableId', unforgeableId);

    if (payload.alert) {
      let message = t('transaction successful');
      if (payload.origin.origin === 'transfer') {
        message = t('transaction successful rev');
      }
      yield put(
        fromMain.openModalAction({
          title: t('just transaction successful'),
          text: message,
          buttons: [
            {
              classNames: 'is-link',
              text: 'Ok',
              action: fromMain.closeModalAction(),
            },
          ],
        })
      );
    }

    yield put(
      fromBlockchain.updateRChainTransactionStatusAction({
        id: payload.id,
        status: TransactionStatus.Aired,
        value: (deployResponse as SingleRequestResult).data as string,
      })
    );

    if (previewPrivateName) {
      const unforgeableNameQuery = buildUnforgeableNameQuery(unforgeableId);
      let interval: NodeJS.Timeout | undefined;
      let dataAtNameResponseExpr: { [key: string]: any } | undefined;
      try {
        dataAtNameResponseExpr = yield new Promise((resolve, reject) => {
          let i = 0;
          interval = setInterval(() => {
            const state = store.getState();
            const settings: fromSettings.Settings = fromSettings.getSettings(state);
            i += 1;
            if (i > 80) {
              reject(new Error('20 minutes timeout exceeded'));
              return;
            }
            try {
              multiRequest(
                {
                  type: 'api/data-at-name',
                  body: {
                    name: unforgeableNameQuery,
                    depth: 5,
                  },
                },
                {
                  chainId: payload.blockchainId,
                  urls: rchainBlockchains[payload.blockchainId].nodes.map(getNodeIndex),
                  resolverMode: settings.resolverMode,
                  resolverAccuracy: settings.resolverAccuracy,
                  resolverAbsolute: settings.resolverAbsolute,
                  multiCallId: fromBlockchain.LISTEN_FOR_DATA_AT_NAME,
                }
              )
                .then((resp) => {
                  const parsedResp = JSON.parse(resp.result);
                  if (parsedResp && parsedResp.data && parsedResp.data.expr) {
                    resolve(parsedResp.data.expr);
                    if (interval) clearInterval(interval);
                  } else {
                    console.log(
                      'Did not find transaction data (unforgeable name), will try again in 15 seconds'
                    );
                  }
                })
                .catch((err: MultiRequestError) => {
                  reject(err.error.error);
                });
            } catch (err) {
              if (err instanceof Error) {
                reject(err);
              }
            }
          }, 15000);
        });
      } catch (err) {
        if (interval) clearInterval(interval);
        if (err instanceof Error) {
          store.dispatch(
            fromBlockchain.rChainTransactionErrorAction({
              id: payload.id,
              value: {
                status: 'failed',
                message: `Deploy data could not be retreived ${err.message}`,
              },
              alert: payload.alert,
            })
          );
          return;
        }
      }

      const jsValue = rchainToolkit.utils.rhoValToJs(dataAtNameResponseExpr);
      if (payload.origin.origin === 'transfer') {
        store.dispatch(
          fromBlockchain.updateRChainTransactionStatusAction({
            id: payload.id,
            status: TransactionStatus.Completed,
            value: jsValue,
          })
        );
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      const p: fromBlockchain.RChainTransactionErrorPayload = {
        id: payload.id,
        value: { status: 'failed', message: err.message },
        alert: payload.alert,
      };
      if (payload.origin.origin === 'dapp') {
        p.tabId = payload.origin.tabId;
      }
      store.dispatch(fromBlockchain.rChainTransactionErrorAction(p));
    }
  }
};

export function* sendRChainTransactionSaga() {
  yield takeEvery(fromBlockchain.SEND_RCHAIN_TRANSACTION, sendRChainTransaction);
}
