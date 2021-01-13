import https from 'https';

import { WS_PAYLOAD_PAX_SIZE } from '../src/CONSTANTS';
import { BlockchainNode } from '../src/models';

export const getWsResponse = (data: { [key: string]: any }, node: BlockchainNode, timeout?: number) => {
  return new Promise((resolve, reject) => {
    const s = JSON.stringify(data);
    const l = Buffer.from(s).length;
    if (l > WS_PAYLOAD_PAX_SIZE) {
      reject(`Websocket payload is ${l / 1000}kb, max size is ${WS_PAYLOAD_PAX_SIZE / 1000}kb`);
      return;
    }
    try {
      const req = https.request(
        {
          hostname: node.ip.split(':')[0],
          port: node.ip.indexOf(':') === -1 ? 443 : node.ip.split(':')[1],
          path: `/${data.type}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Host: node.host,
          },
          rejectUnauthorized: false, // cert does not have to be signed by CA (self-signed)
          cert: node.cert ? decodeURI(node.cert) : undefined,
          ca: [],
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            resolve(data);
          });
        }
      );
      if (data.body) {
        req.end(JSON.stringify(data.body));
      } else {
        req.end();
      }

      req.on('error', (err) => {
        console.log(err);
        reject(err);
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
