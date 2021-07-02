import Ajv from 'ajv';

const ajv = new Ajv();
const readBox500 = {
  schemaId: 'read-box-5.0.3',
  type: 'object',
  properties: {
    version: { type: 'string' },
    registryUri: { type: 'string' },
    publicKey: { type: 'string' },
    status: { type: 'string' },
    purses: {
      type: 'object',
    },
    superKeys: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['purses', 'superKeys', 'version', 'registryUri', 'publicKey', 'status'],
};
const purses500 = {
  schemaId: 'purses-5.0.3',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      publicKey: { type: 'string' },
      box: { type: 'string' },
      type: { type: 'string' },
      quantity: { type: 'number' },
      price: { type: 'number', nullable: true },
    },
    required: ['id', 'type', 'quantity', 'publicKey'],
  },
};
const readBox600 = {
  schemaId: 'read-box-6.0.0',
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
const purses600 = {
  schemaId: 'purses-6.0.0',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      boxId: { type: 'string' },
      type: { type: 'string' },
      quantity: { type: 'number' },
      price: { type: 'number', nullable: true },
    },
    required: ['id', 'type', 'quantity', 'boxId'],
  },
};

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
export const rchainTokenValidators = {
  ['5.0.3']: {
    readBox: readBox500,
    purses: purses500,
  },
  ['6.0.0']: {
    readBox: readBox600,
    purses: purses600,
  },
  ['6.0.1']: {
    readBox: readBox600,
    purses: purses600,
  },
};
