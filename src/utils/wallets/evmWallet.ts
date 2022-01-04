import { Wallet } from './wallet';

interface EVMTransaction {
  to: string;
  nonce: string;
  gasLimit: string;
  gasPrice: string;
  value: any;
  data: any;
  chainId: string;
}

export const evmWallet: Wallet<EVMTransaction> = {
  signTransaction: (tx, privateKey) => {
    return {
      data: undefined,
      deployer: '',
      sigAlgorithm: 'secp256k1',
      signature: '',
    };
  },
  signTransferTransaction: (tx, privateKey) => {
    return {
      data: undefined,
      deployer: '',
      sigAlgorithm: 'secp256k1',
      signature: '',
    };
  },
  publicKeyFromPrivateKey: (privateKey: string) => {
    return '';
    // return rc.utils.publicKeyFromPrivateKey(privateKey);
  },
  addressFromPublicKey: (publicKey: string) => {
    return '';
    // return rc.utils.ethAddressFromPublicKey(publicKey);
  },
};
