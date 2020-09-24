import * as React from 'react';
import { connect } from 'react-redux';

import * as fromDapps from '../../store/dapps';
import * as fromUi from '../../store/ui';
import { blockchain as blockchainUtils } from '../../utils/';
import { Dapp, DappManifest, TransitoryState, Tab } from '../../models';
import { TabListItem } from '.';
import './TabsList.scss';

interface TabsListProps {
  dapps: { [id: string]: Dapp };
  dappManifests: { [id: string]: DappManifest };
  tabs: Tab[];
  tabsFocusOrder: string[];
  transitoryStates: { [dappId: string]: TransitoryState };
  isMobile: undefined | boolean;
  isSearchFocused: boolean;
  onlyIcons: boolean;
  focusTab: (tabId: string) => void;
  launchDapp: (dappId: string, tabId: string) => void;
  removeTab: (tabId: string) => void;
  stopTab: (tabId: string) => void;
  reloadResource: (tabId: string) => void;
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
              launchDapp={this.props.launchDapp}
              removeTab={this.props.removeTab}
              stopTab={this.props.stopTab}
              reloadResource={this.props.reloadResource}
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
      dappManifests: fromDapps.getDappManifests(state),
      isMobile: fromUi.getIsMobile(state),
      isSearchFocused: fromDapps.getIsSearchFocused(state),
      onlyIcons: fromUi.getDappsListDisplay(state) === 3,
    };
  },
  (dispatch) => ({
    focusTab: (tabId: string) => dispatch(fromDapps.focusTabAction({ tabId: tabId })),
    launchDapp: (dappId: string, tabId: string) =>
      dispatch(
        fromDapps.loadResourceAction({
          address: blockchainUtils.resourceIdToAddress(dappId),
          tabId: tabId,
        })
      ),
    removeTab: (tabId: string) => dispatch(fromDapps.removeTabAction({ tabId: tabId })),
    stopTab: (tabId: string) => dispatch(fromDapps.stopTabAction({ tabId: tabId })),
    reloadResource: (tabId: string) => dispatch(fromDapps.reloadResourceAction({ tabId: tabId })),
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
