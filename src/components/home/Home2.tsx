import * as React from 'react';
import { connect } from 'react-redux';

import { State as StoreState } from '/store';
import * as fromDapps from '/store/dapps';
import { NavigationUrl, Tab } from '/models';
import * as fromUi from '/store/ui';
import { NavigationBarHome2, Resources } from '../resources';
import './Home2.scss';
import { NetworkSwitcher } from './NetworkSwitcher';

interface Home2ComponentProps {
  activeTabs: { [tabId: string]: Tab };
  tabsListDisplay: number;
  isSearchFocused: boolean;
  currentNetwork: string;
  otherNetwork: string;
  navigate: (navigationUrl: NavigationUrl) => void;
}

class Home2Component extends React.Component<Home2ComponentProps> {
  state = {};

  render() {
    return (
      <div className="home2">
        {Object.keys(this.props.activeTabs).length === 0 && <NavigationBarHome2 />}
        <NetworkSwitcher />
        <Resources />
        {/* this.props.tabsListDisplay !== 1 ? (
          <div className="left">
            <TabsList />
          </div>
        ) : undefined */}
        {/* <Resources />
        <div className={`right fc ${this.props.isSearchFocused ? 'search-focused' : ''}`}>
          <FetchContract />
        </div> */}
      </div>
    );
  }
}

export const Home2 = connect(
  (state: StoreState) => {
    return {
      activeTabs: fromDapps.getActiveTabs(state),
      tabsListDisplay: fromUi.getTabsListDisplay(state),
      isSearchFocused: fromDapps.getIsSearchFocused(state),
    };
  },
  (dispatch) => {
    return {
      navigate: (navigationUrl: NavigationUrl) =>
        dispatch(fromUi.navigateAction({ navigationUrl })),
    };
  }
)(Home2Component);
