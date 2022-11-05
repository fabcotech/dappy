import * as React from 'react';
import { connect } from 'react-redux';

import { State as StoreState } from '/store';
import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import { TransitoryState, Tab } from '/models';
import './TabsList3.scss';

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

class TabsList3Component extends React.Component<TabsList2Props, {}> {
  state = {};

  render() {
    const focusedTabId = this.props.tabsFocusOrder[this.props.tabsFocusOrder.length - 1];
    return (
      <div className={`tabs-list-3 ${this.props.onlyIcons ? 'only-icons' : ''}`}>
        {this.props.tabs.map((tab) => {
          return (
            <div
              className={`tab ${focusedTabId === tab.id ? 'focused' : ''} ${
                tab.active ? 'active' : ''
              }`}
            >
              <div className="content">
                <div className="host">
                  <span>{tab.url}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

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
