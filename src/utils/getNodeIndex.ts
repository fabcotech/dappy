import { BlockchainNode } from '/models';

export const getNodeIndex = (node: Partial<BlockchainNode>) => {
  return `${node.ip}---${node.host}`;
};
