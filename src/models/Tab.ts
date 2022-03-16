export interface Tab {
  id: string;
  resourceId: string; // resource can be a Dapp file (.dpy) or a regular file to download
  /*
    The address in the format bbb/ccc or chainId/name
    ex: betanetwork/amazon or betanetork/amazon/house?article=121212
    It can also include any amount of path + query arguments at the end
  */
  url: string;
  img?: string;
  title: string;
  active: boolean;
  muted: boolean;
  index: number; // Index from top to bottom
  counter: number; // Incremented for each new tentative of navigation
}
