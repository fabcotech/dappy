import * as React from 'react';

import { NavigationUrl } from '/models';

import './TopBar.scss';
import { TabsList2 } from './';

interface TopBarComponentProps {
  isNavigationInDapps: boolean;
  navigate: (navigationUrl: NavigationUrl) => void;
}

class TopBarComponent extends React.Component<TopBarComponentProps, {}> {
  state = {};

  render() {
    return (
      <div className="topbar">
        <a
          onClick={() => {
            if (this.props.isNavigationInDapps) {
              this.props.navigate('/settings');
            } else {
              this.props.navigate('/');
            }
          }}
          className="settings-home"
          type="button"
        >
          {this.props.isNavigationInDapps ? 'Settings' : 'Back'}
        </a>
        {this.props.isNavigationInDapps && <TabsList2 />}
      </div>
    );
  }
}

export const TopBar = TopBarComponent;
