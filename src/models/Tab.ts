import { BeesLoadCompleted, BeesLoadErrors, BeesLoadErrorWithArgs } from '@fabcotech/bees';
import { Blockchain } from './Blockchain';
import { DappyLoadErrorWithArgs } from './DappyLoadError';

export interface LastLoadError {
  url: string;
  error: BeesLoadErrorWithArgs | DappyLoadErrorWithArgs;
}

export interface Tab {
  id: string;
  url: string;
  img?: string;
  title: string;
  active: boolean;
  favorite: boolean;
  muted: boolean;
  index: number; // Index from top to bottom
  counter: number; // Incremented for each new tentative of navigation
  // lastError is not persisted in indexeddb
  lastError: LastLoadError | undefined;
  data: {
    isIp?: boolean,
    isDappyNameSystem?: boolean,
    publicKey?: string | undefined,
    chainId?: string | undefined,
    blockchain?: Blockchain | undefined,
    rchainNamesMasterRegistryUri?: string | undefined,
    html?: string | undefined,
    loadState?: {
      completed: BeesLoadCompleted;
      errors: BeesLoadErrors;
      pending: string[];
    }
  }
}
