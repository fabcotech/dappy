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
  setTabFavoriteAction,
  setTabMutedAction,
  stopTabAction,
  unfocusAllTabsAction,
} from '/store/dapps';
import { getDomainWallets } from '/utils/wallets';

const mapToPages = (tabs: Tab[]) => {
  return tabs.map((tab) => ({
    id: tab.id,
    title: tab.title,
    url: tab.url,
    image: tab.img,
    favorite: tab.favorite,
  }));
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
    stopTab: (tabId: string) => dispatch(stopTabAction({ tabId })),
    unfocusAllTabs: () => dispatch(unfocusAllTabsAction()),
    onSetFavoriteTab: (tabId: string, favorite: boolean) => {
      dispatch(
        setTabFavoriteAction({
          tabId,
          favorite,
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
    const domain = new URL(page.url).hostname;
    if (!groups[domain]) {
      groups[domain] = {
        name: domain,
        image: page.image,
        pages: [],
      };
    }
    groups[domain].pages.push(page);
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
  onSetFavoriteTab,
}: AppCardConnectorProps) => {
  const api: Api = {
    openOrFocusPage: (page: Page) => {
      if (!transitoryStates[page.id]) {
        loadResource(page.url, page.id);
      } else {
        focusTab(page.id);
      }
    },
    getPages: () => pages,
    deletePage: (page: Page) => removeTab(page.id),
    toggleFavorite: (page: Page) => {
      onSetFavoriteTab(page.id, !page.favorite);
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
