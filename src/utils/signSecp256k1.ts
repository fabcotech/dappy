import * as elliptic from 'elliptic';

const ec = new elliptic.ec('secp256k1');

export const signSecp256k1 = (hash: Uint8Array, privateKey: string): Uint8Array => {
  const keyPair = ec.keyFromPrivate(privateKey);

  const signature = keyPair.sign(Buffer.from(hash), { canonical: true });
  const derSign = signature.toDER();

  if (
    !ec.verify(Buffer.from(hash), Buffer.from(derSign), Buffer.from(keyPair.getPublic().encode('array', false)), 'hex')
  ) {
    throw new Error('Signature verification failed');
  }

  return new Uint8Array(derSign);
};
