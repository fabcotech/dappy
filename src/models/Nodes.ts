import { BeesLoadCompleted, BeesLoadErrorWithArgs } from '@fabcotech/bees';

export interface NodeFromNetwork {
  ip: string;
  host: string;
  name: string;
  location: string;
  contact: string;
  cert: string;
}

/* no dns */
export interface BlockchainNode {
  ip: string;
  host: string;
  /*
    See ws doc
    CONNECTING 	0 	The connection is not yet open.
    OPEN 	1 	The connection is open and ready to communicate.
    CLOSING 	2 	The connection is in the process of closing.
    CLOSED 	3
  */
  readyState: 0 | 1 | 2 | 3;
  ssl: boolean;
  name?: string;
  location?: string;
  contact?: string;
  cert?: string;
}

export interface LoadNodesError {
  chainId: string;
  date: string;
  time: number;
  loadState: BeesLoadCompleted;
  error: BeesLoadErrorWithArgs;
}
