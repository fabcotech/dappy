import { BlockchainNode } from '../src/models';
import { getWsResponse } from './wsUtils';

/* browser to node */
export const performSingleRequest = (
  body: { [key: string]: any },
  node: BlockchainNode
): Promise<{ success: boolean; error?: { message: string }; data?: any }> => {
  return new Promise((resolve, reject) => {
    let over = false;
    setTimeout(() => {
      if (!over) {
        reject({
          success: false,
          error: 'Timeout error',
        });
        over = true;
      }
    }, 20000);

    getWsResponse(body, node)
      .then((result) => {
        if (!over) {
          over = true;
          resolve(result);
        }
      })
      .catch((err) => {
        console.log(err);
        reject({
          success: false,
          error: { message: typeof err === 'string' ? err : 'Communication error' },
        });
      });
  });
};
