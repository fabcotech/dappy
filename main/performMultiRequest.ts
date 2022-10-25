import { resolver } from '@fabcotech/bees';
import { DappyNetworkMember } from '@fabcotech/dappy-lookup';

import { getNodeFromIndex } from '../src/utils/getNodeFromIndex';
import {
  MultiRequestBody,
  MultiRequestParameters,
  MultiRequestResult,
  MultiRequestError,
} from '../src/models';
import * as fromBlockchains from './store/blockchains';
import { httpBrowserToNode } from './httpBrowserToNode';

/* browser to network */
export const performMultiRequest = (
  body: MultiRequestBody,
  parameters: MultiRequestParameters,
  blockchains: fromBlockchains.State
): Promise<MultiRequestResult> => {
  return new Promise((resolve, reject) => {
    resolver(
      (id) => {
        const a = getNodeFromIndex(id);
        return new Promise(async (resolve2) => {
          let timeout = null;
          if (
            blockchains[parameters.chainId] &&
            blockchains[parameters.chainId].nodes.find(
              (n) => n.ip === a.ip && n.hostname === a.hostname
            )
          ) {
            const node = blockchains[parameters.chainId].nodes.find(
              (n) => n.ip === a.ip && n.hostname === a.hostname
            );
            let over = false;
            timeout = setTimeout(() => {
              if (!over) {
                resolve2({
                  type: 'ERROR',
                  status: 500,
                  id,
                });
                over = true;
              }
            }, 50000);
            try {
              const resp = await httpBrowserToNode(body, node as DappyNetworkMember);
              if (!over) {
                clearTimeout(timeout);
                resolve2({
                  type: 'SUCCESS',
                  data: resp as string,
                  id,
                });
                over = true;
              }
            } catch (err) {
              resolve2({
                type: 'ERROR',
                status: 500,
                id,
              });
              over = true;
              clearTimeout(timeout);
            }
            return;
          }

          resolve2({
            type: 'ERROR',
            status: 500,
            id,
          });
          if (timeout) clearTimeout(timeout);
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
        } as MultiRequestError);
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
