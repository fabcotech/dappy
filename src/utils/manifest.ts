import { Variable } from '../models';

export const manifest = {
  getMatchesInAssets: (str = '') => {
    return (str.match(/(\$\$\{)([A-Za-z0-9_;]*)(\})/g) || []).map(
      (m): Variable => {
        const s = m.slice(2, m.length - 1).split(';');
        return {
          match: m,
          name: s[0],
          default: s[1],
          value: '',
        };
      }
    );
  },
};
