import { Wallet } from './wallet';

import { TxData, Transaction, JsonTx } from '@ethereumjs/tx';
import { fromUtf8 } from 'ethereumjs-util'
import { utils } from 'rchain-toolkit';

export const evmWallet: Wallet<TxData, JsonTx> = {
  signTransaction: (tx, privateKey) => {
    if (tx.value) {
      tx.value = fromUtf8(tx.value)
    }
    if (tx.gasLimit) {
      tx.gasLimit = fromUtf8(tx.gasLimit);
    }
    if (tx.gasPrice) {
      tx.gasPrice = fromUtf8(tx.gasPrice);
    }
    const pKey = Buffer.from(privateKey, 'hex');
    return Transaction.fromTxData(tx).sign(pKey).toJSON();
  },

  publicKeyFromPrivateKey: (privateKey: string) => {
    return utils.publicKeyFromPrivateKey(privateKey);
  },
  addressFromPublicKey: (publicKey: string) => {
    return utils.ethAddressFromPublicKey(publicKey);
  },
};
