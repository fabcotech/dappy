import { DappyNetworkMember } from '@fabcotech/dappy-lookup';
import https from 'https';

import { VERSION, WS_PAYLOAD_PAX_SIZE } from '../src/CONSTANTS';

export const httpBrowserToNode = (data: { [key: string]: any }, node: DappyNetworkMember) => {
  return new Promise((resolve, reject) => {
    const s = JSON.stringify(data);
    const l = Buffer.from(s).length;
    if (l > WS_PAYLOAD_PAX_SIZE) {
      reject(new Error(`bn payload is ${l / 1000}kb, max size is ${WS_PAYLOAD_PAX_SIZE / 1000}kb`));
      return;
    }
    try {
      const { ip, hostname, port } = node;
      const caCert =
        node.scheme === 'https' && node.caCert
          ? Buffer.from(node.caCert, 'base64').toString('utf8')
          : 'INVALIDCERT';

      const options: https.RequestOptions = {
        minVersion: 'TLSv1.3',
        rejectUnauthorized: true,
        ca: caCert,
        host: ip,
        method: 'POST',
        port,
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
