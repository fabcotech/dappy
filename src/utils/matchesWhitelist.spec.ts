import { matchesInWhitelist, atLeastOneMatchInWhitelist } from './matchesWhitelist';

describe('utils/matchesWhitelist', () => {
  it('Should find correct matches with empty whitelist', () => {
    expect(matchesInWhitelist([], 'uniswap.org')).toEqual([]);
    expect(atLeastOneMatchInWhitelist([], 'uuniswap.org')).toEqual(true);
  });
  it('Should find correct matches with whitelist 1', () => {
    const whitelist1 = [{ host: 'uniswap.org', topLevel: true, secondLevel: true }];
    expect(matchesInWhitelist(whitelist1, 'uniswap.org')).toEqual([whitelist1[0]]);
    expect(matchesInWhitelist(whitelist1, '*.org')).toEqual([]);
    expect(matchesInWhitelist(whitelist1, '.uniswap.org')).toEqual([]);
    expect(matchesInWhitelist(whitelist1, 'api.uniswap.org')).toEqual([]);
    expect(matchesInWhitelist(whitelist1, 'uuniswap.org')).toEqual([]);
    expect(atLeastOneMatchInWhitelist(whitelist1, 'uuniswap.org')).toEqual(false);
  });
  it('Should find correct matches with whitelist 2', () => {
    const whitelist2 = [{ host: '*.uniswap.org', topLevel: true, secondLevel: true }];
    expect(matchesInWhitelist(whitelist2, '.uniswap.org')).toEqual([]);
    expect(matchesInWhitelist(whitelist2, 'uniswap.org')).toEqual([]);
    expect(matchesInWhitelist(whitelist2, '*.org')).toEqual([]);
    expect(matchesInWhitelist(whitelist2, 'api.uniswap.org')).toEqual([whitelist2[0]]);
    expect(atLeastOneMatchInWhitelist(whitelist2, 'api.uniswap.org')).toEqual(true);
  });
  it('Should find correct matches with whitelist 3', () => {
    const whitelist3 = [{ host: '*', topLevel: true, secondLevel: true }];
    expect(matchesInWhitelist(whitelist3, 'uniswap.org')).toEqual([whitelist3[0]]);
    expect(matchesInWhitelist(whitelist3, 'api.uniswap.org')).toEqual([whitelist3[0]]);
    expect(matchesInWhitelist(whitelist3, 'dappy.d')).toEqual([whitelist3[0]]);
    expect(atLeastOneMatchInWhitelist(whitelist3, 'dappy.d')).toEqual(true);
  });
  it('Should find correct matches with whitelist 4', () => {
    const whitelist4 = [{ host: 'uniswap.org:444', topLevel: true, secondLevel: true }];
    expect(matchesInWhitelist(whitelist4, 'uniswap.org:443')).toEqual([]);
    expect(matchesInWhitelist(whitelist4, 'uniswap.org:444')).toEqual([whitelist4[0]]);
    expect(matchesInWhitelist(whitelist4, 'uniswap.org')).toEqual([]);
    expect(atLeastOneMatchInWhitelist(whitelist4, 'uniswap.org:444')).toEqual(true);
  });
});
