import { DappyNetworkMember } from '@fabcotech/dappy-lookup';

export const getNodeIndex = (node: Partial<DappyNetworkMember>) => {
  return `${node.ip}---${node.hostname}`;
};
