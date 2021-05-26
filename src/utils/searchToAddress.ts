export const searchToAddress = (search: string, chainId: string, path = '') => {
  return `${chainId}/${search}${path}`;
};
