import https from 'https';
import { blake2b } from 'blakejs';
import cookieParser from 'set-cookie-parser';

const elliptic = require('elliptic');

export interface ChallengeResponse {
  publicKey: string;
  signature: string;
  nonce: string;
}

export const generateSignature = (payload: string, privateKey: string) => {
  const bufferToSign = Buffer.from(payload, "utf8");
  const uInt8Array = new Uint8Array(bufferToSign);
  const blake2bHash = blake2b(uInt8Array, 0, 32);

  const e = new elliptic.ec("secp256k1");
  const keyPair = e.keyFromPrivate(privateKey);

  const signature = keyPair.sign((Buffer || Buffer).from(blake2bHash), {
    canonical: true,
  });
  const derSign = signature.toDER();

  if (!e.verify(Buffer.from(blake2bHash), signature, keyPair, "hex")) {
    throw new Error("Failed to verify signature");
  }

  return Buffer.from(new Uint8Array(derSign)).toString("hex");
};

export const respondToChallenge = (options: https.RequestOptions,  challengeResponse: ChallengeResponse, timeout: number): Promise<{
  cookies: cookieParser.Cookie[];
  location: string | null;
}> => {
  let over = false;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (over === false) {
        over = true;
        reject('TIMEOUT');
      }
    }, timeout);

    const req = https
      .request({
        ...options,
        method: 'post',
        path: '/blitz-authenticate',
        headers: {
          host: (options.headers || {}).host,
          Origin: (options.headers || {}).Origin,
          'Blitz-Authentication-Response': JSON.stringify(challengeResponse)
        }
      }, (resp) => {
        console.log('[blitz-authentication] challenge response code ' + resp.statusCode);
        if (over === false) {
          over = true;
          if ([200, 302].includes(resp.statusCode as number)) {
            try {
              const respCookies = cookieParser.parse(resp, {
                decodeValues: true,
              });
              if (resp.statusCode === 200) {
                resolve({
                  cookies: respCookies,
                  location: null
                });
              } else {
                let redirectUrl = new URL(resp.headers.location as string);
                if (redirectUrl.hostname === (options.headers || {}).host) {
                  resolve({
                    cookies: respCookies,
                    location: resp.headers.location as string
                  });
                } else {
                  reject();
                }
              }
            } catch (err) {
              reject();
            }
          } else {
            reject();
          }
        }
      });
    req.end();
  });
}