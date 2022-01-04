export interface Wallet<Transaction, SignedTransaction = Transaction> {
  signTransaction: (transactionRaw: Transaction, privateKey: string) => SignedTransaction;
  publicKeyFromPrivateKey: (privateKey: string) => string;
  addressFromPublicKey: (publicKey: string) => string;
}
