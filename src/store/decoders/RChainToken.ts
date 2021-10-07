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
  type: 'object',
  patternProperties: {
    ".{1,}": {
      type: 'object',
      properties: {
        id: { type: 'string' },
        boxId: { type: 'string' },
        quantity: { type: 'number' },
        timestamp: { type: 'number' },
        price: { type: 'number', nullable: true },
      },
      required: ['id', 'quantity', 'boxId', 'timestamp'],
    }
  }
};

const contractConfig1201 = {
  schemaId: 'contract-config-12.0.1',
  type: 'object',
  properties: {
    contractId: { type: 'string' },
    counter: { type: 'number' },
    fungible: { type: 'boolean' },
    locked: { type: 'boolean' },
    version: { type: 'string' },
    fee: {
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }],
    },
    expires: { type: 'number', nullable: true },
  },
  required: ['contractId', 'counter', 'fungible', 'locked', 'version'],
};

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

interface RChainTokenTypes {
  readBox: object,
  purses: object,
  contractConfig: object,
}

export const LATEST_PROTOCOL_VERSION = '12.0.1';

export const rchainTokenValidators: { [k: string]: RChainTokenTypes } = {
  ['12.0.1']: {
    readBox: readBox1201,
    purses: purses1201,
    contractConfig: contractConfig1201,
  },
};
