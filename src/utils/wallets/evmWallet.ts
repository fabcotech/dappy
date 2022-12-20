import { JsonTx, FeeMarketEIP1559TxData, FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import { BigIntLike } from '@ethereumjs/util';
import { Common, Hardfork } from '@ethereumjs/common';
import * as rchainToolkit from '@fabcotech/rchain-toolkit';

import { Wallet } from './wallet';

export const convertToNumber = (value: BigIntLike | undefined): number => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    if (value.startsWith('0x')) {
      return parseInt(value, 16);
    }
    return parseInt(value, 10);
  }
  return NaN;
};

export const evmWallet: Wallet<FeeMarketEIP1559TxData, JsonTx> = {
  signTransaction: (tx, privateKey) => {
    const pKey = Buffer.from(privateKey, 'hex');
    const signedtx = FeeMarketEIP1559Transaction.fromTxData(tx, {
      common: new Common({ chain: convertToNumber(tx.chainId), hardfork: Hardfork.London }),
    }).sign(pKey);
    return signedtx.toJSON();
  },

  publicKeyFromPrivateKey: (privateKey: string) => {
    return rchainToolkit.utils.publicKeyFromPrivateKey(privateKey);
  },
  addressFromPublicKey: (publicKey: string) => {
    return rchainToolkit.utils.ethAddressFromPublicKey(publicKey);
  },
};
