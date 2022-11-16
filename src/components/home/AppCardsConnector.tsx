import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { State as StoreState } from '/store';
import * as fromUi from '/store/ui';
import { Tab } from '/models';
import { AppCards, Api, ApiContext, App, Page, Wallet } from './AppCards';
import { getAccounts } from '/store/settings';
import {
  focusTabAction,
  getDappsTransitoryStates,
  getTabs,
  getTabsFocusOrder,
  loadResourceAction,
  removeTabAction,
  createFavAction,
  setTabMutedAction,
  unfocusAllTabsAction,
} from '/store/dapps';
import { getDomainWallets } from '/utils/wallets';
import { generateNonce } from '/utils/generateNonce';

const mapToPages = (tabs: Tab[]): Page[] => {
  return tabs.map((tab) => {
    let url = tab.url || '';
    if (!url.startsWith('https://')) {
      url = `https://${url}`;
    }
    let domain = '';
    try {
      domain = new URL(tab.url).hostname;
    } catch (err) {
      console.log('could not parse URL, setting to unknown');
      console.log(err);
      domain = 'unknown';
    }
    return {
      id: tab.id,
      title: tab.title,
      url: tab.url,
      domain: domain,
      image: tab.img,
      favorite: tab.favorite,
      active: tab.active,
    };
  });
};

const connector = connect(
  (state: StoreState) => {
    return {
      transitoryStates: getDappsTransitoryStates(state),
      pages: mapToPages(getTabs(state)),
      wallets: getAccounts(state),
      tabsFocusOrder: getTabsFocusOrder(state),
      isMobile: fromUi.getIsMobile(state),
      onlyIcons: fromUi.getTabsListDisplay(state) === 3,
    };
  },
  (dispatch) => ({
    focusTab: (tabId: string) => dispatch(focusTabAction({ tabId })),
    loadResource: (address: string, tabId: string) =>
      dispatch(
        loadResourceAction({
          url: address,
          tabId,
        })
      ),
    removeTab: (tabId: string) => dispatch(removeTabAction({ tabId })),
    unfocusAllTabs: () => dispatch(unfocusAllTabsAction()),
    createFav: (page: Page) => {
      dispatch(
        createFavAction({
          fav: {
            img: page.image,
            url: page.url,
            title: page.title,
            id: generateNonce(),
          },
        })
      );
    },
    onSetMuteTab: (tabId: string, a: boolean) => {
      dispatch(
        setTabMutedAction({
          tabId,
          muted: a,
        })
      );
    },
  })
);

type AppCardConnectorProps = ConnectedProps<typeof connector>;

const groupByDomain = (pages: Page[]) => {
  const result = pages.reduce<Record<string, App>>((groups, page) => {
    if (!groups[page.domain]) {
      groups[page.domain] = {
        name: page.domain,
        image: page.image,
        pages: [],
      };
    }
    groups[page.domain].pages.push(page);
    return groups;
  }, {});
  return Object.values(result);
};

const AppCardsConnectorComponent = ({
  transitoryStates,
  pages,
  wallets,
  focusTab,
  loadResource,
  removeTab,
  createFav,
}: AppCardConnectorProps) => {
  const api: Api = {
    openOrFocusPage: (page: Page) => {
      if (page.active) {
        focusTab(page.id);
      } else {
        loadResource(page.url, page.id);
      }
    },
    getPages: () => pages,
    deletePage: (page: Page) => removeTab(page.id),
    createFav: (page: Page) => {
      createFav(page);
    },
    getWalletsByDomain: (domain: string) => getDomainWallets(wallets, { domain }),
  };

  return (
    <ApiContext.Provider value={api}>
      <AppCards groupBy={groupByDomain} />
    </ApiContext.Provider>
  );
};

export const AppCardsConnector = connector(AppCardsConnectorComponent);
