import { takeEvery, select } from 'redux-saga/effects';

import { store } from '../..';
import * as fromBlockchain from '..';
import * as fromSettings from '../../settings';
import * as fromMain from '../../main';
import { Blockchain, LoadError, NodeFromNetwork } from '../../../models';
import { Action } from '../../';
import { validateNodesFromNetwork } from '../../decoders';
import { MultiCallError } from '../../../models/WebSocket';
import { multiCall } from '../../../utils/wsUtils';
import { getNodeIndex } from '../../../utils/getNodeIndex';

const executeNodesCronJobs = function* (action: Action) {
  const namesBlockchain: Blockchain | undefined = yield select(fromSettings.getNamesBlockchain);
  const t = new Date().getTime();
  try {
    if (!namesBlockchain) {
      return;
    }

    /*
      Do not touch the lines below, do not add a condition on n.readyState or n.active
      Nodes are level 1 data, they must be retreived by asking ALL members of
      the Dappy network
    */
    const indexes = namesBlockchain.nodes.map(getNodeIndex);

    multiCall(
      {
        type: 'get-nodes',
        body: { network: namesBlockchain.chainId },
      },
      {
        chainId: namesBlockchain.chainId,
        urls: indexes,
        resolverMode: 'absolute',
        resolverAccuracy: 100,
        resolverAbsolute: indexes.length,
        multiCallId: fromBlockchain.EXECUTE_NODES_CRON_JOBS,
      }
    )
      .then((a) => {
        const u = new Date().getTime() - t;
        const resultFromBlockchain = JSON.parse(a.result.data);

        if (!resultFromBlockchain.success) {
          store.dispatch(
            fromBlockchain.getNodesFailedAction({
              chainId: namesBlockchain.chainId,
              loadState: a.loadState,
              date: new Date().toISOString(),
              time: u,
              error: {
                error: LoadError.ResourceNotFound,
                args: { message: 'Nodes not found on the blockchain' },
              },
            })
          );
          return;
        }

        const result = resultFromBlockchain.data;

        try {
          validateNodesFromNetwork(Object.values(result as { [key: string]: NodeFromNetwork }))
            .then((nodes: NodeFromNetwork[]) => {
              // todo maybe this can go when problem is solved in dappy-node
              if (!nodes.length) {
                return;
              }
              store.dispatch(
                fromSettings.addNodesIfDoNotExistAction({
                  chainId: namesBlockchain.chainId,
                  nodes: nodes.map((n) => {
                    const fn = namesBlockchain.nodes.find((no) => no.ip === n.ip);
                    if (fn) {
                      return {
                        ...n,
                        origin: 'network',
                        ssl: fn.ssl,
                        active: fn.active,
                        readyState: fn.readyState,
                      };
                    } else {
                      return { ...n, origin: 'network', active: true, readyState: 3, ssl: false };
                    }
                  }),
                })
              );
            })
            .catch((err: Error) => {
              store.dispatch(
                fromBlockchain.getNodesFailedAction({
                  chainId: namesBlockchain.chainId,
                  date: new Date().toISOString(),
                  time: u,
                  loadState: a.loadState,
                  error: {
                    error: LoadError.InvalidNodes,
                    args: {
                      message: 'Failed to parse nodes : ' + err.message,
                    },
                  },
                })
              );
            });
        } catch (err) {
          store.dispatch(
            fromBlockchain.getNodesFailedAction({
              chainId: namesBlockchain.chainId,
              date: new Date().toISOString(),
              time: u,
              loadState: a.loadState,
              error: {
                error: LoadError.InvalidNodes,
                args: {
                  message: 'Failed to parse nodes : ' + err.message,
                },
              },
            })
          );
        }
      })
      .catch((err: MultiCallError) => {
        const u = new Date().getTime() - t;
        store.dispatch(
          fromBlockchain.getNodesFailedAction({
            chainId: namesBlockchain.chainId,
            loadState: err.loadState,
            date: new Date().toISOString(),
            time: u,
            error: err.error,
          })
        );
      });
  } catch (e) {
    store.dispatch(
      fromMain.saveErrorAction({
        errorCode: 2040,
        error: '[Blockchain] Failed to get nodes',
        trace: e,
      })
    );
  }
};

export const executeNodesCronJobsSaga = function* () {
  yield takeEvery(fromBlockchain.EXECUTE_NODES_CRON_JOBS, executeNodesCronJobs);
};
