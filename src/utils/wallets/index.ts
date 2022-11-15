import { Account } from '/models';

export * from './rchainWallet';
export * from './evmWallet';

export function getDomainWallets(
  accounts: Record<string, Account>,
  {
    domain,
    platform,
    matchingLevels,
  }: { domain: string; platform?: Account['platform']; matchingLevels?: number }
) {
  return Object.values(accounts)
    .filter((a) => (platform ? a.platform === platform : true))
    .sort((a1, a2) => Number(a2.main) - Number(a1.main))
    .filter((a) => {
      const minMatchingLevels = matchingLevels || 1;
      const hosts = a.whitelist.map(({ host }) => host);
      return hosts.find((h) => {
        const sanitizedHost = h.replace('*', '[^.]+');
        return (
          new RegExp(`(\\.|^)${sanitizedHost}$`).test(domain) &&
          h.split('.').length >= minMatchingLevels
        );
      });
    });
}
