export interface Account {
  platform: 'rchain' | 'evm';
  name: string;
  publicKey: string;
  address: string;
  encrypted: string;
  main: boolean;
  balance: number;
  boxes: string[];
  whitelist: { host: string; blitz: boolean; transactions: boolean }[];
}
