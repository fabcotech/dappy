import * as React from 'react';

import { Resolver, Development, FactorySettings, UpdateLanguage } from './settings';
import { Blockchains } from './blockchain';
import { Root as RecordsRoot } from './records/';
import { NavigationUrl } from '../../models';
import './Root.scss';
import { Accounts } from './accounts';

interface RootProps {
  navigationUrl: NavigationUrl;
  navigate: (navigationUrl: NavigationUrl) => void;
}

export class RootComponent extends React.Component<RootProps, {}> {
  state = {};
  testSentry = 0;

  componentWillUnmount() {
    document.removeEventListener('keypress', this.sentryTestListener);
  }

  componentDidMount() {
    document.addEventListener('keypress', this.sentryTestListener);
  }

  sentryTestListener = (e: KeyboardEvent) => {
    if (e.key === 't') {
      this.testSentry += 1;
    } else {
      this.testSentry = 0;
    }
    if (this.testSentry === 40) {
      this.props.navigate.testSentry.testSentry;
      this.testSentry = 0;
    }
  }

  render() {
    return (
      <div className="p20 settings">
        <h3 className="subtitle is-3">{t('menu settings')}</h3>
        <div className="tabs">
          <ul>
            <li className={this.props.navigationUrl === '/settings' ? 'is-active' : ''}>
              <a onClick={() => this.props.navigate('/settings')}>{t('menu settings')}</a>
            </li>
            <li className={this.props.navigationUrl === '/settings/accounts' ? 'is-active' : ''}>
              <a onClick={() => this.props.navigate('/settings/accounts')}>{t('menu accounts')}</a>
            </li>
            <li className={this.props.navigationUrl === '/settings/blockchains' ? 'is-active' : ''}>
              <a onClick={() => this.props.navigate('/settings/blockchains')}>{t('menu networks')}</a>
            </li>
            <li className={this.props.navigationUrl === '/settings/names' ? 'is-active' : ''}>
              <a onClick={() => this.props.navigate('/settings/names')}>{t('menu names')}</a>
            </li>
          </ul>
        </div>
        {this.props.navigationUrl === '/settings' ? (
          <React.Fragment>
            <Resolver />
            <br />
            <Development />
            <br />
            <UpdateLanguage />
            <br />
            <FactorySettings />
          </React.Fragment>
        ) : (
          undefined
        )}
        {this.props.navigationUrl === '/settings/blockchains' ? <Blockchains /> : undefined}
        {this.props.navigationUrl === '/settings/names' ? <RecordsRoot /> : undefined}
        {this.props.navigationUrl === '/settings/accounts' ? <Accounts /> : undefined}
      </div>
    );
  }
}

export const Root = RootComponent;
