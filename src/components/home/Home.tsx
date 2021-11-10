import * as React from 'react';
import { connect } from 'react-redux';

import { State as StoreState } from '/store';
import './Home.scss';
import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import { FetchContract, TabsList } from '.';
import { Resources } from '../resources';

interface HomeComponentProps {
  tabsListDisplay: number;
  isSearchFocused: boolean;
}

class HomeComponent extends React.Component<HomeComponentProps, {}> {
  state = {};

  render() {
    return (
      <div className={`home tabs-list-display-${this.props.tabsListDisplay}`}>
        {this.props.tabsListDisplay !== 1 ? (
          <div className="left">
            <TabsList />
          </div>
        ) : undefined}
        <Resources />
        <div className={`right fc ${this.props.isSearchFocused ? 'search-focused' : ''}`}>
          <FetchContract />
        </div>
      </div>
    );
  }
}

export const Home = connect((state: StoreState) => {
  return {
    tabsListDisplay: fromUi.getTabsListDisplay(state),
    isSearchFocused: fromDapps.getIsSearchFocused(state),
  };
}, undefined)(HomeComponent);
