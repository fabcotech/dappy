import { getDomainWallets } from '.';
import { getFakeCertificateAccount, getFakeEVMAccount } from '/fakeData';

describe('wallets', () => {
  it('getDomainWallets return first main cert', () => {
    const whitelist = [{ host: 'domain', blitz: false, transactions: false }];
    const accounts = getDomainWallets(
      {
        notMain: getFakeCertificateAccount({
          main: false,
          whitelist,
          certificate: 'cert1',
          name: 'notMain',
        }),
        main: getFakeCertificateAccount({
          main: true,
          whitelist,
          certificate: 'cert2',
          name: 'main',
        }),
      },
      { domain: whitelist[0].host }
    );
    expect(accounts[0]?.name).toBe('main');
  });
  it('getDomainWallets should filter by platform', () => {
    const whitelist = [{ host: 'domain', blitz: false, transactions: false }];
    const accounts = getDomainWallets(
      {
        notMain: getFakeCertificateAccount({
          main: false,
          whitelist,
          certificate: 'cert1',
          name: 'notMain',
        }),
        main: getFakeCertificateAccount({
          main: true,
          whitelist,
          certificate: 'cert2',
          name: 'main',
        }),
      },
      { domain: whitelist[0].host, platform: 'evm' }
    );
    expect(accounts[0]?.name).toBeUndefined();
  });
  it('getDomainWallets return wildcard certificate', () => {
    const whitelist = [{ host: 'domain', blitz: false, transactions: false }];
    const wildcardWhitelist = [{ host: '*', blitz: false, transactions: false }];
    const accounts = getDomainWallets(
      {
        notMain: getFakeCertificateAccount({
          main: true,
          whitelist,
          certificate: 'cert1',
          name: 'notMain',
        }),
        main: getFakeCertificateAccount({
          main: false,
          whitelist: wildcardWhitelist,
          certificate: 'cert2',
          name: 'main',
        }),
      },
      { domain: 'anydomain' }
    );
    expect(accounts[0]?.name).toBe('main');
  });
  it('getDomainWallets return first main cert', () => {
    const whitelist = [{ host: 'domain', blitz: false, transactions: false }];
    const accounts = getDomainWallets(
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
      { domain: 'anydomain' }
    );
    expect(accounts).toHaveLength(0);
  });
  it('getDomainWallets filter by domain matching level', () => {
    const accounts = getDomainWallets(
      {
        baz: getFakeEVMAccount({
          whitelist: [{ host: '*', blitz: false, transactions: false }],
          name: 'baz',
        }),
        foo: getFakeEVMAccount({
          whitelist: [{ host: 'bar.baz', blitz: false, transactions: false }],
          name: 'foo',
        }),
        bar: getFakeEVMAccount({
          whitelist: [{ host: 'baz', blitz: false, transactions: false }],
          name: 'bar',
        }),
      },
      { domain: 'foo.bar.baz', matchingLevels: 2 }
    );
    expect(accounts).toEqual([
      getFakeEVMAccount({
        whitelist: [{ host: 'bar.baz', blitz: false, transactions: false }],
        name: 'foo',
      }),
    ]);
  });
});
