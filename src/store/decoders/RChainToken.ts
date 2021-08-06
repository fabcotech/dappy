import Ajv from 'ajv';

const ajv = new Ajv();
const readBox800 = {
  schemaId: 'read-box-8.0.0',
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
const purses800 = {
  schemaId: 'purses-8.0.0',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      boxId: { type: 'string' },
      type: { type: 'string' },
      quantity: { type: 'number' },
      timestamp: { type: 'number' },
      price: { type: 'number', nullable: true },
    },
    required: ['id', 'type', 'quantity', 'boxId', 'timestammp'],
  },
};

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
export const rchainTokenValidators = {
  ['8.0.0']: {
    readBox: readBox800,
    purses: purses800,
  },
};
