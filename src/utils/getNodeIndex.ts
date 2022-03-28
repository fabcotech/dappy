import { DappyNetworkMember } from 'dappy-lookup';

export const getNodeIndex = (node: Partial<DappyNetworkMember>) => {
  return `${node.ip}---${node.hostname}`;
};
