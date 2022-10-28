import { generateCertificateAndKey } from './generateCertificateAndKey';

describe('generateCertificateAndKey', () => {
  it('should generate 2048 RSA key and self signed certificate', () => {
    const [key, cert] = generateCertificateAndKey({
      days: 100,
      selfSigned: true,
      altNames: ['default.dappy.gamma'],
      now: new Date('01/01/1970'),
    });

    expect(cert).not.toBeUndefined();
    expect(key).not.toBeUndefined();
  });
});
