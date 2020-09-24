import { SplitSearch } from '../models';

export const splitSearch = (address: string): SplitSearch => {
  const split = address.split('/');
  const chainId = split[0];
  let search = split.slice(1).join('/');

  let path = '';
  const ioSlash = search.indexOf('/');
  const ioInt = search.indexOf('?');

  if (ioSlash !== -1 && (ioInt === -1 || ioInt > ioSlash)) {
    path = search.slice(ioSlash);
    search = search.slice(0, ioSlash);
  } else if (ioInt !== -1 && (ioSlash === -1 || ioSlash > ioInt)) {
    path = search.slice(ioInt);
    search = search.slice(0, ioInt);
  }

  return {
    chainId: chainId,
    search: search,
    path: path,
  };
};
