import { BeesLoadErrors, BeesLoadCompleted, BeesLoadErrorWithArgs } from '@fabcotech/bees';
import { DappyLoadError, DappyLoadErrorWithArgs } from './DappyLoadError';
import { ResolverMode } from './Settings';

export interface MultiRequestParameters {
  chainId: string;
  urls: string[];
  resolverMode: ResolverMode;
  resolverAccuracy: number;
  resolverAbsolute: number;
  multiCallId: string;
  comparer?: (a: any) => void;
}

export interface MultiRequestBody {
  [key: string]: any;
}

export interface MultiRequestResult {
  result: any;
  loadState: BeesLoadCompleted;
  loadErrors: BeesLoadErrors;
}

export interface MultiRequestError {
  error: BeesLoadErrorWithArgs | DappyLoadErrorWithArgs;
  loadState: BeesLoadCompleted;
}

export interface SingleRequestResult {
  success: boolean;
  error?: { message: string };
  data?: any;
}
