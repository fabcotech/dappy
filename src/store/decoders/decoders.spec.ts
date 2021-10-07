import Ajv from 'ajv';

import { rchainTokenValidators, LATEST_PROTOCOL_VERSION } from './RChainToken';

describe('decoders', () => {
  it('should decode ContractConfig', () => {
    const ajv = new Ajv();
    const validator = ajv.compile(rchainTokenValidators[LATEST_PROTOCOL_VERSION].contractConfig);

    const contractConfig = {
      contractId: "contract 1",
      counter: 1,
      fungible: true,
      locked: true,
      version: '1.2.3',
      fee: ['foo', 1],
    };

    validator(contractConfig);
    expect(validator.errors).toBe(null);
  });
  it('should decode Purses', () => {
    const ajv = new Ajv();
    const validator = ajv.compile(rchainTokenValidators[LATEST_PROTOCOL_VERSION].purses);

    const purses = {
      1: {
        id: "foo",
        boxId: "foo",
        quantity: 1,
        timestamp: 1,
        price: 1
      },
      "aaa": {
        id: "foo",
        boxId: "foo",
        quantity: 1,
        timestamp: 1,
        price: 1
      },
    };

    validator(purses);
    expect(validator.errors).toBe(null);
  });
});
