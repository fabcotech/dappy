import * as nacl from 'tweetnacl';
import { decodeUTF8, encodeUTF8 } from 'tweetnacl-util';

export const account = {
  passwordFromStringToBytes: (password: string) => {
    if (!password || password.length < 8 || password.length > 32) {
      throw new Error('Password should have between 8 and 32 characters');
    }
    const passwordBuffer = Buffer.from(password, 'utf8');
    const rest = new Buffer(32 - password.length);
    return new Uint8Array(Buffer.concat([passwordBuffer, rest]));
  },
  encrypt: (message: string, password: Uint8Array, nonceDoNotProvideThisParameter?: Uint8Array): string => {
    let nonce: Uint8Array | undefined;
    if (nonceDoNotProvideThisParameter) {
      if (process.env.NODE_ENV !== 'test')
        console.warn('nonce should be provided as parameter only for testing, hope you are testing');
      nonce = nonceDoNotProvideThisParameter;
    } else {
      nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    }

    const messageUint8 = decodeUTF8(message);

    const box = nacl.secretbox(messageUint8, nonce, password);

    const fullMessage = new Uint8Array(nonce.length + box.length);
    fullMessage.set(nonce);
    fullMessage.set(box, nonce.length);

    return Buffer.from(fullMessage).toString('base64');
  },
  decrypt: (encrypted: string, password: Uint8Array) => {
    const encryptedUInt8Array = new Uint8Array(Buffer.from(encrypted, 'base64'));
    const nonce = encryptedUInt8Array.slice(0, nacl.secretbox.nonceLength);
    const message = encryptedUInt8Array.slice(nacl.secretbox.nonceLength, encryptedUInt8Array.length);

    const decrypted = nacl.secretbox.open(message, nonce, password);

    if (!decrypted) {
      throw new Error('Could not decrypt message');
    }

    return encodeUTF8(decrypted);
  },
};
