import * as zlib from 'zlib';
import elliptic from 'elliptic';
import { BeesLoadError } from '@fabcotech/bees';

import { DappyFile, DappyLoadError } from '/models';
import { validateDpy, validateFile } from './Dpy';

const ec = new elliptic.ec('secp256k1');

export const validateAndReturnFile = async (
  dataNotParsed: string,
  purseId: string,
  publicKeyFromRequest: string,
  checkSignature: boolean
): Promise<DappyFile> => {
  let file;
  let parsed;
  try {
    parsed = JSON.parse(dataNotParsed);
    if (!parsed.expr[0]) {
      throw new Error();
    }
  } catch (err) {
    throw new Error(
      JSON.stringify({
        error: DappyLoadError.FailedToParseResponse,
        args: {
          message: 'File does not exist',
        },
      })
    );
  }

  try {
    // todo move this function verifyAndReturnFile in main process ?
    const dataAtNameBuffer = Buffer.from(parsed.expr[0].ExprMap.data[purseId].ExprString.data, 'base64');
    const unzippedBuffer = zlib.gunzipSync(dataAtNameBuffer);
    file = unzippedBuffer.toString('utf-8');
  } catch (err) {
    console.log(err);
    throw new Error(
      JSON.stringify({
        error: DappyLoadError.InvalidManifest,
        args: {
          message: 'Failed to validate file, string is not valid base64 + gzipped',
        },
      })
    );
  }

  let parsedFile: DappyFile | undefined;
  try {
    parsedFile = JSON.parse(file);
    await validateDpy(parsedFile);
  } catch (err) {
    try {
      parsedFile = JSON.parse(file);
      await validateFile(parsedFile);
    } catch (err) {
      console.log(err);
      throw new Error(
        JSON.stringify({
          error: DappyLoadError.InvalidManifest,
          args: {
            message: 'Failed to validate file' + err,
          },
        })
      );
    }
  }

  const signatureHex = (parsedFile as DappyFile).signature;
  const name = (parsedFile as DappyFile).name;
  const mimeType = (parsedFile as DappyFile).mimeType;
  const data = (parsedFile as DappyFile).data;

  if (!checkSignature) {
    return parsedFile as DappyFile;
  }
  return parsedFile as DappyFile;
  /* // todo verify file signature
  const toVerify = new Uint8Array(
    Buffer.from(
      JSON.stringify({
        mimeType: mimeType,
        name: name,
        data: data,
      })
    )
  );
  const blake2Hash64 = blake2b(toVerify, 0, 64);

  let verify = false;
  try {
    verify = ec.verify(blake2Hash64, Buffer.from(signatureHex, 'hex'), Buffer.from(publicKeyFromRequest, 'hex'), 'hex');
  } catch (err) {
    throw new Error(
      JSON.stringify({
        error: BeesLoadError.InvalidSignature,
        args: {},
      })
    );
  }

  if (!verify) {
    throw new Error(
      JSON.stringify({
        error: BeesLoadError.InvalidSignature,
        args: {},
      })
    );
  }

  return parsedFile as DappyFile; */
};
