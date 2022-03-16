export interface IpApp {
  id: string;
  tabId: string;
  /*
    chainId is undefined if DNS
    chainId is not undefined if dappy name system ("d", "gammanetwork" etc.)
  */
  chainId: string | undefined;
  url: string;
  publicKey: string;
  launchedAt: undefined | string;
}
