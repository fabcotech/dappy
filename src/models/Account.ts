export interface Account {
  platform: 'rchain';
  name: string;
  publicKey: string;
  address: string;
  encrypted: string;
  main: boolean;
  balance: number;
  boxes: string[];
}
