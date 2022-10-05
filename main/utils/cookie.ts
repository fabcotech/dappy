import { Cookie } from 'electron';

export const onlyLaxCookieOnFirstRequest = (isFirstRequest: boolean, cookie: Cookie) =>
  isFirstRequest ? cookie.sameSite === 'lax' : true;

// RFC 6265
export const isCookieDomainSentWithHost = (cookieDomain: string | undefined, host: string) => {
  if (!cookieDomain) return false;

  // Try an exact match
  if (cookieDomain === host) return true;
  if (cookieDomain === `.${host}`) return true;

  // TLD cookies not sent fo 2nd/3rd/etc levels
  // do not send cookie if domain = .com or com or .d or dappy
  if (cookieDomain.startsWith('.') && (cookieDomain.match(/\./g) || []).length === 1) return false;
  if ((cookieDomain.match(/\./g) || []).length === 0) return false;

  // does host matches a sublevel of cookieDomain ?
  // turns example.com into .example.com
  const cookieDomainWithPrefix = cookieDomain.startsWith('.') ? cookieDomain : `.${cookieDomain}`;

  // do sent cookies if cookieDomain = example.com and host = api.example.com
  if (host.endsWith(cookieDomainWithPrefix)) return true;

  // do not sent cookies if:
  // cookieDomain = api.example.com and host = example.com
  // cookieDomain = api.example.com and host = pro.example.com
  // cookieDomain = eeexample.com and host = example.com
  return false;
};

export const getCookiesHeader = (cookies: Electron.Cookie[], isFirstRequest: boolean, host: string) => {
  const okCookies = cookies
    .filter((c) => {
      return isCookieDomainSentWithHost(c.domain, host);
    })
    .filter((c) => onlyLaxCookieOnFirstRequest(isFirstRequest, c));

  return {
    cookieHeader: okCookies.map((c) => `${c.name}=${c.value}`).join('; '),
    numberOfCookies: {
      lax: okCookies.filter((c) => c.sameSite === 'lax').length,
      strict: okCookies.filter((c) => c.sameSite === 'strict').length,
    },
  };
};
