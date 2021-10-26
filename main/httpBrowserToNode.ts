import https from 'https';

import { VERSION, WS_PAYLOAD_PAX_SIZE } from '../src/CONSTANTS';
import { BlockchainNode } from '../src/models';

const dappyNetworkAgents: { [key: string]: https.Agent } = {};

export const httpBrowserToNode = (data: { [key: string]: any }, node: BlockchainNode, timeout?: number) => {
  return new Promise((resolve, reject) => {
    const s = JSON.stringify(data);
    const l = Buffer.from(s).length;
    if (l > WS_PAYLOAD_PAX_SIZE) {
      reject(`bn payload is ${l / 1000}kb, max size is ${WS_PAYLOAD_PAX_SIZE / 1000}kb`);
      return;
    }
    try {
      const ip = node.ip.split(':')[0];
      const host = node.host;
      const port = node.ip.indexOf(':') === -1 ? 443 : node.ip.split(':')[1];
      const cert = node.cert ? decodeURI(decodeURI(node.cert)) : node.origin === 'user' ? undefined : 'INVALIDCERT';

      if (!dappyNetworkAgents[`${ip}-${cert}`]) {
        dappyNetworkAgents[`${ip}-${cert}`] = new https.Agent({
          /* no dns */
          host: ip,
          rejectUnauthorized: false, // cert does not have to be signed by CA (self-signed)
          cert: cert,
          minVersion: 'TLSv1.3',
          ca: [], // we don't want to rely on CA
        });
      }

      const options: https.RequestOptions = {
        agent: dappyNetworkAgents[`${node.ip}-${node.cert}`],
        method: 'POST',
        port: port,
        host: ip,
        rejectUnauthorized: false,
        path: `/${data.type}`,
        headers: {
          'Content-Type': 'application/json',
          'Dappy-Browser': VERSION,
          Host: host,
        },
      };

      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          reject(res.statusCode);
          return;
        }
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      });
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
