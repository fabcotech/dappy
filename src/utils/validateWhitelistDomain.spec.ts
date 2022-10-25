import { validateWhitelistDomain } from './validateWhitelistDomain';

describe('utils/validateWhitelistDomain', () => {
    it('should not be a valid whitelist domain', () => {
        expect(validateWhitelistDomain('d.')).toEqual(false);
        expect(validateWhitelistDomain('d.d.')).toEqual(false);
        expect(validateWhitelistDomain('.d')).toEqual(false);
        expect(validateWhitelistDomain('A.d')).toEqual(false);
        expect(validateWhitelistDomain('?.d')).toEqual(false);
    });

    it('should be a valid whitelist domain', () => {
      expect(validateWhitelistDomain('a.d')).toEqual(true);
      expect(validateWhitelistDomain('*.d')).toEqual(true);
      expect(validateWhitelistDomain('*.a.d')).toEqual(true);
      expect(validateWhitelistDomain('*.a.*')).toEqual(true);
      expect(validateWhitelistDomain('a.com')).toEqual(true);
      expect(validateWhitelistDomain('a.b.c.d.e.f.com')).toEqual(true);
  });
});
