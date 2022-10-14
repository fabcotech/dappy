import { getRendererParams } from './rendererParams';

describe('rendererParams', () => {
  it('should returns nothing when no arguments', () => {
    expect(getRendererParams([])).toBe('');
  });
  it('should throw unknown argument', () => {
    expect(() => getRendererParams(['invalid'])).toThrowError('Invalid argument invalid');
  });
  it('should not throw on unknown argument', () => {
    expect(() => getRendererParams(['--unknown=unknown'])).not.toThrowError();
  });
  it('--network: should throw unknown network', () => {
    expect(() => getRendererParams(['--network=unknown'])).toThrowError();
  });
  it('--network: should parse known network', () => {
    expect(getRendererParams(['--network=gamma'])).toBe('?network=gamma');
  });
});
