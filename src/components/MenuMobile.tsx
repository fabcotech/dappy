import * as React from 'react';
import './MenuMobile.scss';
import { NavigationUrl } from '../models';

interface MenuMobileComponentProps {
  dappsListDisplay: number;
  isNavigationInDapps: boolean;
  isNavigationInSettings: boolean;
  isNavigationInAccounts: boolean;
  isNavigationInDeploy: boolean;
  isNavigationInTransactions: boolean;
  isBeta: boolean;
  currentVersion: undefined | string;
  isAwaitingUpdate: boolean;
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
      <div className={`mobile-menu ${this.state.mobileMenuCollapsed ? 'collapsed' : ''}`}>
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
                { this.props.dappsListDisplay === 0 ? <i className="fa fa-eye fa-after"></i> : undefined}
              </a>
            </li>
            <li>
              <a
                className={this.props.isNavigationInSettings ? 'is-active' : ''}
                onClick={() => this.onCollapseMobileMenuAndNavigate('/settings')}>
                <i className="fa fa-wrench fa-before" />
                {t('menu settings')}
              </a>
            </li>
            <li>
              <a
                className={this.props.isNavigationInAccounts ? 'is-active' : ''}
                onClick={() => this.onCollapseMobileMenuAndNavigate('/accounts')}>
                <i className="fa fa-money-check fa-before" />
                {t('menu accounts')}
              </a>
            </li>
            <li>
              <a
                className={this.props.isNavigationInDeploy ? 'is-active' : ''}
                onClick={() => this.onCollapseMobileMenuAndNavigate('/deploy/dapp')}>
                <i className="fa fa-angle-double-up fa-before" />
                {t('menu deploy')}
              </a>
            </li>
            <li>
              <a
                className={this.props.isNavigationInTransactions ? 'is-active' : ''}
                onClick={() => this.onCollapseMobileMenuAndNavigate('/transactions')}>
                <i className="fa fa-receipt fa-before" />
                {t('menu transactions')}
              </a>
            </li>
            {this.props.isAwaitingUpdate ? undefined : undefined}
          </ul>
        ) : undefined}
      </div>
    );
  }
}

export const MenuMobile = MenuMobileComponent;
