import * as React from 'react';

import { NavigationUrl } from '/models';
import './Root.scss';
import { Accounts } from './Accounts';

interface RootProps {
  navigationUrl: NavigationUrl;
  navigate: (navigationUrl: NavigationUrl) => void;
}

export class RootComponent extends React.Component<RootProps, {}> {
  state = {};

  render() {
    return (
      <div className="p20 accounts">
        <h3 className="subtitle is-3">{t('menu accounts')}</h3>
        <Accounts />
      </div>
    );
  }
}

export const Root = RootComponent;
