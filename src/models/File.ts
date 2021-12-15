import { BeesLoadErrors, BeesLoadCompleted } from 'beesjs';

import { Record } from './Record';

export interface LoadedFile {
  id: string;
  search: string;
  chainId: string;
  resourceId: string;
  publicKey: undefined | string;
  data: string;
  name: string;
  record: Record,
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
