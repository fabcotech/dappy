export interface Wallet<DataTransaction, TransferTransaction = DataTransaction> {
  signTransaction: (
    payload: DataTransaction,
    privateKey: string
  ) => {
    data: any;
    deployer: string;
    signature: string;
    sigAlgorithm: 'secp256k1';
  };
  signTransferTransaction: (
    payload: TransferTransaction,
    privateKey: string
  ) => {
    data: any;
    deployer: string;
    signature: string;
    sigAlgorithm: 'secp256k1';
  };
  publicKeyFromPrivateKey: (privateKey: string) => string;
  addressFromPublicKey: (publicKey: string) => string;
}
