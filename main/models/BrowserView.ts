import { BrowserView } from 'electron';

import { Record } from '../../src/models';

export interface DappyBrowserView {
  visible: boolean;
  resourceId: string;
  dappyDomain: string;
  path: string;
  tabId: string;
  record: Record;
  browserView: BrowserView;
  // file://dapp-sandboxed for dapps, https://... for IP apps
  currentUrl: string;
  title: string;
  devMode: boolean;
  search: string;
  // undefined for ip apps | string for dapps
  html: undefined | string;
}
