import { toHex } from './toHex';

describe('toHex', () => {
  it('should generate correct hexas from chain IDs (ex: "1" -> "0x1)"', () => {
    expect(toHex('1')).toEqual('0x1');
    expect(toHex('1')).toEqual('0x1');
    expect(toHex('3')).toEqual('0x3');
    expect(toHex('4')).toEqual('0x4');
    expect(toHex('5')).toEqual('0x5');
    expect(toHex('137')).toEqual('0x89');
    expect(toHex('137')).toEqual('0x89');
  });
});
