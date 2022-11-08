export interface Page {
  title?: string;
  description?: string;
  url: string;
  image?: string;
  favorite: boolean;
}

export interface App {
  name: string;
  pages: Page[];
  image?: string;
}

export interface Wallet {
  platform: 'ledger' | 'metamask';
  name: string;
  whitelist: { host: string }[];
}
