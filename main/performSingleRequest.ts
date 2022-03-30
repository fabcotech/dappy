import { DappyNetworkMember } from '@fabcotech/dappy-lookup';
import { httpBrowserToNode } from './httpBrowserToNode';

/* browser to node */
export const performSingleRequest = (body: { [key: string]: any }, node: DappyNetworkMember): Promise<string> => {
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

    httpBrowserToNode(body, node)
      .then((result) => {
        if (!over) {
          over = true;
          resolve(result as string);
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
