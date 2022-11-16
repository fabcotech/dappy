import { createContext } from 'react';

import { Page, Wallet } from './model';

const defaultApi = {
  openOrFocusPage: (page: Page) => {},
  deletePage: (page: Page) => {},
  createFav: (page: Page) => {},
  getPages: (): Page[] => [],
  getWalletsByDomain: (domain: string): Wallet[] => [],
};

export type Api = typeof defaultApi;

export const ApiContext = createContext<Api>(defaultApi);
