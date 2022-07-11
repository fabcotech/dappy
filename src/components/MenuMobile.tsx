import * as React from 'react';
import './MenuMobile.scss';
import { ACCESS_ACCOUNTS, ACCESS_DEPLOY, ACCESS_NAME_SYSTEM, ACCESS_SECURITY, ACCESS_SETTINGS, ACCESS_TRANSACTIONS, BLITZ_AUTHENTICATION } from '/CONSTANTS';
import { NavigationUrl, RChainInfos } from '/models';

interface MenuMobileComponentProps {
  tabsListDisplay: number;
  isNavigationInDapps: boolean;
  isNavigationInSettings: boolean;
  isNavigationInNames: boolean;
  isNavigationInAccounts: boolean;
  isNavigationInDeploy: boolean;
  isNavigationInTransactions: boolean;
  isNavigationInAuth: boolean;
  isBeta: boolean;
  backgroundMenuLeft: string;
  currentVersion: undefined | string;
  isAwaitingUpdate: boolean;
  namesBlockchainInfos: RChainInfos | undefined;
  navigate: (navigationUrl: NavigationUrl) => void;
}

class MenuMobileComponent extends React.Component<MenuMobileComponentProps, {}> {
  state = {
    mobileMenuCollapsed: true,
  };

  onToggleMobileMenu = () => {
    this.setState({
      mobileMenuCollapsed: !this.state.mobileMenuCollapsed,
    });
  };

  onCollapseMobileMenuAndNavigate = (path: NavigationUrl) => {
    this.setState({
      mobileMenuCollapsed: true,
    });
    this.props.navigate(path);
  };

  render() {
    return (
      <div
        style={ this.props.backgroundMenuLeft ? { background: this.props.backgroundMenuLeft } : {}}
        className={`mobile-menu ${this.state.mobileMenuCollapsed ? 'collapsed' : ''}`}
      >
        <ul className="menu-mobile-list top fc">
          <li onClick={this.onToggleMobileMenu} className="bars">
            <a className="menu-icon">
              <i className="fa fa-bars" />
            </a>
          </li>
          {!this.state.mobileMenuCollapsed ? (
            <li className="dappy">
              Dappy <br />
              <span className="version">
                v{this.props.currentVersion} {this.props.isBeta ? '(beta)' : undefined}
              </span>
            </li>
          ) : undefined}
        </ul>
        {!this.state.mobileMenuCollapsed ? (
          <ul className="menu-list">
            <li>
              <a
                className={this.props.isNavigationInDapps ? 'is-active' : ''}
                onClick={() => this.onCollapseMobileMenuAndNavigate('/dapps')}>
                <i className="fa fa-globe-europe fa-before" />
                {t('menu browse')}
                {this.props.tabsListDisplay === 0 ? <i className="fa fa-eye fa-after"></i> : undefined}
              </a>
            </li>
            {
              ACCESS_SETTINGS &&
              <li>
                <a
                  className={this.props.isNavigationInSettings ? 'is-active' : ''}
                  onClick={() => this.onCollapseMobileMenuAndNavigate('/settings')}>
                  <i className="fa fa-wrench fa-before" />
                  {t('menu settings')}
                </a>
              </li>
            }
            {
              ACCESS_NAME_SYSTEM && 
              <li>
                <a
                  className={this.props.isNavigationInNames ? 'is-active' : ''}
                  onClick={() => this.onCollapseMobileMenuAndNavigate('/names')}>
                  <i className="fa fa-before rotated-d">d</i>
                  {t('name system')}
                </a>
              </li>
            }
            {
              ACCESS_ACCOUNTS &&
              <li>
                <a
                  className={this.props.isNavigationInAccounts ? 'is-active' : ''}
                  onClick={() => this.onCollapseMobileMenuAndNavigate('/accounts')}>
                  <i className="fa fa-money-check fa-before" />
                  {t('menu accounts')}
                </a>
              </li>
            }
            {
              ACCESS_SECURITY &&
              <li>
                <a
                  className={this.props.isNavigationInTransactions ? 'is-active' : ''}
                  onClick={() => this.onCollapseMobileMenuAndNavigate('/transactions')}>
                  <i className="fa fa-receipt fa-before" />
                  {t('menu auth')}
                </a>
              </li>
            }
            {
              ACCESS_DEPLOY &&
              <li>
                <a
                  className={this.props.isNavigationInDeploy ? 'is-active' : ''}
                  onClick={() => this.onCollapseMobileMenuAndNavigate('/deploy/dapp')}>
                  <i className="fa fa-angle-double-up fa-before" />
                  {t('menu deploy')}
                </a>
              </li>
            }
            {
              ACCESS_TRANSACTIONS &&
              <li>
                <a
                  className={this.props.isNavigationInTransactions ? 'is-active' : ''}
                  onClick={() => this.onCollapseMobileMenuAndNavigate('/transactions')}>
                  <i className="fa fa-receipt fa-before" />
                  {t('menu transactions')}
                </a>
              </li>
            }
            {this.props.isAwaitingUpdate ? undefined : undefined}
          </ul>
        ) : undefined}
      </div>
    );
  }
}

export const MenuMobile = MenuMobileComponent;
