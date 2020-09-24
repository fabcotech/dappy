import { LoadCompleted, LoadErrorWithArgs } from './Dapp';

export interface RecordFromNetwork {
  name: string;
  publicKey: string;
  address?: string;
  expiration?: string;
  locked?: boolean;
  servers?: IPServer[];
  badges: { [key: string]: string };
  nonce: string;
  signature?: string;
}

export interface Record extends RecordFromNetwork {
  loadedAt: string;
  origin: 'blockchain' | 'user';
}

export interface LoadRecordsSuccess {
  date: string;
  time: number;
  nodesReached: string[];
  nodesNotReached: string[];
  recordsNumber: number;
}

export interface LoadRecordsError {
  chainId: string;
  date: string;
  time: number;
  loadState: LoadCompleted;
  error: LoadErrorWithArgs;
}

export interface PartialRecord {
  name: string;
  address?: string | undefined;
  servers?: IPServer[] | undefined;
  badges?: { [key: string]: string };
}

export interface IPServer {
  ip: string;
  host: string;
  cert: string;
  primary: boolean;
}
