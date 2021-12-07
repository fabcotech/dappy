import { BeesLoadCompleted, BeesLoadErrorWithArgs } from 'beesjs';

export interface RecordFromNetwork {
  id: string;
  boxId: string;
  price: undefined | number;
  expires: undefined | number;
  publicKey: string;

  data: {
    email?: string;
    address?: string;
    csp?: string;
    expiration?: string;
    servers?: IPServer[];
    badges: { [key: string]: string };
  };
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
  id: string;
  boxId: string;
  address?: string | undefined;
  email?: string | undefined;
  csp?: string | undefined;
  servers?: IPServer[] | undefined;
  badges?: { [key: string]: string };
}

export interface IPServer {
  ip: string;
  host: string;
  cert?: string;
  primary: boolean;
}
