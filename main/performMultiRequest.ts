import http from 'http';
import { resolver } from '@fabcotech/bees';

import { getNodeFromIndex } from '../src/utils/getNodeFromIndex';
import { MultiCallBody, MultiCallParameters, MultiCallResult, MultiCallError } from '../src/models/';
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
      (id) => {
        const a = getNodeFromIndex(id);
        return new Promise(async (resolve2, reject2) => {
          if (
            blockchains[parameters.chainId] &&
            blockchains[parameters.chainId].nodes.find((n) => n.ip === a.ip && n.hostname === a.hostname)
          ) {
            const node = blockchains[parameters.chainId].nodes.find((n) => n.ip === a.ip && n.hostname === a.hostname);
            let over = false;
            setTimeout(() => {
              if (!over) {
                resolve2({
                  type: 'ERROR',
                  status: 500,
                  id: id,
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
                resolve2({
                  type: 'SUCCESS',
                  data: resp as string,
                  id: id,
                });
                over = true;
              }
            } catch (err) {
              resolve2({
                type: 'ERROR',
                status: 500,
                id: id,
              });
              over = true;
            }
          } else {
            // fallback on HTTP
            if (body.type === 'get-nodes') {
              http
                .get(`http://${id.split('---')[0]}/get-nodes?network=${body.body.network}`, (resp) => {
                  let data = '';

                  resp.on('data', (chunk) => {
                    data += chunk.toString('utf8');
                  });

                  resp.on('end', () => {
                    console.log('[get-nodes] Successfully fell back on HTTP for ' + id);
                    resolve2({
                      type: 'SUCCESS',
                      data: data as string,
                      id: id,
                    });
                  });
                })
                .on('error', (err) => {
                  resolve2({
                    type: 'ERROR',
                    status: 500,
                    id: id,
                  });
                });
            } else {
              resolve2({
                type: 'ERROR',
                status: 500,
                id: id,
              });
            }
          }
        });
      },
      parameters.urls,
      parameters.resolverAccuracy,
      parameters.resolverAbsolute,
      parameters.comparer
    ).then((resolved) => {
      if (resolved.status === 'failed') {
        reject({
          error: resolved.loadError,
          loadState: resolved.loadState,
        } as MultiCallError);
        return;
      }

      let data: any = undefined;
      let idsLenth = 0;
      Object.keys(resolved.loadState).forEach((key) => {
        if (resolved.loadState[key].ids.length > idsLenth) {
          idsLenth = resolved.loadState[key].ids.length;
          data = resolved.loadState[key].data;
        }
      });

      resolve({
        result: data,
        loadState: resolved.loadState,
        loadErrors: resolved.loadErrors,
      });
    });
  });
};
