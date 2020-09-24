import WSC from 'ws';

import { DispatchFromMainArg } from './main';
import { getWsResponse } from './wsUtils';

import { BlockchainNode, Blockchain, Benchmark } from '../src/models';
import { UPDATE_NODE_READY_STATE } from '../src/store/settings/actions';
import { MAX_SIMULTANEOUS_WS_CONNECTIONS } from '../src/CONSTANTS';
import { PERFORM_BENCHMARK_COMPLETED, PerformBenchmarkCompletedPayload } from '../src/store/blockchain';
import * as fromBlockchains from './store/blockchains';
import * as fromConnections from './store/connections';

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const ongoingConnectionTrials: { [url: string]: boolean } = {};

const PING_PONG_DELAY = 8000;

// todo handle network initerruption with ping/pong
const ping = (getState: () => void, dispatchFromMain: (a: DispatchFromMainArg) => void) => {
  const connections = fromConnections.getConnections(getState());
  Object.keys(connections).forEach((chainId) => {
    Object.keys(connections[chainId]).forEach((index) => {
      const conn = connections[chainId][index];
      if (conn) {
        const requestId = Math.round(Math.random() * 1000000).toString();
        getWsResponse({ requestId: requestId, type: 'ping' }, conn, PING_PONG_DELAY)
          .then((a: string) => {
            const resp = JSON.parse(a);
            if (!resp.success || resp.data !== 'pong') {
              console.log(
                `[ws] websocket did not get "pong" from server under ${PING_PONG_DELAY} seconds, will close connection `,
                index
              );
              conn.removeAllListeners();
              conn.terminate();
              dispatchFromMain({
                action: {
                  type: UPDATE_NODE_READY_STATE,
                  payload: {
                    chainId: chainId,
                    readyState: 3,
                    ip: index.split('--')[0],
                    host: index.split('--')[1],
                    ssl: false,
                  },
                },
              });
            }
          })
          .catch((err) => {
            console.log('[ws] websocket timeout error, will close connection ', index);
            console.log(err);
            conn.removeAllListeners();
            conn.terminate();
            dispatchFromMain({
              action: {
                type: UPDATE_NODE_READY_STATE,
                payload: {
                  chainId: chainId,
                  readyState: 3,
                  ip: index,
                  ssl: false,
                },
              },
            });
          });
      }
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

  const connections = fromConnections.getConnections(getState());

  const blockchainToClose = Object.keys(connections).find((chainId) => !chainIds.find((c) => c === chainId));
  if (blockchainToClose) {
    Object.keys(connections[blockchainToClose]).forEach((index) => {
      if (connections[blockchainToClose][index]) {
        connections[blockchainToClose][index].terminate();
        dispatchFromMain({
          action: {
            type: UPDATE_NODE_READY_STATE,
            payload: {
              chainId: blockchainToClose,
              readyState: 3,
              ip: index,
              ssl: false,
            },
          },
        });
      }
    });
    dispatchFromMain({
      action: {
        type: 'REMOVE_BLOCKCHAIN',
        payload: {
          chainId: blockchainToClose,
        },
      },
    });
    return;
  }

  asyncForEach(chainIds, async (chainId) => {
    const blockchain: Blockchain = blockchains[chainId];

    await asyncForEach(Object.keys(connections[chainId] || {}), async (index) => {
      const foundNode = blockchain.nodes.find((n) => `${n.ip}---${n.host}` === index);
      if (!foundNode || foundNode.active === false) {
        console.log(`[ws] will destroy connection for ${chainId}.${index}`);
        dispatchFromMain({
          data: {
            connection: undefined,
          },
          action: {
            type: UPDATE_NODE_READY_STATE,
            payload: {
              chainId: chainId,
              readyState: 3,
              ip: index.split('---')[0],
              host: index.split('---')[1],
              ssl: false,
            },
          },
        });
      }
    });

    const nodesInactive = blockchain.nodes.filter((n) => !n.active);
    const nodesInactiveAndReady = nodesInactive.filter((n) => n.readyState === 1);

    await asyncForEach(nodesInactiveAndReady, async (node: BlockchainNode) => {
      if (!connections[chainId] || !connections[chainId][node.ip]) {
        console.log(`[ws] error, could not find ws connection ${chainId}.${node.ip}, ${node.host} to disconnect`);
      }
      dispatchFromMain({
        data: {
          connection: undefined,
        },
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
    });

    const nodesActive = blockchain.nodes.filter((n) => n.active);
    const nodesActiveAndReady = nodesActive.filter((n) => n.readyState === 1);
    if (nodesActiveAndReady.length >= MAX_SIMULTANEOUS_WS_CONNECTIONS) {
      return;
    }

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
        const { connection, ssl } = await createConnection(
          node.ip,
          node.host,
          node.origin === 'user' ? node.cert : nodeCertOrInvalid
        );
        ongoingConnectionTrials[node.ip] = false;
        connection.removeAllListeners();

        connection.on('error', (err) => {
          console.log('[ws] websocket error ' + node.ip + ' ' + node.host);
          console.log(err);
          dispatchFromMain({
            action: {
              type: UPDATE_NODE_READY_STATE,
              payload: {
                chainId: chainId,
                readyState: connection.readyState,
                ip: node.ip,
                host: node.host,
                ssl: false,
              },
            },
          });
        });

        // todo wifi netowrk change don't affect this
        connection.on('close', (err) => {
          console.log('[ws] websocket connection closes ' + node.ip + ' ' + node.host);
          console.log(err);
          connection.removeAllListeners();
          connection.terminate();
          dispatchFromMain({
            action: {
              type: UPDATE_NODE_READY_STATE,
              payload: {
                chainId: chainId,
                readyState: connection.readyState,
                ip: node.ip,
                host: node.host,
                ssl: false,
              },
            },
          });
        });
        let t = new Date().getTime();
        const requestId = Math.round(Math.random() * 1000000).toString();
        try {
          const resp = await getWsResponse({ requestId: requestId, type: 'info' }, connection);
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
            data: {
              connection: connection,
            },
            action: {
              type: UPDATE_NODE_READY_STATE,
              payload: {
                chainId: chainId,
                readyState: connection.readyState,
                ip: node.ip,
                host: node.host,
                ssl: ssl,
              },
            },
          });
          if (ssl) {
            console.log('[ws] [ssl] connected with ' + node.ip + ' ' + node.host);
          } else {
            console.log('[ws] [no ssl] connected with ' + node.ip + ' ' + node.host);
          }
        } catch (err) {
          console.log('[ws] error when trying to get info ' + node.ip + ' ' + node.host);
          console.log(err);
        }
      } catch (err) {
        ongoingConnectionTrials[node.ip] = false;
        console.log('[ws] could not connect with ' + node.ip + ' ' + node.host);
        if (err) {
          console.log(err);
        }
      }

      return;
    });
  });
};

const createConnection = async (
  ip: string,
  host: string,
  cert?: string
): Promise<{ connection: WSC; ssl: boolean }> => {
  return new Promise((resolve, reject) => {
    const connection = new WSC(`wss://${ip}`, {
      host: ip,
      headers: {
        Host: host,
      },
      rejectUnauthorized: false, // cert does not have to be signed by CA (self-signed)
      cert: cert ? decodeURI(cert) : undefined,
      ca: [],
    });

    let initialized = false;

    connection.on('open', (a) => {
      resolve({
        connection: connection,
        ssl: true,
      });
      initialized = true;
    });

    connection.on('error', (err) => {
      if (!initialized) {
        reject(err);
      }
    });
  });
};
