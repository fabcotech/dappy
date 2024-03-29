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
