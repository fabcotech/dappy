import { Wallet } from './wallet';

import { TxData, Transaction, JsonTx } from '@ethereumjs/tx';
import { utils } from 'rchain-toolkit';

// copied from ethereumjs-util lib
const padToEven = (value: string) => {
  let a = value;
  if (typeof a !== 'string') {
      throw new Error(`[padToEven] value must be type 'string', received ${typeof a}`);
  }
  if (a.length % 2)
      a = `0${a}`;
  return a;
}

// copied from ethereumjs-util lib
const fromUtf8 = (stringValue: string) => {
  const str = Buffer.from(stringValue, 'utf8');
  return `0x${padToEven(str.toString('hex')).replace(/^0+|0+$/g, '')}`;
}

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
