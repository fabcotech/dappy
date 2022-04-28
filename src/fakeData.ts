import { DappyNetworkMember  } from '@fabcotech/dappy-lookup';
import {
  RChainTokenPurse,
  Account,
  RChainInfos,
  Blockchain,
  RChainContractConfig,
  TransactionState,
  TransactionStatus,
} from '/models';

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
    '045c15100f48257ca5671aa7bd8667d4363eef2c974b23638f69dd4f8e0a02f219f5e0daa2e7e90e26d034f92804e22a4b0b2c5c1c8001b12e1dccd250eea6a561',
  address: '0x4e0bb90593af40b3cb14533a434abfdbc099634b',
  // password: Dappy00!
  encrypted:
    'bmjyZLtfuE81jZhly6e/O1luznZsxLpzuGhmP/O8xHva/w9jS/apembV0Vx5eC+B5SnPuAwl6vgM+rM8bDwfXjhAw8b5X10RUGB8rSSpqXM3Gi2k5reEIoDDURwJpvfkZoGLYi+I090=',
  main: true,
  balance: 1000000,
  boxes: [],
  ...account,
});

export const getFakePurse = (props: Partial<RChainTokenPurse> = {}): RChainTokenPurse => ({
  id: 'purse1',
  boxId: 'box1',
  quantity: 500,
  price: ['nosrev', 100],
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
    namePrice: ["nosrev", 50000000],
    rchainNamesContractId: 'contract1',
    rchainNamesMasterRegistryUri: 'nosd1g9idkg3dtuhucgy8bd3788iayddxpsnhnzspcw9dyms5an5up',
    wrappedRevContractId: 'nosrev',
    rnodeVersion: 'RChain Node 0.12.1 (28aa7954c3b8f6e9a9774a74214dcf2f3b69667b)',
    rchainNetwork: 'fakenet',
    rchainShardId: 'fakenet5',
  },
  ...rchainInfos,
});

export const getFakeBlockChain = (blockChain: Partial<Blockchain> = {}): Blockchain => ({
  platform: 'rchain',
  auto: false,
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

export const getFakeDappyNetworkMember = (dappyNetworkMember: Partial<DappyNetworkMember> = {}): DappyNetworkMember => ({
  scheme: 'https',
  ip: '127.0.0.1',
  port: '443',
  hostname: 'dappy.dev',
  caCert: '-----BEGIN CERT------',
  ...dappyNetworkMember,
});

export const getFakeLogs = (contractId: string = 'foo') => ({
  [contractId]: [],
});

export const getFakeNewNamePurchaseLog = (
  date: Date = new Date(0),
  nbToken = 1,
  wrappedDustPrice = 100000000,
  purse = 'foo'
) => `p,${date.getTime()},aaa,aaa,${nbToken},ft_${wrappedDustPrice}_wrappeddust,0,${purse}`;

export const getFakeExistingNamePurchaseLog = (
  date: Date = new Date(0),
  nbToken = 1,
  wrappedDustPrice = 100000000,
  purse = 'foo'
) => `p,${date.getTime()},aaa,aaa,${nbToken},ft_${wrappedDustPrice}_wrappeddust,foo,${purse}`;

export const getFakeTransactionState = (transactionState: Partial<TransactionState> = {}): TransactionState => ({
  sentAt: new Date('01/01/2022').toISOString(),
  id: 'fake transaction id',
  blockchainId: 'fake blockchain id',
  origin: {
    origin: 'dapp',
    accountName: 'fake account name',
    tabId: 'fake tab id',
    dappTitle: 'fake title',
    callId: 'fake call id',
  },
  value: 'fake result value',
  status: TransactionStatus.Signed,
  platform: 'evm',
  transaction: undefined,
});
