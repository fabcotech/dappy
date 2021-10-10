import Ajv from 'ajv';

import { validate, ValidationError } from './Validate';

const ajv = new Ajv();
const readBox1201 = {
  schemaId: 'read-box-12.0.1',
  type: 'object',
  properties: {
    version: { type: 'string' },
    publicKey: { type: 'string' },
    purses: {
      type: 'object',
    },
    superKeys: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['purses', 'superKeys', 'version', 'publicKey'],
};
const purses1201 = {
  schemaId: 'purses-12.0.1',
  type: 'object',
  patternProperties: {
    '.{1,}': {
      type: 'object',
      properties: {
        id: { type: 'string' },
        boxId: { type: 'string' },
        quantity: { type: 'integer' },
        timestamp: { type: 'integer' },
        price: { type: 'integer', nullable: true },
      },
      required: ['id', 'quantity', 'boxId', 'timestamp'],
    },
  },
};

const contractConfig1201 = {
  schemaId: 'contract-config-12.0.1',
  type: 'object',
  properties: {
    contractId: { type: 'string' },
    counter: { type: 'integer' },
    fungible: { type: 'boolean' },
    locked: { type: 'boolean' },
    version: { type: 'string' },
    fee: {
      type: 'array',
      items: [{ type: 'string' }, { type: 'integer' }],
    },
    expires: { type: 'integer', nullable: true },
  },
  required: ['contractId', 'counter', 'fungible', 'locked', 'version'],
};

const createPursePayload1201 = {
  schemaId: 'create-purse-payload-12.0.1',
  type: 'object',
  properties: {
    boxId: { type: 'string' },
    contractId: { type: 'string' },
    masterRegistryUri: { type: 'string' },
    data: {
      type: 'object',
      patternProperties: {
        '.{1,}': {
          type: 'string',
        },
      },
    },
    purses: {
      type: 'object',
      patternProperties: {
        '.{1,}': {
          type: 'object',
          properties: {
            id: { type: 'string' },
            boxId: { type: 'string' },
            quantity: { type: 'integer' },
            price: { type: 'integer', nullable: true },
          },
          required: ['id', 'quantity', 'boxId'],
        },
      },
    },
  },
  required: ['contractId', 'boxId', 'masterRegistryUri', 'purses'],
};

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

interface RChainTokenTypes {
  readBox: (obj: any) => ValidationError[] | undefined;
  purses: (obj: any) => ValidationError[] | undefined;
  contractConfig: (obj: any) => ValidationError[] | undefined;
  createPursePayload: (obj: any) => ValidationError[] | undefined;
}

export const LATEST_PROTOCOL_VERSION = '12.0.1';

export const rchainTokenValidators: { [k: string]: RChainTokenTypes } = {
  ['12.0.1']: {
    readBox: validate(readBox1201),
    purses: validate(purses1201),
    contractConfig: validate(contractConfig1201),
    createPursePayload: validate(createPursePayload1201),
  },
};
