import Ajv from 'ajv';

const ajv = new Ajv();
const readBox1000 = {
  schemaId: 'read-box-10.0.0',
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
const purses1000 = {
  schemaId: 'purses-10.0.0',
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
    required: ['id', 'type', 'quantity', 'boxId', 'timestamp'],
  },
};

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
export const rchainTokenValidators = {
  ['10.0.0']: {
    readBox: readBox1000,
    purses: purses1000,
  },
};
