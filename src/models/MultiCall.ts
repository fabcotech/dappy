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

export interface MultiRequestResult {
  result: any;
  loadState: BeesLoadCompleted;
  loadErrors: BeesLoadErrors;
}

export interface MultiRequestError {
  error: BeesLoadErrorWithArgs;
  loadState: BeesLoadCompleted;
}

export interface SingleRequestResult {
  success: boolean;
  error?: { message: string };
  data?: any;
}
