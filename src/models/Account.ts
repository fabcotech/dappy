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
  [networkId: string]: [string, string];
}
export const evmNetworks: EvmNetworks = {
  1: ['Ethereum Mainnet', image_ethereum],
  3: ['Ethereum Testnet (Ropsten)', image_ethereum],
  4: ['Ethereum Testnet (Rinkeby)', image_ethereum],
  56: ['Binance Smart Chain Mainnet', image_binance_smart_chain],
  97: ['Binance Smart Chain TestNet', image_binance_smart_chain],
  137: ['Polygon Mainnet', image_polygon],
  80001: ['Polygon Testnet', image_polygon],
  43114: ['Avalanche C-Chain', image_avalanche],
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
