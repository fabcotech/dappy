import { BrowserView } from 'electron';
import { EvmNetworks, Tab } from '/models';

export interface DappyBrowserView {
  tabId: string;
  title: string;
  visible: boolean;
  browserView: BrowserView;
  host: string;
  connections: { [accountId: string]: { chainId: keyof EvmNetworks } };
  data: Tab['data'];
}
