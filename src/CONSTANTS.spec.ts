import { parseWhitelist } from './CONSTANTS';

describe('CONSTANTS', () => {
  it('parseWhitelist', () => {
    expect(parseWhitelist('')).toStrictEqual(undefined);
    expect(parseWhitelist(undefined)).toBe(undefined);
    expect(parseWhitelist('app.uniswap.org; trade.dydx.exchange')).toEqual([
      {
        host: 'app.uniswap.org',

        topLevel: true,
        secondLevel: true,
      },
      {
        host: 'trade.dydx.exchange',
        topLevel: true,
        secondLevel: true,
      },
    ]);
    expect(parseWhitelist('app.uniswap.org; ;')).toEqual([
      {
        host: 'app.uniswap.org',
        topLevel: true,
        secondLevel: true,
      },
    ]);
  });
});
