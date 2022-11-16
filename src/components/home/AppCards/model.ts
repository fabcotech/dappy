export interface Page {
  id: string;
  title?: string;
  description?: string;
  url: string;
  domain: string;
  image?: string;
  favorite: boolean;
  active: boolean;
}

export interface App {
  name: string;
  pages: Page[];
  image?: string;
}

export interface Wallet {
  platform: 'rchain' | 'evm' | 'certificate' | 'ledger' | 'metamask';
  name: string;
  whitelist: { host: string }[];
}
