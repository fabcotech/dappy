import { IPServer } from './Record';

export interface IpApp {
  id: string;
  tabId: string;
  // the aaa part of aaa/bbb
  // newtork ID / chain ID (only "betanetwork" is possible now)
  chainId: string;
  // the bbb part of aaa/bbb (ex: "amazon", "google")
  search: string;
  // everything after bbb ex: "?arg=true" or "/page/1"
  path: string;
  url: undefined | string;
  publicKey: string;
  name: string;
  servers: IPServer[];
  randomId: string;
  launchedAt: undefined | string;
}
