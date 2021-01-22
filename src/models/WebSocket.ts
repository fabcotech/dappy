import { LoadCompleted, LoadErrors } from 'beesjs';

import { ResolverMode } from './Settings';
import { LoadErrorWithArgs } from './Dapp';

export interface MultiCallParameters {
  chainId: string;
  urls: string[];
  resolverMode: ResolverMode;
  resolverAccuracy: number;
  resolverAbsolute: number;
  multiCallId: string;
  comparer?: (a: any) => void;
}

export interface MultiCallBody {
  [key: string]: any;
}

export interface MultiCallResult {
  result: {
    data: any;
    nodeUrlsLength: number;
  };
  loadState: LoadCompleted;
  loadErrors: LoadErrors;
}

export interface MultiCallError {
  error: LoadErrorWithArgs;
  loadState: LoadCompleted;
}
