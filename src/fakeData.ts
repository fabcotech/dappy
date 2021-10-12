import { RChainTokenPurse, Account, RChainInfos, Blockchain, RChainContractConfig } from '/models';

export const getFakeAccount = (account: Partial<Account> = {}) => ({
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

export const getFakePurse = (props: Partial<RChainTokenPurse> = {}): RChainTokenPurse => ({
  id: 'purse1',
  boxId: 'box1',
  quantity: 500,
  price: 100,
  timestamp: new Date(2021, 10, 10).getTime(),
  ...props,
});

export const getFakeRChainInfos = (rchainInfos: Partial<RChainInfos> = {}) => ({
  chainId: 'chain',
  date: '2021-10-11T13:00:00.000Z',
  info: {
    dappyNodeVersion: 'x.x.x',
    lastFinalizedBlockNumber: 12,
    namePrice: 100000,
    rchainNamesContractId: 'otherContract',
    rchainNamesMasterRegistryUri: 'nosd1g9idkg3dtuhucgy8bd3788iayddxpsnhnzspcw9dyms5an5up',
    rnodeVersion: 'RChain Node 0.12.1 (28aa7954c3b8f6e9a9774a74214dcf2f3b69667b)',
    rchainNetwork: 'fakenet',
  },
  ...rchainInfos,
});

export const getFakeBlockChain = (blockChain: Partial<Blockchain> = {}): Blockchain => ({
  platform: 'rchain',
  chainId: 'chain1',
  chainName: 'chainName1',
  nodes: [],
  ...blockChain
});


export const getFakeRChainContractConfig = (contractConfig: Partial<RChainContractConfig> = {}) => ({
  contractId: 'contract1',
  counter: 1,
  fungible: false,
  locked: false,
  version: 'x.y.z',
  ...contractConfig,
});
