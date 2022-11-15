import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { State as StoreState } from '/store';
import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import { Tab } from '/models';
import { AppCards, Api, ApiContext, App, Page, Wallet } from './AppCards';

const connector = connect(
  (state: StoreState) => {
    return {
      transitoryStates: fromDapps.getDappsTransitoryStates(state),
      tabs: fromDapps.getTabs(state),
      tabsFocusOrder: fromDapps.getTabsFocusOrder(state),
      isMobile: fromUi.getIsMobile(state),
      onlyIcons: fromUi.getTabsListDisplay(state) === 3,
    };
  },
  (dispatch) => ({
    focusTab: (tabId: string) => dispatch(fromDapps.focusTabAction({ tabId })),
    loadResource: (address: string, tabId: string) =>
      dispatch(
        fromDapps.loadResourceAction({
          url: address,
          tabId,
        })
      ),
    removeTab: (tabId: string) => dispatch(fromDapps.removeTabAction({ tabId })),
    stopTab: (tabId: string) => dispatch(fromDapps.stopTabAction({ tabId })),
    unfocusAllTabs: () => dispatch(fromDapps.unfocusAllTabsAction()),
    onSetFavoriteTab: (tabId: string, favorite: boolean) => {
      dispatch(
        fromDapps.setTabFavoriteAction({
          tabId,
          favorite,
        })
      );
    },
    onSetMuteTab: (tabId: string, a: boolean) => {
      dispatch(
        fromDapps.setTabMutedAction({
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

const mapToPages = (tabs: Tab[]) => {
  return tabs.map((tab) => ({
    id: tab.id,
    title: tab.title,
    url: tab.url,
    image: tab.img,
    favorite: tab.favorite,
  }));
};

const AppCardsConnectorComponent = ({
  transitoryStates,
  tabs,
  focusTab,
  loadResource,
  removeTab,
  onSetFavoriteTab,
}: AppCardConnectorProps) => {
  const [pages, setPages] = useState<Page[]>(mapToPages(tabs));

  useEffect(() => setPages(mapToPages(tabs)), [tabs]);

  const [wallets] = useState<Wallet[]>([]);

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
    getWallets: () => wallets,
  };

  return (
    <ApiContext.Provider value={api}>
      <AppCards groupBy={groupByDomain} />
    </ApiContext.Provider>
  );
};

export const AppCardsConnector = connector(AppCardsConnectorComponent);
