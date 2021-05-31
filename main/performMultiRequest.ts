import http from 'http';
import { resolver,  BeesLoadError } from 'beesjs';

import { getNodeFromIndex } from '../src/utils/getNodeFromIndex';
import { MultiCallBody, MultiCallParameters, MultiCallResult, MultiCallError } from '../src/models/WebSocket';
import * as fromBlockchains from './store/blockchains';
import { httpBrowserToNode } from './httpBrowserToNode';

/* browser to network */
export const performMultiRequest = (
  body: MultiCallBody,
  parameters: MultiCallParameters,
  blockchains: fromBlockchains.State
): Promise<MultiCallResult> => {
  return new Promise((resolve, reject) => {
    resolver(
      (index) => {
        const a = getNodeFromIndex(index);
        return new Promise(async (resolve, reject) => {
          if (
            blockchains[parameters.chainId] &&
            blockchains[parameters.chainId].nodes.find((n) => n.ip === a.ip && n.host === a.host)
          ) {
            const node = blockchains[parameters.chainId].nodes.find((n) => n.ip === a.ip && n.host === a.host);
            let over = false;
            setTimeout(() => {
              if (!over) {
                resolve({
                  type: 'ERROR',
                  status: 500,
                  nodeUrl: index,
                });
                over = true;
              }
            }, 50000);
            try {
              const requestId = Math.round(Math.random() * 1000000).toString();
              let newBodyForRequest = {
                ...body,
                requestId: requestId,
              };
              const resp = await httpBrowserToNode(newBodyForRequest, node, 50000);
              if (!over) {
                resolve({
                  type: 'SUCCESS',
                  data: resp as string,
                  nodeUrl: index,
                });
                over = true;
              }
            } catch (err) {
              resolve({
                type: 'ERROR',
                status: 500,
                nodeUrl: index,
              });
              over = true;
            }
          } else {
            // fallback on HTTP
            if (body.type === 'get-nodes') {
              http
                .get(`http://${index.split('---')[0]}/get-nodes?network=${body.body.network}`, (resp) => {
                  let data = '';

                  resp.on('data', (chunk) => {
                    data += chunk.toString('utf8');
                  });

                  resp.on('end', () => {
                    console.log('[get-nodes] Successfully fell back on HTTP for ' + index);
                    resolve({
                      type: 'SUCCESS',
                      data: data as string,
                      nodeUrl: index,
                    });
                  });
                })
                .on('error', (err) => {
                  resolve({
                    type: 'ERROR',
                    status: 500,
                    nodeUrl: index,
                  });
                });
            } else {
              resolve({
                type: 'ERROR',
                status: 500,
                nodeUrl: index,
              });
            }
          }
        });
      },
      parameters.urls,
      parameters.resolverMode,
      parameters.resolverAccuracy,
      parameters.resolverAbsolute,
      parameters.comparer
    ).subscribe({
      next: (a) => {
        if (a.status === 'failed') {
          reject({
            error: a.loadError,
            loadState: a.loadState,
          } as MultiCallError);
          return;
        } else if (a.status === 'loading') {
          // do nothing
        } else if (a.status === 'completed') {
          let data = {
            data: '',
            nodeUrlsLength: 0,
          };
          Object.keys(a.loadState).forEach((key) => {
            if (a.loadState[key].nodeUrls.length > data.nodeUrlsLength) {
              data = {
                data: a.loadState[key].data,
                nodeUrlsLength: a.loadState[key].nodeUrls.length,
              };
            }
          });

          resolve({
            result: data,
            loadState: a.loadState,
            loadErrors: a.loadErrors,
          });
        }
      },
      error: (e) => {
        console.log('Unknwon error in resolver');
        console.log(e);
        reject({
          error: {
            error: BeesLoadError.UnknownError,
            args: {},
          },
          loadState: {},
        });
      },
    });
  });
};
