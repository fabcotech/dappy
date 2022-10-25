export interface BaseAccount {
  name: string;
  main: boolean;
  whitelist: { host: string; blitz: boolean; transactions: boolean }[];
}
export interface BlockchainAccount extends BaseAccount {
  platform: 'rchain' | 'evm';
  publicKey: string;
  address: string;
  encrypted: string;
  balance: number;
  boxes: string[];
}

export interface CertificateAccount extends BaseAccount {
  platform: 'certificate';
  key: string;
  certificate: string;
}

export type Account = BlockchainAccount | CertificateAccount;

// export interface BlockchainAccount extends Account {
//   platform: 'rchain' | 'evm';
//   publicKey: string;
//   address: string;
//   encrypted: string;
//   main: boolean;
//   balance: number;
//   boxes: string[];
// }
