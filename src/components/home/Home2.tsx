import * as React from 'react';
import { connect } from 'react-redux';

import { State as StoreState } from '/store';
import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import { NavigationBarHome2, Resources } from '../resources';
import { NavigationUrl, Tab } from '/models';
import { TopBar } from './';
import './Home2.scss';

interface Home2ComponentProps {
  activeTabs: { [tabId: string]: Tab };
  tabsListDisplay: number;
  isSearchFocused: boolean;
  navigate: (navigationUrl: NavigationUrl) => void;
}

class Home2Component extends React.Component<Home2ComponentProps, {}> {
  state = {};

  render() {
    return (
      <div className={`home2`}>
        {Object.keys(this.props.activeTabs).length === 0 && <NavigationBarHome2 />}
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
        dispatch(fromUi.navigateAction({ navigationUrl: navigationUrl })),
    };
  }
)(Home2Component);
