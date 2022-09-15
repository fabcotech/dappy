import * as React from 'react';
import { NavigationUrl } from '/models';

import './Menu.scss';
import { MenuMobile } from '.';
import { ACCESS_ACCOUNTS, ACCESS_SETTINGS, ACCESS_TRANSACTIONS, ACCESS_SECURITY, LEFT_MENU_COLORS, BRAND_NAME, BRAND_IMG, ACCESS_WHITELIST } from '/CONSTANTS';

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
    if (this.props.isMobile) {
      return (
        <MenuMobile
          tabsListDisplay={this.props.tabsListDisplay}
          isAwaitingUpdate={this.props.isAwaitingUpdate}
          currentVersion={this.props.currentVersion}
          isBeta={this.props.isBeta}
          backgroundMenuLeft={backgroundMenuLeft}
          isNavigationInDapps={this.props.isNavigationInDapps}
          isNavigationInSettings={this.props.isNavigationInSettings}
          isNavigationInAccounts={this.props.isNavigationInAccounts}
          isNavigationInTransactions={this.props.isNavigationInTransactions}
          isNavigationInAuth={this.props.isNavigationInAuth}
          isNavigationInWhitelist={this.props.isNavigationInWhitelist}
          navigate={this.props.navigate}
        />
      );
    }

    if (this.props.menuCollapsed) {
      return (
        <aside
          style={ backgroundMenuLeft ? { background: backgroundMenuLeft } : {}} 
          className={`root-left menu collapsed`}
        >
          <ul className="menu-list collapsed top pt-2">
            <li>
              <a onClick={this.props.toggleMenuCollapsed} className="menu-icon">
                <i className="fa fa-bars" />
              </a>
            </li>
          </ul>
          <ul className="menu-list">
            <li>
              <a
                title={this.props.isNavigationInDapps ? 'Click to switch tabs display' : ''}
                className={this.props.isNavigationInDapps ? 'is-active' : ''}
                onClick={() => this.props.navigate('/dapps')}>
                <i className="fa fa-globe-europe fa-before" />
              </a>
            </li>
            {
              ACCESS_SETTINGS &&
              <li>
                <a
                  className={this.props.isNavigationInSettings ? 'is-active' : ''}
                  onClick={() => this.props.navigate('/settings')}>
                  <i className="fa fa-wrench fa-before" />
                </a>
              </li>
            }
            {
              ACCESS_ACCOUNTS &&
              <li>
                <a
                  className={this.props.isNavigationInAccounts ? 'is-active' : ''}
                  onClick={() => this.props.navigate('/accounts')}>
                  <i className="fa fa-money-check fa-before" />
                </a>
              </li>
            }
            {
              ACCESS_SECURITY &&
              <li>
                <a
                  className={this.props.isNavigationInAuth ? 'is-active' : ''}
                  onClick={() => this.props.navigate('/auth')}>
                  <i className="fa fa-bolt fa-before" />
                </a>
              </li>
            }
            {
              ACCESS_WHITELIST &&
              <li>
                <a
                  className={this.props.isNavigationInAuth ? 'is-active' : ''}
                  onClick={() => this.props.navigate('/whitelist')}>
                  <i className="fa fa-table-list fa-before" />
                </a>
              </li>
            }
            {
              ACCESS_TRANSACTIONS &&
              <li>
                <a
                  className={this.props.isNavigationInTransactions ? 'is-active' : ''}
                  onClick={() => this.props.navigate('/transactions')}>
                  <i className="fa fa-receipt fa-before" />
                </a>
              </li>
            }
          </ul>
          <div className="drag-side"></div>
        </aside>
      );
    }

    return (
      <aside
        style={ backgroundMenuLeft ? { background: backgroundMenuLeft } : {}}
        className={`root-left menu not-collapsed`}
      >
        <ul className="menu-list top not-collapsed">
          {
            typeof BRAND_NAME === 'string' ?
            <li
              className={`${BRAND_NAME.length > 10 ? 'long' : 'short'} ${BRAND_IMG ? 'with-img' : ''} dappy pl-2 pt-1`}
            >
              {
                BRAND_NAME && <>{BRAND_NAME} <br /></>
              }
              <span className="version">
                v{this.props.currentVersion} {this.props.isBeta ? '(beta)' : undefined}
              </span>
              {
                BRAND_IMG &&
                <img src={BRAND_IMG} />
              }
            </li> :
            <li className="dappy pl-2 pt-1">
              dappy <br />
              <span className="version">
                v{this.props.currentVersion} {this.props.isBeta ? '(beta)' : undefined}
                {this.props.isAwaitingUpdate ? undefined : undefined}
              </span>
            </li>
          }
          <li>
            <a onClick={this.props.toggleMenuCollapsed} className="menu-icon">
              <i className="fa fa-bars" />
            </a>
          </li>
        </ul>
        <ul className="menu-list">
          <li>
            <a
              title={this.props.isNavigationInDapps ? 'Click to switch tabs display' : ''}
              className={this.props.isNavigationInDapps ? 'is-active' : ''}
              onClick={() => this.props.navigate('/dapps')}>
              <i className="fa fa-globe-europe fa-before" />
              {t('menu browse')}
              {this.props.tabsListDisplay === 1 ? <i className="fa fa-eye-slash fa-after"></i> : undefined}
              {this.props.tabsListDisplay === 2 ? <i className="fa fa-eye fa-after"></i> : undefined}
              {this.props.tabsListDisplay === 3 ? <i className="fa fa-eye fa-after"></i> : undefined}
            </a>
          </li>
          {
            ACCESS_SETTINGS &&
            <li>
              <a
                className={this.props.isNavigationInSettings ? 'is-active' : ''}
                onClick={() => this.props.navigate('/settings')}>
                <i className="fa fa-wrench fa-before" />
                {t('menu settings')}
              </a>
            </li>
          }
          {
            ACCESS_ACCOUNTS &&
            <li>
              <a
                className={this.props.isNavigationInAccounts ? 'is-active' : ''}
                onClick={() => this.props.navigate('/accounts')}>
                <i className="fa fa-money-check fa-before" />
                {t('menu accounts')}
              </a>
            </li>
          }
          {
            ACCESS_SECURITY &&
            <li>
              <a
                className={this.props.isNavigationInAuth ? 'is-active' : ''}
                onClick={() => this.props.navigate('/auth')}>
                <i className="fa fa-bolt fa-before" />
                {t('menu auth')}
              </a>
            </li>
          }
          {
            ACCESS_WHITELIST &&
            <li>
              <a
                className={this.props.isNavigationInWhitelist ? 'is-active' : ''}
                onClick={() => this.props.navigate('/whitelist')}>
                <i className="fa fa-list-ul fa-before" />
                {t('menu whitelist')}
              </a>
            </li>
          }
          {
            ACCESS_TRANSACTIONS &&
            <li>
              <a
                className={this.props.isNavigationInTransactions ? 'is-active' : ''}
                onClick={() => this.props.navigate('/transactions')}>
                <i className="fa fa-receipt fa-before" />
                {t('menu transactions')}
              </a>
            </li>
          }
        </ul>
        <div className="drag-side"></div>
      </aside>
    );
  }
}

export const Menu = MenuComponent;
