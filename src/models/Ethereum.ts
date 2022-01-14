import { JsonTx } from '@ethereumjs/tx';

export interface EthereumTransaction {
  nonce: string | number;
  gasPrice: string;
  gasLimit: string;
  from: string;
  to: string;
  value: string;
  data: string;
  chainId: number;
}

export type EthereumSignedTransaction = JsonTx;
