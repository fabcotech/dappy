import Ajv from 'ajv';

import { validate, ValidationError } from './Validate';

const ajv = new Ajv();
const readBox1400 = {
  schemaId: 'read-box-15.0.2',
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
const purses1400 = {
  schemaId: 'purses-15.0.2',
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

const contractConfig1400 = {
  schemaId: 'contract-config-15.0.2',
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

const createPursePayload1400 = {
  schemaId: 'create-purse-payload-15.0.2',
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
            price: { type: ['integer', 'null'] },
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
  readBox: (obj: any) => ValidationError[];
  purses: (obj: any) => ValidationError[];
  contractConfig: (obj: any) => ValidationError[];
  createPursePayload: (obj: any) => ValidationError[];
}

export const LATEST_PROTOCOL_VERSION = '15.0.2';

export const rchainTokenValidators: Record<string, RChainTokenTypes> = {
  ['15.0.2']: {
    readBox: validate(readBox1400),
    purses: validate(purses1400),
    contractConfig: validate(contractConfig1400),
    createPursePayload: validate(createPursePayload1400),
  },
};
