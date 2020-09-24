import { LoadCompleted, LoadErrors } from './Dapp';

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
  | 'vuex@3.1.1';

export type CssLibraries = 'bulma@0.x' | 'semantic-ui@2.x' | 'bootstrap@4.x';

export interface HeadTag {
  tagname: string;
  attribs: { [key: string]: string };
  innerText?: string;
}

export interface ParsedHtmlAndTags {
  errors: string[];
  warnings: string[];
  body: undefined | string;
  headTags: HeadTag[];
  lang: string | undefined;
}

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

export interface DappManifestFromNetwork {
  title: string;
  description: string;
  author: string;
  img?: string;
  version: string;
  // TODO remove html ?
  html: string;
}

export interface DappManifest extends DappManifestFromNetwork {
  id: string;
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
}

export interface DappManifestWithLoadState extends DappManifest {
  loadState: {
    completed: LoadCompleted;
    errors: LoadErrors;
    pending: string[];
  };
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
