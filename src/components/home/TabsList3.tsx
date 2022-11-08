import React, { useState } from 'react';
import { connect } from 'react-redux';

import { State as StoreState } from '/store';
import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import { TransitoryState, Tab } from '/models';
import './TabsList3.scss';
import { AppCards } from './AppCards';
import { Api, ApiContext } from './AppCards/Api';
import { App, Page, Wallet } from './AppCards/model';

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

interface TabsList2Props {
  tabs: Tab[];
  tabsFocusOrder: string[];
  transitoryStates: { [dappId: string]: TransitoryState };
  isMobile: undefined | boolean;
  onlyIcons: boolean;
  focusTab: (tabId: string) => void;
  loadResource: (address: string, tabId: string) => void;
  removeTab: (tabId: string) => void;
  stopTab: (tabId: string) => void;
  onSetMuteTab: (tabId: string, a: boolean) => void;
  onSetFavoriteTab: (tabId: string, a: boolean) => void;
  unfocusAllTabs: () => void;
}

const TabsList3Component = (props: TabsList2Props) => {
  const [pages, setPages] = useState<Page[]>(
    props.tabs.map((t) => ({
      url: t.url,
      title: t.title,
      image: t.img,
      favorite: t.favorite,
    }))
  );

  const [wallets] = useState<Wallet[]>([]);

  const api: Api = {
    getPages: () => pages,
    deleteApp: (url: string) => setPages(pages.filter((p) => p.url !== url)),
    toggleFavorite: (url: string) => {
      const page = pages.find((p) => p.url === url);
      if (page) {
        page.favorite = !page.favorite;
      }
      setPages([...pages]);
    },
    getWallets: () => wallets,
  };

  const focusedTabId = props.tabsFocusOrder[props.tabsFocusOrder.length - 1];
  return (
    <ApiContext.Provider value={api}>
      <AppCards groupBy={groupByDomain} />
    </ApiContext.Provider>
    // <div className={`tabs-list-3 ${props.onlyIcons ? 'only-icons' : ''}`}>
    //   {props.tabs.map((tab) => {
    //     return (
    //       <div
    //         className={`tab ${focusedTabId === tab.id ? 'focused' : ''} ${
    //           tab.active ? 'active' : ''
    //         }`}
    //       >
    //         <div className="content">
    //           {/* todo : is this safe ? (new URL) */}
    //           <div className="host">
    //             <span>{new URL(tab.url).host}</span>
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   })}
    // </div>
  );
};

export const TabsList3 = connect(
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
    onSetFavoriteTab: (tabId: string, a: boolean) => {
      dispatch(
        fromDapps.setTabFavoriteAction({
          tabId,
          favorite: a,
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
)(TabsList3Component);
