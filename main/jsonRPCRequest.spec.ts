import { chainsByHex, getHostAndPath, getRPCUrl } from './jsonRPCRequest';

describe('jsonRPCRequest', () => {
  it('getHostAndPath', () => {
    expect(
      getHostAndPath('https://eth-mainnet.alchemyapi.io/v2/hVcflvG3Hp3ufTgyfj-s9govLX5OYluf')
    ).toStrictEqual({
      hostname: 'eth-mainnet.alchemyapi.io',
      path: '/v2/hVcflvG3Hp3ufTgyfj-s9govLX5OYluf',
    });
  });
  it('chainsByHex', () => {
    expect(chainsByHex['0x1']).toBeDefined();
  });
  it('getRPCUrl', () => {
    const r = getRPCUrl('0x1');
    expect(r.hostname).toBeDefined();
    expect(r.path).toBeDefined();
  });
});
