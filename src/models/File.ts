import { BeesLoadErrors, BeesLoadCompleted } from 'beesjs';

export interface LoadedFile {
  id: string;
  url: string;
  chainId: string;
  resourceId: string;
  publicKey: undefined | string;
  data: string;
  name: string;
  mimeType: string;
  size: number;
  tabId: string | undefined;
  launchedAt: undefined | string;
  blockNumber: number;
  blockTime: string;
  loadState: {
    completed: BeesLoadCompleted;
    errors: BeesLoadErrors;
    pending: string[];
  };
}
