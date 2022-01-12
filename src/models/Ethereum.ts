import { JsonTx } from '@ethereumjs/tx';

export interface EthereumTransaction {
  nonce: string | number;
  gasPrice: string;
  gasLimit: string;
  from: string;
  to: string;
  value: string;
  data: string;
  chainId: string;
}

export type EthereumSignedTransaction = JsonTx;
