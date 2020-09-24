import dns from 'dns';
import https from 'https';

export const getIpAddressAndCert = (hostname: string): Promise<{ cert: string; ip: string }> => {
  return new Promise((resolve, reject) => {
    dns.lookup(hostname, {}, (err, ip, ipv6oripv4) => {
      if (err) {
        reject(err);
        return;
      }
      if (!ip) {
        reject(new Error('IP address not found'));
      }
      var options = {
        host: hostname,
        port: 443,
        method: 'GET',
      };

      var req = https.request(options, function (res) {
        if (res && res.connection && res.connection.getPeerCertificate) {
          const cert = res.connection.getPeerCertificate();
          if (cert.raw && cert.raw.toString('base64')) {
            resolve({
              ip: ip,
              cert: '-----BEGIN CERTIFICATE-----\n' + cert.raw.toString('base64') + '\n-----END CERTIFICATE-----',
            });
          }
        } else {
          reject(new Error('Response connection not found'));
        }
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.end();
    });
  });
};
