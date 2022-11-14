import { createContext } from 'react';

import { Page, Wallet } from './model';

const defaultApi = {
  openOrFocusPage: (page: Page) => {},
  deleteApp: (url: string) => {},
  toggleFavorite: (url: string) => {},
  getPages: (): Page[] => [],
  getWallets: (): Wallet[] => [],
};

export type Api = typeof defaultApi;

export const ApiContext = createContext<Api>(defaultApi);
