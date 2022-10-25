import * as React from 'react';
import { NavigationUrl } from '/models';

import './Menu.scss';
import {
  ACCESS_ACCOUNTS,
  ACCESS_SETTINGS,
  ACCESS_TRANSACTIONS,
  ACCESS_SECURITY,
  LEFT_MENU_COLORS,
  BRAND_NAME,
  BRAND_IMG,
  ACCESS_WHITELIST,
} from '/CONSTANTS';

interface MenuComponentProps {
  tabsListDisplay: number;
  menuCollapsed: boolean;
  isNavigationInDapps: boolean;
  isNavigationInSettings: boolean;
  isNavigationInAccounts: boolean;
  isNavigationInTransactions: boolean;
  isNavigationInAuth: boolean;
  isNavigationInWhitelist: boolean;
  isBeta: boolean;
  currentVersion: undefined | string;
  isAwaitingUpdate: boolean;
  isMobile: boolean;
  navigate: (navigationUrl: NavigationUrl) => void;
  toggleMenuCollapsed: () => void;
}

class MenuComponent extends React.Component<MenuComponentProps, {}> {
  render() {
    let backgroundMenuLeft = '';
    if (LEFT_MENU_COLORS && LEFT_MENU_COLORS.length === 2) {
      backgroundMenuLeft = `linear-gradient(20deg, ${LEFT_MENU_COLORS[0]}, ${LEFT_MENU_COLORS[1]})`;
    }

    return (
      <aside
        style={backgroundMenuLeft ? { background: backgroundMenuLeft } : {}}
        className={`root-left menu not-collapsed`}
      >
        <ul className="menu-list">
          {ACCESS_SETTINGS && (
            <li>
              <a
                className={this.props.isNavigationInSettings ? 'is-active' : ''}
                onClick={() => this.props.navigate('/settings')}
              >
                {t('menu settings')}
              </a>
            </li>
          )}
          {ACCESS_ACCOUNTS && (
            <li>
              <a
                className={this.props.isNavigationInAccounts ? 'is-active' : ''}
                onClick={() => this.props.navigate('/accounts')}
              >
                {t('menu accounts')}
              </a>
            </li>
          )}
          {ACCESS_SECURITY && (
            <li>
              <a
                className={this.props.isNavigationInAuth ? 'is-active' : ''}
                onClick={() => this.props.navigate('/auth')}
              >
                {t('menu auth')}
              </a>
            </li>
          )}
          {ACCESS_WHITELIST && (
            <li>
              <a
                className={this.props.isNavigationInWhitelist ? 'is-active' : ''}
                onClick={() => this.props.navigate('/whitelist')}
              >
                {t('menu whitelist')}
              </a>
            </li>
          )}
          {ACCESS_TRANSACTIONS && (
            <li>
              <a
                className={this.props.isNavigationInTransactions ? 'is-active' : ''}
                onClick={() => this.props.navigate('/transactions')}
              >
                {t('menu transactions')}
              </a>
            </li>
          )}
        </ul>
        <div className="drag-side"></div>
      </aside>
    );
  }
}

export const Menu = MenuComponent;
