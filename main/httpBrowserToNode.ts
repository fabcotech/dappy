import { DappyNetworkMember } from 'dappy-lookup';
import https from 'https';

import { VERSION, WS_PAYLOAD_PAX_SIZE } from '../src/CONSTANTS';

const dappyNetworkAgents: { [key: string]: https.Agent } = {};

export const httpBrowserToNode = (data: { [key: string]: any }, node: DappyNetworkMember, timeout?: number) => {
  return new Promise((resolve, reject) => {
    const s = JSON.stringify(data);
    const l = Buffer.from(s).length;
    if (l > WS_PAYLOAD_PAX_SIZE) {
      reject(`bn payload is ${l / 1000}kb, max size is ${WS_PAYLOAD_PAX_SIZE / 1000}kb`);
      return;
    }
    try {
      console.log('httpBrowserToNode')
      console.log(node)
      const ip = node.ip;
      const hostname = node.hostname;
      const port = node.port;
      const caCert = node.caCert ? Buffer.from(node.caCert, 'base64').toString('utf8') : 'INVALIDCERT';

      if (!dappyNetworkAgents[`${ip}-${caCert}`]) {
        dappyNetworkAgents[`${ip}-${caCert}`] = new https.Agent({
          /* no dns */
          host: ip,
          rejectUnauthorized: true, // true by default
          minVersion: 'TLSv1.3',
          ca: caCert,
        });
      }

      const options: https.RequestOptions = {
        agent: dappyNetworkAgents[`${ip}-${caCert}`],
        method: 'POST',
        port: port,
        path: `/${data.type}`,
        headers: {
          'Content-Type': 'application/json',
          'Dappy-Browser': VERSION,
          Host: hostname,
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
