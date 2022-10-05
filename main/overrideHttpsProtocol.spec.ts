import { parseUrl } from './overrideHttpsProtocol';

describe('override http protocols', () => {
  it('parseUrl', () => {
    expect(parseUrl('https://domain/path/foo/bar').host).toEqual('domain');
    expect(parseUrl('https://domain/path/foo/bar').path).toEqual('/path/foo/bar');
    expect(parseUrl('https://domain').host).toEqual('domain');
    expect(parseUrl('https://domain').path).toBeUndefined();
    expect(parseUrl('azerty').host).toBeUndefined();
  });
});
