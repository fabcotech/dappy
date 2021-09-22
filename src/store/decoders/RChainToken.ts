import Ajv from 'ajv';

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
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      boxId: { type: 'string' },
      quantity: { type: 'number' },
      timestamp: { type: 'number' },
      price: { type: 'number', nullable: true },
    },
    required: ['id', 'quantity', 'boxId', 'timestamp'],
  },
};

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
export const rchainTokenValidators = {
  ['12.0.1']: {
    readBox: readBox1201,
    purses: purses1201,
  },
};
