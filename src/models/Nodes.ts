import { BeesLoadCompleted, BeesLoadErrorWithArgs } from '@fabcotech/bees';

export interface NodeFromNetwork {
  ip: string;
  host: string;
  name: string;
  location: string;
  contact: string;
  cert: string;
}
