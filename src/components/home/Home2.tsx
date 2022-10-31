import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { State as StoreState } from '/store';
import * as fromDapps from '/store/dapps';
import { NavigationUrl } from '/models';
import * as fromUi from '/store/ui';
import { NavigationBarHome2, Resources } from '../resources';
import './Home2.scss';
import { NetworkSwitcher } from './NetworkSwitcher';
import { TabsList3 } from '.';

const connector = connect(
  (state: StoreState) => {
    return {
      activeTabs: fromDapps.getActiveTabs(state),
      tabsListDisplay: fromUi.getTabsListDisplay(state),
    };
  },
  (dispatch) => {
    return {
      navigate: (navigationUrl: NavigationUrl) =>
        dispatch(fromUi.navigateAction({ navigationUrl })),
    };
  }
);

type Home2Props = ConnectedProps<typeof connector>;

export const Home2Component: FC<Home2Props> = (props) => {
  return (
    <div className="home2">
      <NavigationBarHome2 />
      <NetworkSwitcher />
      <TabsList3 />
      <Resources />
    </div>
  );
};

export const Home2 = connector(Home2Component);
