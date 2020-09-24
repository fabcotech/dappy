import { LoadErrors, LoadCompleted } from './Dapp';

export interface LoadedFile {
  id: string;
  search: string;
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
    completed: LoadCompleted;
    errors: LoadErrors;
    pending: string[];
  };
}
