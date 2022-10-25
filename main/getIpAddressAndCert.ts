import dns from 'dns';
import https from 'https';
import { TLSSocket } from 'tls';

export const getIpAddressAndCert = (hostname: string): Promise<{ cert: string; ip: string }> => {
  return new Promise((resolve, reject) => {
    dns.lookup(hostname, {}, (err, ip) => {
      const options = {
        host: hostname,
        rejectUnauthorized: false,
        port: 443,
        method: 'GET',
      };

      const req = https.request(options, (res) => {
        if (res && res.socket && (res.socket as TLSSocket).getPeerCertificate) {
          const cert = (res.socket as TLSSocket).getPeerCertificate();
          if (cert.raw && cert.raw.toString('base64')) {
            resolve({
              ip,
              cert: `-----BEGIN CERTIFICATE-----
${cert.raw.toString('base64')}
-----END CERTIFICATE-----`,
            });
          }
        } else {
          reject(new Error('Response connection not found'));
        }
      });

      if (err) {
        reject(err);
        return;
      }
      if (!ip) {
        reject(new Error('IP address not found'));
      }

      req.on('error', (err2) => {
        reject(err2);
      });

      req.end();
    });
  });
};
