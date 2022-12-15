import https from 'https';

export const getFavicon = async (address: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const req = https.get(address, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error('Status code not 200'));
        return;
      }
      let s = Buffer.from('');
      res.on('data', (a: Buffer) => {
        s = Buffer.concat([s, a]);
      });
      res.on('end', () => {
        if (!['image/png', 'image/jpeg'].includes(res.headers['content-type']!)) {
          reject(new Error('Unknown favicon img format'));
          return;
        }
        const faviconAsBase64 = `data:${res.headers['content-type']};base64,${s.toString(
          'base64'
        )}`;
        resolve(faviconAsBase64);
      });
    });
    req.end();
  });
};
