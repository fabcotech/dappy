import { Wallet } from './wallet';

import { TxData, Transaction } from '@ethereumjs/tx';
import { utils } from 'rchain-toolkit';

export const evmWallet: Wallet<TxData> = {
  signTransaction: (tx, privateKey) => {
    const pKey = Buffer.from(privateKey, 'hex');
    return Transaction.fromTxData(tx).sign(pKey);
  },

  publicKeyFromPrivateKey: (privateKey: string) => {
    return utils.publicKeyFromPrivateKey(privateKey);
  },
  addressFromPublicKey: (publicKey: string) => {
    return utils.ethAddressFromPublicKey(publicKey);
  },
};
