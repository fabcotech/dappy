import { BeesLoadCompleted, BeesLoadErrors } from '@fabcotech/bees';
import { Blockchain } from './Blockchain';
import { SimpleError } from './DappyLoadError';

export interface LastLoadError {
  url: string;
  error: SimpleError;
}

export interface Tab {
  id: string;
  url: string;
  img?: string;
  title: string;
  active: boolean;
  favorite: boolean;
  canGoForward?: boolean;
  canGoBackward?: boolean;
  muted: boolean;
  index: number; // Index from top to bottom
  counter: number; // Incremented for each new tentative of navigation
  // lastError is not persisted in indexeddb
  lastError: LastLoadError | undefined;
  data: {
    isIp?: boolean;
    isDappyNameSystem?: boolean;
    publicKey?: string | undefined;
    chainId?: string | undefined;
    blockchain?: Blockchain | undefined;
    rchainNamesMasterRegistryUri?: string | undefined;
    html?: string | undefined;
    loadState?: {
      completed: BeesLoadCompleted;
      errors: BeesLoadErrors;
      pending: string[];
    };
  };
}
