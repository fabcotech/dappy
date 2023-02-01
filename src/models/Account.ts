import image_ethereum from '/images/ethereum120x120.png';
import image_polygon from '/images/polygon120x120.png';
import image_binance_smart_chain from '/images/binance120x120.png';
import image_avalanche from '/images/avalanche120x120.png';

export interface BaseAccount {
  name: string;
  main: boolean;
  whitelist: { host: string; blitz: boolean; transactions: boolean }[];
}

export interface EvmNetworks {
  [networkId: string]: [string, string, string];
}
export const evmNetworks: EvmNetworks = {
  1: ['Ethereum Mainnet', image_ethereum, 'ETH'],
  5: ['Ethereum Testnet (Goerli)', image_ethereum, 'ETH (Goerli)'],
  11155111: ['Ethereum Testnet (Sepolia)', image_ethereum, 'ETH (Sepolia)'],
  56: ['Binance Smart Chain Mainnet', image_binance_smart_chain, 'BNB'],
  97: ['Binance Smart Chain TestNet', image_binance_smart_chain, 'BNB (TestNet)'],
  137: ['Polygon Mainnet', image_polygon, 'MATIC'],
  80001: ['Polygon Testnet', image_polygon, 'MATIC (Testnet)'],
  43114: ['Avalanche C-Chain', image_avalanche, 'AVAX'],
};

export const rpcs: { [chainId: string]: { host: string; path: string }[] } = {
  1: [
    {
      host: 'eth-mainnet.alchemyapi.io',
      path: '/v2/apikey',
    },
  ],
  137: [
    {
      host: 'polygon-mainnet.g.alchemy.com',
      path: '/v2/apikey',
    },
  ],
};

export interface BlockchainAccount extends BaseAccount {
  platform: 'rchain' | 'evm' | 'metamask' | 'ledger';
  publicKey: string;
  address: string;
  encrypted: string;
  balance: number;
  chainId?: keyof EvmNetworks;
  boxes: string[];
}

export interface CertificateAccount extends BaseAccount {
  platform: 'certificate';
  key: string;
  certificate: string;
}

export type Account = BlockchainAccount | CertificateAccount;
