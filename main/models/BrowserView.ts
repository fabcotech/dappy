import { BrowserView } from 'electron';
import { Tab } from '/models';

export interface DappyBrowserView {
  tabId: string;
  title: string;
  visible: boolean;
  browserView: BrowserView;
  host: string;
  data: Tab["data"];
}
