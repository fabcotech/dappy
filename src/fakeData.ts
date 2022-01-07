import { RChainTokenPurse, Account, RChainInfos, Blockchain, RChainContractConfig, BlockchainNode } from '/models';

export const getFakeRChainAccount = (account: Partial<Account> = {}): Account => ({
  platform: 'rchain',
  name: 'account1',
  publicKey:
    '04be064356846e36e485408df50b877dd99ba406d87208add4c92b3c7d4e4c663c2fbc6a1e6534c7e5c0aec00b26486fad1daf20079423b7c8ebffbbdff3682b58',
  address: '1111Wbd8KLeWBVsxByF9iksJ4QRRjEF3nq1ScgAw7bMbtomxHsqqd',
  encrypted:
    'QXWz8V0oAZUj6J9ORUoK5ND8X2zFjsfDWvxJNyjkfslelEHuV/4742xeEmE/t/nedFcfp5qZd+IhpzPIBkEr4GuAGs996TNEkDMdh4eMjFpTL2BboBBw/t0NhBrYBRfpTAtgiELRPoI=',
  main: true,
  balance: 1000000,
  boxes: ['box1', 'box2'],
  ...account,
});

export const getFakeEVMAccount = (account: Partial<Account> = {}): Account => ({
  platform: 'evm',
  name: 'account1',
  publicKey:
    '0408adc2ae9d8e0dd7c9f471aeb94a38d343cbb916d0369aa3c9fafe678b260554b5f6480a44c721af9fc21280c1a1c0cd8cf7c0a906072c92ee1a199521e076e1',
  address: '0x9bbaaffdb97e90652fea7d9e23e4b0e47613f372',
  encrypted:
    '/HO4k8kaye2B13MXGpGvpo66zZhYgmzXrNqBsK95h+i6Bo+DfizmU4rbnUSTPU5Je6n6lo3ryzH17eTwJix7oeSoGC3WGWMUYsOJ2AAzeaS/u0KmTw43Y2Mtxts1CHRrHdGOV4dTm3g=',
  main: true,
  balance: 1000000,
  boxes: [],
  ...account,
});

export const getFakePurse = (props: Partial<RChainTokenPurse> = {}): RChainTokenPurse => ({
  id: 'purse1',
  boxId: 'box1',
  quantity: 500,
  price: 100,
  timestamp: new Date(2021, 10, 10).getTime(),
  ...props,
});

export const getFakeRChainInfos = (rchainInfos: Partial<RChainInfos> = {}): RChainInfos => ({
  chainId: 'chain1',
  date: '2021-10-11T13:00:00.000Z',
  info: {
    dappyNodeVersion: 'x.x.x',
    dappyBrowserMinVersion: '0.5.1',
    dappyBrowserDownloadLink: 'https://download',
    lastFinalizedBlockNumber: 12,
    namePrice: 100000,
    rchainNamesContractId: 'contract1',
    rchainNamesMasterRegistryUri: 'nosd1g9idkg3dtuhucgy8bd3788iayddxpsnhnzspcw9dyms5an5up',
    rnodeVersion: 'RChain Node 0.12.1 (28aa7954c3b8f6e9a9774a74214dcf2f3b69667b)',
    rchainNetwork: 'fakenet',
  },
  ...rchainInfos,
});

export const getFakeBlockChain = (blockChain: Partial<Blockchain> = {}): Blockchain => ({
  platform: 'rchain',
  chainId: 'chain1',
  chainName: 'chain1',
  nodes: [],
  ...blockChain,
});

export const getFakeRChainContractConfig = (contractConfig: Partial<RChainContractConfig> = {}) => ({
  contractId: 'contract1',
  counter: 1,
  fungible: false,
  locked: false,
  version: 'x.y.z',
  ...contractConfig,
});

export const getFakeBlockChainNode = (blockChainNode: Partial<BlockchainNode> = {}) => ({
  ip: '127.0.0.1',
  host: 'dappy.dev',
  origin: 'user' as BlockchainNode['origin'],
  active: true,
  readyState: 1 as BlockchainNode['readyState'],
  ssl: true,
  ...blockChainNode,
});

export const getFakeLogs = (contractId: string = 'foo') => ({
  [contractId]: [],
});

export const getFakeNewNamePurchaseLog = (
  date: Date = new Date(0),
  nbToken = 1,
  dustPrice = 100000000,
  purse = 'foo'
) => `p,${date.getTime()},aaa,aaa,${nbToken},${dustPrice},0,${purse}`;
export const getFakeExistingNamePurchaseLog = (
  date: Date = new Date(0),
  nbToken = 1,
  dustPrice = 100000000,
  purse = 'foo'
) => `p,${date.getTime()},aaa,aaa,${nbToken},${dustPrice},foo,${purse}`;
