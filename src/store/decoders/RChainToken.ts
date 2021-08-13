import Ajv from 'ajv';

const ajv = new Ajv();
const readBox900 = {
  schemaId: 'read-box-9.0.0',
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
const purses900 = {
  schemaId: 'purses-9.0.0',
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
  ['9.0.0']: {
    readBox: readBox900,
    purses: purses900,
  },
};
