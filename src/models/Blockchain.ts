import { DappyNetworkMember } from '@fabcotech/dappy-lookup';

export interface Blockchain {
  platform: 'rchain';
  auto: boolean;
  chainId: string;
  chainName: string;
  nodes: DappyNetworkMember[];
}

export interface SplitSearch {
  search: string;
  chainId: string;
  path: string;
}
