import { createContext } from 'react';

import { Page, Wallet } from './model';

const defaultApi = {
  openOrFocusPage: (page: Page) => {},
  deletePage: (page: Page) => {},
  toggleFavorite: (pagz: Page) => {},
  getPages: (): Page[] => [],
  getWallets: (): Wallet[] => [],
};

export type Api = typeof defaultApi;

export const ApiContext = createContext<Api>(defaultApi);
