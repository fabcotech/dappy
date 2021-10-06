import * as React from 'react';
import { connect } from 'react-redux';

import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import { blockchain as blockchainUtils } from '/utils/';
import { Dapp, TransitoryState, Tab } from '/models';
import { TabListItem } from '.';
import './TabsList.scss';

interface TabsListProps {
  dapps: { [id: string]: Dapp };
  tabs: Tab[];
  tabsFocusOrder: string[];
  transitoryStates: { [dappId: string]: TransitoryState };
  isMobile: undefined | boolean;
  isSearchFocused: boolean;
  onlyIcons: boolean;
  focusTab: (tabId: string) => void;
  loadResource: (address: string, tabId: string) => void;
  removeTab: (tabId: string) => void;
  stopTab: (tabId: string) => void;
  onSetMuteResource: (tabId: string, a: boolean) => void;
  focusSearchDapp: () => void;
}

class TabsListComponent extends React.Component<TabsListProps, {}> {
  state = {};

  render() {
    return (
      <div
        className={`tabs-list ${this.props.onlyIcons ? 'only-icons' : ''} ${this.props.isMobile ? 'is-mobile' : ''}`}>
        {this.props.tabs.map((tab) => {
          const dapp = this.props.dapps[tab.resourceId];
          const focusedTabId = this.props.tabsFocusOrder[this.props.tabsFocusOrder.length - 1];
          return (
            <TabListItem
              key={tab.id}
              dapp={dapp}
              tab={tab}
              launchedAt={dapp ? dapp.launchedAt : undefined}
              transitoryState={this.props.transitoryStates[tab.resourceId]}
              focused={!this.props.isSearchFocused && focusedTabId === tab.id}
              onlyIcons={this.props.onlyIcons}
              focusTab={this.props.focusTab}
              loadResource={this.props.loadResource}
              removeTab={this.props.removeTab}
              stopTab={this.props.stopTab}
              onSetMuteResource={this.props.onSetMuteResource}
            />
          );
        })}
        {this.props.onlyIcons ? (
          <div
            className={`search-dapps-small ${this.props.isSearchFocused ? 'active' : ''}`}
            onClick={this.props.focusSearchDapp}>
            <i className="fa fa-plus fa-after" />
          </div>
        ) : (
          <div
            className={`search-dapps ${this.props.isSearchFocused ? 'active' : ''}`}
            onClick={this.props.focusSearchDapp}>
            {t('search dapps')}&nbsp;
            <i className="fa fa-plus fa-after" />
          </div>
        )}
      </div>
    );
  }
}

export const TabsList = connect(
  (state) => {
    return {
      transitoryStates: fromDapps.getDappsTransitoryStates(state),
      tabs: fromDapps.getTabs(state),
      tabsFocusOrder: fromDapps.getTabsFocusOrderWithoutSearch(state),
      dapps: fromDapps.getDapps(state),
      isMobile: fromUi.getIsMobile(state),
      isSearchFocused: fromDapps.getIsSearchFocused(state),
      onlyIcons: fromUi.getDappsListDisplay(state) === 3,
    };
  },
  (dispatch) => ({
    focusTab: (tabId: string) => dispatch(fromDapps.focusTabAction({ tabId: tabId })),
    loadResource: (address: string, tabId: string) =>
      dispatch(
        fromDapps.loadResourceAction({
          address: address,
          tabId: tabId,
        })
      ),
    removeTab: (tabId: string) => dispatch(fromDapps.removeTabAction({ tabId: tabId })),
    stopTab: (tabId: string) => dispatch(fromDapps.stopTabAction({ tabId: tabId })),
    focusSearchDapp: () => dispatch(fromDapps.focusSearchDappAction()),
    onSetMuteResource: (tabId: string, a: boolean) => {
      dispatch(
        fromDapps.setTabMutedAction({
          tabId: tabId,
          muted: a,
        })
      );
    },
  })
)(TabsListComponent);
