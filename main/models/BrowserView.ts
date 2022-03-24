import { BrowserView } from 'electron';

export interface DappyBrowserView {
  tabId: string;
  title: string;
  visible: boolean;
  browserView: BrowserView;
  host: string;
}
