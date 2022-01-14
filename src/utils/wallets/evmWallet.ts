import { Wallet } from './wallet';

import { TxData, Transaction, JsonTx } from '@ethereumjs/tx';
import Common from '@ethereumjs/common';
import { utils } from 'rchain-toolkit';

export const evmWallet: Wallet<TxData & { chainId: number }, JsonTx> = {
  signTransaction: (tx, privateKey) => {
    if (tx.value) {
      tx.value = tx.value;
    }
    if (tx.gasLimit) {
      tx.gasLimit = tx.gasLimit;
    }
    if (tx.gasPrice) {
      tx.gasPrice = tx.gasPrice;
    }
    const pKey = Buffer.from(privateKey, 'hex');
    const signedtx = Transaction.fromTxData(tx, { common: Common.custom({ chainId: tx.chainId }) }).sign(pKey);
    return signedtx.toJSON();
  },

  publicKeyFromPrivateKey: (privateKey: string) => {
    return utils.publicKeyFromPrivateKey(privateKey);
  },
  addressFromPublicKey: (publicKey: string) => {
    return utils.ethAddressFromPublicKey(publicKey);
  },
};
