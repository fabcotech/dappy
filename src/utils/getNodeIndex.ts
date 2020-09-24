import { BlockchainNode } from '../models';

export const getNodeIndex = (node: BlockchainNode) => {
  return `${node.ip}---${node.host}`;
};
