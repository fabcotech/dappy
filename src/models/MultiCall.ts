import { BeesLoadErrors, BeesLoadCompleted, BeesLoadErrorWithArgs } from '@fabcotech/bees';
import { ResolverMode } from './Settings';

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
  loadState: BeesLoadCompleted;
  loadErrors: BeesLoadErrors;
}

export interface MultiCallError {
  error: BeesLoadErrorWithArgs;
  loadState: BeesLoadCompleted;
}

export interface SingleCallResult {
  success: boolean;
  error?: { message: string };
  data?: any;
}
