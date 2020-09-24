import { BrowserView } from 'electron';

import { IPServer, ParsedHtmlAndTags } from '../../src/models';

export interface DappyBrowserView {
  visible: boolean;
  resourceId: string;
  address: string;
  tabId: string;
  randomId: string;
  servers: IPServer[];
  browserView: BrowserView;
  // file://dapp-sandboxed for dapps, https://... for IP apps
  currentUrl: string;
  title: string;
  devMode: boolean;
  search: string;
  // undefined for ip apps | string for dapps
  html: undefined | string;
  preload?: string;
  commEvent: any;
}
