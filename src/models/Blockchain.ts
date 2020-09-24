import { BlockchainNode } from './Nodes';

export interface Blockchain {
  platform: 'rchain';
  chainId: string;
  chainName: string;
  nodes: BlockchainNode[];
}

export interface Benchmark {
  id: string;
  chainId: string;
  ip: string;
  date: string;
  responseTime: number;
  info: {
    dappyNodeVersion: string;
    rnodeVersion: string;
  };
}

export interface SplitSearch {
  search: string;
  chainId: string;
  path: string;
}
