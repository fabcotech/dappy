import { blake2b } from 'blakejs';
import * as rchainToolkit from 'rchain-toolkit';
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
  resourceIdToAddress: (dappId: string): string => {
    return dappId.split('_')[0];
  },
  createBase64: (htmlWithTags: string): string => {
    return Buffer.from(htmlWithTags).toString('base64');
  },
  createSignature: (data: string, mimeType: string, name: string, privateKey: string) => {
    const toSign = new Uint8Array(
      Buffer.from(
        JSON.stringify({
          mimeType: mimeType,
          name: name,
          data: data,
        })
      )
    );
    const blake2Hash64 = blake2b(toSign, 0, 64);
    const keyPair = ec.keyFromPrivate(privateKey);
    const signature = keyPair.sign(blake2Hash64);
    const signatureHex = Buffer.from(signature.toDER()).toString('hex');
    if (!ec.verify(blake2Hash64, signature, keyPair.getPublic().encode('hex'), 'hex')) {
      throw new Error('dpy signature verification failed');
    }

    return signatureHex;
  },
  createDpy: (data: string, mimeType: string, name: string, signature: string): string => {
    return JSON.stringify({
      mimeType: mimeType,
      name: name,
      data: data,
      signature: signature,
    });
  },
  getHtmlFromFile: (dappyFile: DappyFile): any => {
    return atob(dappyFile.data);
  },
  shuffle: (array: any[]) => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },
  rchain: {
    getDeployOptions: (
      timestamp: number,
      term: string,
      privateKey: string,
      publicKey: string,
      phloPrice = 1,
      phloLimit = 10000,
      validAfterBlockNumber = 0
    ): DeployOptions => {
      const dd = rchainToolkit.utils.getDeployOptions(
        'secp256k1',
        timestamp,
        term,
        privateKey,
        publicKey,
        phloPrice,
        phloLimit,
        // todo change to -1
        validAfterBlockNumber || 1
      );

      return dd as DeployOptions;
    },
    buildNameTermPayload: (
      publicKey: string,
      name: string,
      address: string | undefined,
      servers: IPServer[] | undefined,
      nonce: string
    ): string => {
      const payload: {
        publicKey: string;
        name: string;
        nonce: string;
        address?: string;
        servers?: IPServer[];
        deployerId?: string;
      } = {
        publicKey: publicKey,
        name: name,
        nonce: nonce,
      };
      if (address) {
        payload.address = address;
      }
      if (servers) {
        payload.servers = servers;
      }
      payload['deployerId'] = '*deployerId';
      return JSON.stringify(payload);
    },
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
  transferFundsTerm: (from: string, to: string, amount: number) => {
    return `new
      basket,
      rl(\`rho:registry:lookup\`),
      RevVaultCh,
      stdout(\`rho:io:stdout\`)
    in {

    rl!(\`rho:rchain:revVault\`, *RevVaultCh) |
    for (@(_, RevVault) <- RevVaultCh) {
      stdout!(("Started transfer")) |
      match (
        "${from}",
        "${to}",
        ${amount}
      ) {
        (from, to, amount) => {
  
          new vaultCh, vaultTo, revVaultkeyCh, deployerId(\`rho:rchain:deployerId\`) in {
            @RevVault!("findOrCreate", from, *vaultCh) |
            @RevVault!("findOrCreate", to, *vaultTo) |
            @RevVault!("deployerAuthKey", *deployerId, *revVaultkeyCh) |
            for (@result <- vaultCh; key <- revVaultkeyCh; _ <- vaultTo) {
              stdout!(result) |
              match result {
                (true, vault) => {
                  stdout!(("Beginning transfer of " , amount , " dust from " , from , " to " , to)) |
                  new resultCh in {
                    @vault!("transfer", to, amount, *key, *resultCh) |
                    for (@result2 <- resultCh) {
                      stdout!(result2) |
                      match result2 {
                        (true, Nil) => {
                          stdout!(("Finished transfer of " , amount , " dusts to " , to)) |
                          basket!({ "status": "completed" })
                        }
                        _ => {
                          stdout!("Failed to transfer REV (vault transfer)") |
                          basket!({ "status": "failed", "message": "Failed to transfer REV (vault transfer)" })
                        }
                      }
                    }
                  }
                }
                _ => {
                  stdout!("Failed to transfer REV (vault not found)") |
                  basket!({ "status": "failed", "message": "Failed to transfer REV (vault not found)" })
                }
              }
            }
          }
        }
      }
    }
  }`;
  },
};
