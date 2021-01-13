import { DispatchFromMainArg } from './main';
import { getWsResponse } from './wsUtils';

import { BlockchainNode, Blockchain, Benchmark } from '../src/models';
import { UPDATE_NODE_READY_STATE } from '../src/store/settings/actions';
import { PERFORM_BENCHMARK_COMPLETED, PerformBenchmarkCompletedPayload } from '../src/store/blockchain';
import * as fromBlockchains from './store/blockchains';
import { getNodeIndex } from '../src/utils/getNodeIndex';

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const ongoingConnectionTrials: { [url: string]: boolean } = {};

const PING_PONG_DELAY = 8000;

// todo handle network initerruption with ping/pong
const ping = (getState: () => void, dispatchFromMain: (a: DispatchFromMainArg) => void) => {
  const blockchains = fromBlockchains.getBlockchains(getState());
  Object.keys(blockchains).forEach((chainId) => {
    blockchains[chainId].nodes.forEach((node) => {
      const requestId = Math.round(Math.random() * 1000000).toString();
      getWsResponse({ requestId: requestId, type: 'ping' }, node, PING_PONG_DELAY)
        .then((a: string) => {
          const resp = JSON.parse(a);
          if (resp.data !== 'pong') {
            console.log(
              `[bn] websocket did not get "pong" from server under ${PING_PONG_DELAY} seconds, will close connection `,
              getNodeIndex(node)
            );
            dispatchFromMain({
              action: {
                type: UPDATE_NODE_READY_STATE,
                payload: {
                  chainId: chainId,
                  readyState: 3,
                  ip: node.ip,
                  host: node.host,
                  ssl: false,
                },
              },
            });
          }
        })
        .catch((err) => {
          console.log('[bn] websocket timeout error, will close connection ', getNodeIndex(node));
          console.log(err);
          dispatchFromMain({
            action: {
              type: UPDATE_NODE_READY_STATE,
              payload: {
                chainId: chainId,
                readyState: 3,
                ip: node.ip,
                ssl: false,
              },
            },
          });
        });
    });
  });
};

let pingPongLaunched = false;

export const wsCron = (getState: () => void, dispatchFromMain: (a: DispatchFromMainArg) => void) => {
  if (!pingPongLaunched) {
    pingPongLaunched = true;
    // First try 2 seconds after launch
    setTimeout(() => ping(getState, dispatchFromMain), 2000);
    // Then every 20 seconds
    const interval = setInterval(() => ping(getState, dispatchFromMain), 20000);
  }

  const blockchains = fromBlockchains.getBlockchains(getState());

  const chainIds = Object.keys(blockchains).filter((chainId) => {
    return blockchains[chainId].platform === 'rchain';
  });

  asyncForEach(chainIds, async (chainId) => {
    const blockchain: Blockchain = blockchains[chainId];

    const nodesActive = blockchain.nodes.filter((n) => n.active);
    const nodesActiveAndClosed = nodesActive.filter((n) => n.readyState === 3 && !ongoingConnectionTrials[n.ip]);

    await asyncForEach(nodesActiveAndClosed, async (node: BlockchainNode) => {
      try {
        if (ongoingConnectionTrials[node.ip]) {
          return;
        }
        ongoingConnectionTrials[node.ip] = true;
        /*
          cert (SSL connection) is mandatory for nodes retreived from default/blockchain but
          node.cert may be undefined, if node.cert is undefined and node is from default/blockchain
          we volontarily setting an invalid cert "INVALID"
        */
        const nodeCertOrInvalid = node.cert || 'INVALID CERT';
        ongoingConnectionTrials[node.ip] = false;

        let t = new Date().getTime();
        const requestId = Math.round(Math.random() * 1000000).toString();
        try {
          const resp = await getWsResponse({ requestId: requestId, type: 'info' }, node);
          const b: Benchmark = {
            id: chainId + '-' + node.ip,
            chainId: chainId,
            ip: node.ip,
            responseTime: new Date().getTime() - t,
            date: new Date().toISOString(),
            info: {
              dappyNodeVersion: (resp as any).dappyNodeVersion,
              rnodeVersion: (resp as any).rnodeVersion,
            },
          };
          // todo validate b
          // cannot because of "boolean" exported in yup

          dispatchFromMain({
            action: {
              type: PERFORM_BENCHMARK_COMPLETED,
              payload: {
                benchmark: b,
              } as PerformBenchmarkCompletedPayload,
            },
          });
          dispatchFromMain({
            action: {
              type: UPDATE_NODE_READY_STATE,
              payload: {
                chainId: chainId,
                readyState: 1,
                ip: node.ip,
                host: node.host,
                ssl: true,
              },
            },
          });
          console.log('[bn] [ssl] connected with ' + node.ip + ' ' + node.host);
        } catch (err) {
          console.log('[bn] error when trying to get info ' + node.ip + ' ' + node.host);
          console.log(err);
        }
      } catch (err) {
        ongoingConnectionTrials[node.ip] = false;
        console.log('[bn] could not connect with ' + node.ip + ' ' + node.host);
        if (err) {
          console.log(err);
        }
      }

      return;
    });
  });
};
