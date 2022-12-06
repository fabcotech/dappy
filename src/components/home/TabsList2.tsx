import * as React from 'react';
import { connect } from 'react-redux';

import { State as StoreState } from '/store';
import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import { TransitoryState, Tab } from '/models';

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
  onSetMuteTab: (tabId: string, a: boolean) => void;
  onSetFavoriteTab: (tabId: string, a: boolean) => void;
  unfocusAllTabs: () => void;
}

class TabsList2Component extends React.Component<TabsList2Props, {}> {
  state = {};

  render() {
    const focusedTabId = this.props.tabsFocusOrder[this.props.tabsFocusOrder.length - 1];

    const tab = this.props.tabs.find((t) => t.id === focusedTabId);
    if (focusedTabId && tab) {
      return (
        <div className="simple-tab">
          <div>
            {tab.img ? <img src={`${tab.img}`}></img> : <span className="tab-favicon"></span>}
          </div>
          <div>
            <p className="tab-title">{(tab as Tab).title}</p>
          </div>
        </div>
      );
    }
    return <></>;
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
    unfocusAllTabs: () => dispatch(fromDapps.unfocusAllTabsAction()),
    onSetFavoriteTab: (tabId: string, a: boolean) => {},
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
