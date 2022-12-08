export const matchesInWhitelist = (
  whitelist: { [key: string]: boolean | string }[],
  hostnameToMatch: string
) => {
  const partsHostnameToMatch = hostnameToMatch.split('.').reverse();
  const foundHosts = whitelist.filter((wl) => {
    let everyPartMatch = true;
    const parts = (wl.host as string).split('.').reverse();
    if (parts.length === 1 && parts[0] === '*') return true;
    if (parts.length !== partsHostnameToMatch.length) return false;

    parts.forEach((p: string, i: number) => {
      if (!partsHostnameToMatch[i] || partsHostnameToMatch[i].length === 0) {
        everyPartMatch = false;
      }
      if (parts[i] !== '*' && parts[i] !== partsHostnameToMatch[i]) {
        everyPartMatch = false;
      }
    });

    return everyPartMatch;
  });

  return foundHosts;
};

export const atLeastOneMatchInWhitelist = (
  whitelist: { [key: string]: boolean | string }[],
  hostnameToMatch: string
) => {
  if (whitelist.length === 0) {
    return true;
  }
  return matchesInWhitelist(whitelist, hostnameToMatch).length > 0;
};
