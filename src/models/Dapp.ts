import { BeesLoadErrors, BeesLoadCompleted, BeesLoadErrorWithArgs } from 'beesjs';

import { Record } from './Record';

export interface LoadCompletedData {
  nodeUrls: string[];
  data: string;
  stringToCompare: string | undefined;
}

export interface LastLoadError {
  search: string;
  error: BeesLoadErrorWithArgs;
}

export type JsLibraries =
  | 'jquery@1.9.1'
  | 'jquery@2.2.4'
  | 'jquery@3.3.1'
  | 'react@16.9.0'
  | 'react-dom@16.9.0'
  | 'redux@4.0.4'
  | 'react-redux@7.1.1'
  | 'bootstrap@4.3.1'
  | 'semantic-ui@2.4.1'
  | 'vue@2.6.10'
  | 'vuex@3.1.1'
  | 'pako@1.0.11';

export type CssLibraries = 'bulma@0.x' | 'semantic-ui@2.x' | 'bootstrap@4.x';

export interface PredefinedDapp {
  img: string;
  description: string;
  cssLibraries: CssLibraries[];
  jsLibraries: JsLibraries[];
  js: string;
  css: string;
  html: string;
}

export interface DappFromNetwork {
  title: string;
  description: string;
  author: string;
  img?: string;
  version: string;
  // TODO remove html ?
  html: string;
}

export interface Dapp extends DappFromNetwork {
  id: string;
  tabId: string | undefined;
  record: Record;
  // the aaa part of aaa:bbb
  // newtork ID / chain ID (ex: "d" / "gammanetwork" etc)
  chainId: string;
  // the bbb part of aaa/bbb (ex: "amazon", "google")
  search: string;
  // everything after bbb ex: "?arg=true" or "/page/1"
  path: string;
  resourceId: string;
  origin: 'network' | 'file';
  publicKey: undefined | string;
  loadState: {
    completed: BeesLoadCompleted;
    errors: BeesLoadErrors;
    pending: string[];
  };
  launchedAt: undefined | string;
}

export interface Variable {
  match: string;
  name: string;
  default: string;
  value: string;
}

export interface Variables {
  js: Variable[];
  css: Variable[];
  html: Variable[];
}
