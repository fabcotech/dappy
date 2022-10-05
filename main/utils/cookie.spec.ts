import { Cookie } from 'electron';
import { isCookieDomainSentWithHost, getCookiesHeader } from './cookie';

describe('getCookiesHeader', () => {
  const c1: Cookie = {
    domain: 'dappy.gamma',
    name: 'c1',
    value: 'value1',
    sameSite: 'strict',
  };
  const c2: Cookie = {
    domain: 'default.dappy.gamma',
    name: 'c2',
    value: 'value2',
    sameSite: 'lax',
  };
  const c3: Cookie = {
    domain: 'dappy.gamma',
    name: 'c3',
    value: 'value3',
    sameSite: 'lax',
  };
  it('[first request] lax + same host', () => {
    expect(getCookiesHeader([c1, c2], true, 'dappy.gamma')).toEqual({
      cookieHeader: '',
      numberOfCookies: {
        lax: 0,
        strict: 0,
      },
    });
  });
  it('[first request] lax + same host (2)', () => {
    expect(getCookiesHeader([c1, c3], true, 'dappy.gamma')).toEqual({
      cookieHeader: 'c3=value3',
      numberOfCookies: {
        lax: 1,
        strict: 0,
      },
    });
  });
  it('[nth request] lax + strict + same host (1)', () => {
    expect(getCookiesHeader([c1, c2, c3], false, 'dappy.gamma')).toEqual({
      cookieHeader: 'c1=value1; c3=value3',
      numberOfCookies: {
        lax: 1,
        strict: 1,
      },
    });
  });
  it('[nth request] lax + strict + same host (2)', () => {
    expect(getCookiesHeader([c1, c2, c3], false, 'default.dappy.gamma')).toEqual({
      cookieHeader: 'c1=value1; c2=value2; c3=value3',
      numberOfCookies: {
        lax: 2,
        strict: 1,
      },
    });
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
    expect(isCookieDomainSentWithHost('tech', 'hello.d.com')).toEqual(false);
    expect(isCookieDomainSentWithHost('dappy', 'hello.d')).toEqual(false);
  });

  it('should send cookie with host', () => {
    expect(isCookieDomainSentWithHost('example.com', 'example.com')).toEqual(true);
    expect(isCookieDomainSentWithHost('.example.com', 'example.com')).toEqual(true);
    expect(isCookieDomainSentWithHost('.example.com', 'pro.example.com')).toEqual(true);
    expect(isCookieDomainSentWithHost('.example.com', 'hey.pro.example.com')).toEqual(true);
    expect(isCookieDomainSentWithHost('example.com', 'hey.pro.example.com')).toEqual(true);
    expect(isCookieDomainSentWithHost('pro.hi.d', 'pro.hi.d')).toEqual(true);
    expect(isCookieDomainSentWithHost('pro.hi.d', 'hey.pro.hi.d')).toEqual(true);
  });
});
