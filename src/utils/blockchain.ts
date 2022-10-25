import { blake2b } from 'blakejs';
import * as rchainToolkit from '@fabcotech/rchain-toolkit';
import * as elliptic from 'elliptic';
import Ajv from 'ajv';

import { DappyFile, IPServer, DeployOptions } from '../models';

const ajv = new Ajv();
const schema = {
  schemaId: 'dpy-or-file-ast-rholang',
  type: 'object',
  properties: {
    expr: {
      type: 'object',
      properties: {
        ExprString: {
          type: 'object',
          properties: {
            data: {
              type: 'string',
            },
          },
          require: ['data'],
        },
      },
      required: ['ExprString'],
    },
    block: {
      type: 'object',
      properties: {
        seqNum: {
          type: 'number',
        },
        timestamp: {
          type: 'number',
        },
      },
      required: ['seqNum', 'timestamp'],
    },
  },
  required: ['expr', 'block'],
};

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

const validate = ajv.compile(schema);

const ec = new elliptic.ec('secp256k1');

export const blockchain = {
  getUniqueTransactionId: () => {
    return new Date().getTime() + Math.round(Math.random() * 10000).toString();
  },
  resourceIdToAddress: (resourceId: string): string => {
    return resourceId.split('_')[0];
  },
  createBase64: (htmlWithTags: string): string => {
    return Buffer.from(htmlWithTags).toString('base64');
  },
  createSignature: (data: string, mimeType: string, name: string, privateKey: string) => {
    const toSign = new Uint8Array(
      Buffer.from(
        JSON.stringify({
          mimeType,
          name,
          data,
        })
      )
    );
    const blake2Hash64 = blake2b(toSign, 0, 64);
    const keyPair = ec.keyFromPrivate(privateKey);
    const signature = keyPair.sign(blake2Hash64);
    const signatureHex = Buffer.from(signature.toDER()).toString('hex');
    const pub: any = keyPair.getPublic().encode('hex', false);
    if (!ec.verify(blake2Hash64, signature, pub, 'hex')) {
      throw new Error('dpy signature verification failed');
    }

    return signatureHex;
  },
  createDpy: (data: string, mimeType: string, name: string, signature: string): string => {
    return JSON.stringify({
      mimeType,
      name,
      data,
      signature,
    });
  },
  getHtmlFromFile: (dappyFile: DappyFile): any => {
    return atob(dappyFile.data);
  },
  shuffle: (array: any[]) => {
    let currentIndex = array.length;
      let temporaryValue;
      let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },
  rchain: {
    balanceTerm: (address: string) => {
      return ` new return, rl(\`rho:registry:lookup\`), RevVaultCh, vaultCh, balanceCh in {
        rl!(\`rho:rchain:revVault\`, *RevVaultCh) |
        for (@(_, RevVault) <- RevVaultCh) {
          @RevVault!("findOrCreate", "${address}", *vaultCh) |
          for (@(true, vault) <- vaultCh) {
            @vault!("balance", *balanceCh) |
            for (@balance <- balanceCh) { return!(balance) }
          }
        }
      }`;
    },
  },
};
