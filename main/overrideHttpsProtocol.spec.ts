import { parseUrl, isCookieDomainSentWithHost } from './overrideHttpsProtocol';

describe('override http protocols', () => {
  it('parseUrl', () => {
    expect(parseUrl('https://domain/path/foo/bar').host).toEqual('domain');
    expect(parseUrl('https://domain/path/foo/bar').path).toEqual('/path/foo/bar');
    expect(parseUrl('https://domain').host).toEqual('domain');
    expect(parseUrl('https://domain').path).toBeUndefined();
    expect(parseUrl('azerty').host).toBeUndefined();
  });
});

describe('isCookieDomainSentWithHost', () => {
  it('should not send cookie with host', () => {
    expect(isCookieDomainSentWithHost('example.com', 'eexample.com')).toEqual(false);
    expect(isCookieDomainSentWithHost('.example.com', 'eexample.com')).toEqual(false);
    expect(isCookieDomainSentWithHost('pro.example.com', 'eexample.com')).toEqual(false);
    expect(isCookieDomainSentWithHost('hey.pro.example.com', 'eexample.com')).toEqual(false);
    expect(isCookieDomainSentWithHost('pro.example.com', 'example.com')).toEqual(false);
    expect(isCookieDomainSentWithHost('', 'example.com')).toEqual(false);
    expect(isCookieDomainSentWithHost('jiojiojio', 'example.com')).toEqual(false);
    expect(isCookieDomainSentWithHost('com', 'example.com')).toEqual(false);
    expect(isCookieDomainSentWithHost('.com', 'example.com')).toEqual(false);
    expect(isCookieDomainSentWithHost('tech', 'hello.dappy.com')).toEqual(false);
    expect(isCookieDomainSentWithHost('dappy', 'hello.dappy')).toEqual(false);
  });

  it('should send cookie with host', () => {
    expect(isCookieDomainSentWithHost('example.com', 'example.com')).toEqual(true);
    expect(isCookieDomainSentWithHost('.example.com', 'example.com')).toEqual(true);
    expect(isCookieDomainSentWithHost('.example.com', 'pro.example.com')).toEqual(true);
    expect(isCookieDomainSentWithHost('.example.com', 'hey.pro.example.com')).toEqual(true);
    expect(isCookieDomainSentWithHost('example.com', 'hey.pro.example.com')).toEqual(true);
    expect(isCookieDomainSentWithHost('pro.hi.dappy', 'pro.hi.dappy')).toEqual(true);
    expect(isCookieDomainSentWithHost('pro.hi.dappy', 'hey.pro.hi.dappy')).toEqual(true);
  });
});
