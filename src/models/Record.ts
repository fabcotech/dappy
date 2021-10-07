import { BeesLoadCompleted, BeesLoadErrorWithArgs } from 'beesjs';


export interface RecordFromNetwork {
  name: string;
  box: string;
  price: undefined | number;
  publicKey: string;
  address?: string;
  csp?: string;
  expiration?: string;
  servers?: IPServer[];
  badges: { [key: string]: string };
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
  loadState: BeesLoadCompleted;
  error: BeesLoadErrorWithArgs;
}

export interface PartialRecord {
  name: string;
  address?: string | undefined;
  csp?: string | undefined;
  servers?: IPServer[] | undefined;
  badges?: { [key: string]: string };
}

export interface IPServer {
  ip: string;
  host: string;
  cert: string;
  primary: boolean;
}
