import * as React from 'react';
import { connect } from 'react-redux';
import { dappyNetworks } from '@fabcotech/dappy-lookup';

import { State as StoreState } from '/store';
import * as fromDapps from '/store/dapps';
import { NavigationUrl, Tab } from '/models';
import * as fromUi from '/store/ui';
import * as fromSettings from '/store/settings';
import { NavigationBarHome2, Resources } from '../resources';
import './Home2.scss';

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
    const { currentNetwork, otherNetwork } = this.props;
    return (
      <div className="home2">
        {Object.keys(this.props.activeTabs).length === 0 && <NavigationBarHome2 />}

        {currentNetwork && (
          <div
            className="px-4"
            style={{
              display: 'flex',
              flexDirection: 'row',
              height: 'fit-content',
            }}
          >
            <span className="mr-3">You are on network {currentNetwork}</span>
            <button>switch to {otherNetwork}</button>
          </div>
        )}

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
    const currentNetwork = fromSettings.getFirstBlockchain(state)?.chainName;
    return {
      activeTabs: fromDapps.getActiveTabs(state),
      tabsListDisplay: fromUi.getTabsListDisplay(state),
      isSearchFocused: fromDapps.getIsSearchFocused(state),
      currentNetwork,
      otherNetwork: Object.keys(dappyNetworks).filter((n) => n !== currentNetwork),
    };
  },
  (dispatch) => {
    return {
      navigate: (navigationUrl: NavigationUrl) =>
        dispatch(fromUi.navigateAction({ navigationUrl })),
    };
  }
)(Home2Component);
