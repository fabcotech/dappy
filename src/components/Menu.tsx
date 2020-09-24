import * as React from 'react';
import './Menu.scss';
import { NavigationUrl } from '../models';
import { MenuMobile } from '.';

interface MenuComponentProps {
  menuCollapsed: boolean;
  isNavigationInDapps: boolean;
  isNavigationInSettings: boolean;
  isNavigationInDeploy: boolean;
  isNavigationInTransactions: boolean;
  isBeta: boolean;
  currentVersion: undefined | string;
  isAwaitingUpdate: boolean;
  isMobile: boolean;
  navigate: (navigationUrl: NavigationUrl) => void;
  toggleMenuCollapsed: () => void;
}

class MenuComponent extends React.Component<MenuComponentProps, {}> {
  render() {
    if (this.props.isMobile) {
      return (
        <MenuMobile
          isAwaitingUpdate={this.props.isAwaitingUpdate}
          currentVersion={this.props.currentVersion}
          isBeta={this.props.isBeta}
          isNavigationInDapps={this.props.isNavigationInDapps}
          isNavigationInSettings={this.props.isNavigationInSettings}
          isNavigationInDeploy={this.props.isNavigationInDeploy}
          isNavigationInTransactions={this.props.isNavigationInTransactions}
          navigate={this.props.navigate}
        />
      );
    }

    if (this.props.menuCollapsed) {
      return (
        <aside className={`root-left menu ${this.props.menuCollapsed ? 'collapsed' : 'not-collapsed'}`}>
          <ul className="menu-list top fc">
            <li>
              <a onClick={this.props.toggleMenuCollapsed} className="menu-icon">
                <i className="fa fa-bars" />
              </a>
            </li>
          </ul>
          <ul className="menu-list">
            <li>
              <a
                className={this.props.isNavigationInDapps ? 'is-active' : ''}
                onClick={() => this.props.navigate('/dapps')}>
                <i className="fa fa-globe-europe fa-before" />
              </a>
            </li>
            <li>
              <a
                className={this.props.isNavigationInSettings ? 'is-active' : ''}
                onClick={() => this.props.navigate('/settings')}>
                <i className="fa fa-wrench fa-before" />
              </a>
            </li>
            <li>
              <a
                className={this.props.isNavigationInDeploy ? 'is-active' : ''}
                onClick={() => this.props.navigate('/deploy/dapp')}>
                <i className="fa fa-angle-double-up fa-before" />
              </a>
            </li>
            <li>
              <a
                className={this.props.isNavigationInTransactions ? 'is-active' : ''}
                onClick={() => this.props.navigate('/transactions')}>
                <i className="fa fa-receipt fa-before" />
              </a>
            </li>
          </ul>
        </aside>
      );
    }

    return (
      <aside className={`root-left menu ${this.props.menuCollapsed ? 'collaped' : 'not-collapsed'}`}>
        <ul className="menu-list top not-collapsed">
          <li className="dappy">
            Dappy <br />
            <span className="version">
              v{this.props.currentVersion} {this.props.isBeta ? '(beta)' : undefined}
              {this.props.isAwaitingUpdate ? undefined : undefined}
            </span>
          </li>
          <li>
            <a onClick={this.props.toggleMenuCollapsed} className="menu-icon">
              <i className="fa fa-bars" />
            </a>
          </li>
        </ul>
        <ul className="menu-list">
          <li>
            <a
              className={this.props.isNavigationInDapps ? 'is-active' : ''}
              onClick={() => this.props.navigate('/dapps')}>
              <i className="fa fa-globe-europe fa-before" />
              {t('menu browse')}
            </a>
          </li>
          <li>
            <a
              className={this.props.isNavigationInSettings ? 'is-active' : ''}
              onClick={() => this.props.navigate('/settings')}>
              <i className="fa fa-wrench fa-before" />
              {t('menu settings')}
            </a>
          </li>
          <li>
            <a
              className={this.props.isNavigationInDeploy ? 'is-active' : ''}
              onClick={() => this.props.navigate('/deploy/dapp')}>
              <i className="fa fa-angle-double-up fa-before" />
              {t('menu deploy')}
            </a>
          </li>
          <li>
            <a
              className={this.props.isNavigationInTransactions ? 'is-active' : ''}
              onClick={() => this.props.navigate('/transactions')}>
              <i className="fa fa-receipt fa-before" />
              {t('menu transactions')}
            </a>
          </li>
        </ul>
      </aside>
    );
  }
}

export const Menu = MenuComponent;
