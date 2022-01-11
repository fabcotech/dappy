import { JsonTx } from '@ethereumjs/tx';

export interface EthereumTransaction {
  nonce: string | number;
  gasPrice: string | number;
  gasLimit: string | number;
  from: string;
  to: string;
  value: string | number;
  data: string;
  chainId: string;
}

export type EthereumSignedTransaction = JsonTx;
