import { blake2b } from 'blakejs';
import * as rchainToolkit from 'rchain-toolkit';

export const generateSignature = (nonce: string | Uint8Array, privateKey: string) => {
  const bufferToSign = Buffer.from(nonce);
  const uInt8Array = new Uint8Array(bufferToSign);

  const blake2bHash = blake2b(uInt8Array, 0, 32);
  const signature = rchainToolkit.utils.signSecp256k1(blake2bHash, privateKey);

  return Buffer.from(signature).toString('hex');
};
