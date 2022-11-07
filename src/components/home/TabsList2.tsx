import * as React from 'react';
import { connect } from 'react-redux';

import { State as StoreState } from '/store';
import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import { TransitoryState, Tab } from '/models';
import { TabListItem } from '.';
import './TabsList2.scss';

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

class TabsList2Component extends React.Component<TabsList2Props, {}> {
  state = {};

  render() {
    const focusedTabId = this.props.tabsFocusOrder[this.props.tabsFocusOrder.length - 1];
    return (
      <div className={`tabs-list-2 ${this.props.onlyIcons ? 'only-icons' : ''}`}>
        {this.props.tabs.map((tab) => {
          return (
            <TabListItem
              key={tab.id}
              tab={tab}
              transitoryState={this.props.transitoryStates[tab.id]}
              focused={focusedTabId === tab.id}
              onlyIcons={this.props.onlyIcons}
              focusTab={this.props.focusTab}
              loadResource={this.props.loadResource}
              removeTab={this.props.removeTab}
              stopTab={this.props.stopTab}
              onSetMuteTab={this.props.onSetMuteTab}
              onSetFavoriteTab={this.props.onSetFavoriteTab}
            />
          );
        })}
        {focusedTabId && (
          <div className="search-dapps" onClick={this.props.unfocusAllTabs}>
            <i className="fa fa-plus fa-after" />
          </div>
        )}
      </div>
    );
  }
}

export const TabsList2 = connect(
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
    focusTab: (tabId: string) => dispatch(fromDapps.focusTabAction({ tabId: tabId })),
    loadResource: (address: string, tabId: string) =>
      dispatch(
        fromDapps.loadResourceAction({
          url: address,
          tabId: tabId,
        })
      ),
    removeTab: (tabId: string) => dispatch(fromDapps.removeTabAction({ tabId: tabId })),
    stopTab: (tabId: string) => dispatch(fromDapps.stopTabAction({ tabId: tabId })),
    unfocusAllTabs: () => dispatch(fromDapps.unfocusAllTabsAction()),
    onSetFavoriteTab: (tabId: string, a: boolean) => {
      dispatch(
        fromDapps.setTabFavoriteAction({
          tabId: tabId,
          favorite: a,
        })
      );
    },
    onSetMuteTab: (tabId: string, a: boolean) => {
      dispatch(
        fromDapps.setTabMutedAction({
          tabId: tabId,
          muted: a,
        })
      );
    },
  })
)(TabsList2Component);
