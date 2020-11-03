export interface LoadCompletedData {
  nodeUrls: string[];
  data: string;
  stringToCompare: string | undefined;
}

export interface LoadCompleted {
  [id: string]: LoadCompletedData;
}

export interface LoadErrors {
  [nodeUrl: string]: {
    nodeUrl: string;
    status?: number;
  };
}

export interface LastLoadError {
  search: string;
  error: LoadErrorWithArgs;
}

export enum LoadError {
  // request
  IncompleteAddress = 'The address is incomplete',
  ChainNotFound = 'Blockchain not found',
  MissingBlockchainData = 'Missing data from the blockchain',
  RecordNotFound = 'Record not found',

  // not found
  ResourceNotFound = 'Contract not found',

  // server error
  ServerError = 'Server error',

  // resolver
  InsufficientNumberOfNodes = 'Insufficient number of nodes',
  OutOfNodes = 'Out of nodes',
  UnstableState = 'Unstable state',
  UnaccurateState = 'Unaccurate state',

  // parsing
  FailedToParseResponse = 'Failed to parse response',
  InvalidManifest = 'Invalid manifest', // for dappy manifests
  InvalidSignature = 'Invalid signature',
  InvalidRecords = 'Invalid records', // for records
  InvalidNodes = 'Invalid nodes', // for nodes
}

export interface LoadErrorWithArgs {
  error: LoadError;
  args: { [key: string]: any };
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
  pushFileTerm?: string;
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
  randomId: string;
  // the aaa part of aaa/bbb
  // newtork ID / chain ID (only "betanetwork" is possible now)
  chainId: string;
  // the bbb part of aaa/bbb (ex: "amazon", "google")
  search: string;
  // everything after bbb ex: "?arg=true" or "/page/1"
  path: string;
  resourceId: string;
  origin: 'network' | 'file';
  publicKey: undefined | string;
  loadState: {
    completed: LoadCompleted;
    errors: LoadErrors;
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
