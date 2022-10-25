import { getDomainClientCertificate } from './launchTabCompleted';
import { getFakeCertificateAccount } from '/fakeData';

describe('launchTabCompleted', () => {
  it('getDomainClientCertificate return first main cert', () => {
    const whitelist = [{ host: 'domain', blitz: false, transactions: false }];
    const account = getDomainClientCertificate(
      {
        notMain: getFakeCertificateAccount({
          main: false,
          whitelist,
          certificate: 'cert1',
        }),
        main: getFakeCertificateAccount({
          main: true,
          whitelist,
          certificate: 'cert2',
        }),
      },
      whitelist[0].host
    );
    expect(account?.certificate).toBe('cert2');
  });
  it('getDomainClientCertificate return wildcard certificate', () => {
    const whitelist = [{ host: 'domain', blitz: false, transactions: false }];
    const wildcardWhitelist = [{ host: '*', blitz: false, transactions: false }];
    const account = getDomainClientCertificate(
      {
        notMain: getFakeCertificateAccount({
          main: true,
          whitelist,
          certificate: 'cert1',
        }),
        main: getFakeCertificateAccount({
          main: false,
          whitelist: wildcardWhitelist,
          certificate: 'cert2',
        }),
      },
      'anydomain'
    );
    expect(account?.certificate).toBe('cert2');
  });
  it('getDomainClientCertificate return first main cert', () => {
    const whitelist = [{ host: 'domain', blitz: false, transactions: false }];
    const account = getDomainClientCertificate(
      {
        notMain: getFakeCertificateAccount({
          main: false,
          whitelist,
          certificate: 'cert1',
        }),
        main: getFakeCertificateAccount({
          main: false,
          whitelist,
          certificate: 'cert2',
        }),
      },
      'anydomain'
    );
    expect(account?.certificate).toBeUndefined();
  });
});
