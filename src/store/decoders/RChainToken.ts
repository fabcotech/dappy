import Ajv from 'ajv';

import { validate, ValidationError } from './Validate';

const ajv = new Ajv();

export const validateRChainTokenPrice = (data: any) => {
  if (data === null) {
    return true
  } else if (Array.isArray(data) && data.length === 2) {
    if (
      typeof data[0] === "string" &&
      typeof data[1] === "string" && 
      data[0].length > 1 &&
      data[1].length > 1
    ) {
      return true;
    } else if (
      typeof data[0] === "string" &&
      typeof data[1] === "number" && 
      data[0].length > 1 &&
      !isNaN(data[1]) &&
      data[1] !== 0
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const readBox1400 = {
  schemaId: 'read-box-16.0.0',
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
  schemaId: 'purses-16.0.0',
  type: 'object',
  patternProperties: {
    '.{1,}': {
      type: 'object',
      properties: {
        id: { type: 'string' },
        boxId: { type: 'string' },
        quantity: { type: 'integer' },
        timestamp: { type: 'integer' },
        price: { "anyOf": [{ type: "null" }, { type: "array", validate: validateRChainTokenPrice }] },
      },
      required: ['id', 'quantity', 'boxId', 'timestamp'],
    },
  },
};

const contractConfig1400 = {
  schemaId: 'contract-config-16.0.0',
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
  schemaId: 'create-purse-payload-16.0.0',
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
            price: { type: 'null' },
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

export const LATEST_PROTOCOL_VERSION = '16.0.0';

export const rchainTokenValidators: Record<string, RChainTokenTypes> = {
  ['16.0.0']: {
    readBox: validate(readBox1400),
    purses: validate(purses1400),
    contractConfig: validate(contractConfig1400),
    createPursePayload: validate(createPursePayload1400),
  },
};
