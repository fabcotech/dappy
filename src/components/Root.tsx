import * as React from 'react';
import { connect } from 'react-redux';

import './Root.scss';
import * as fromUi from '../store/ui';
import * as fromMain from '../store/main';
import { Dapps } from './dapps';
import { Root as DeployRoot } from './deploy';
import { Root as SettingsRoot } from './settings';
import { Root as AccountsRoot } from './accounts';
import { Root as TransactionsRoot } from './transactions';
import { Menu } from './Menu';
import { Modal } from './utils';
import { NavigationUrl, Language } from '../models';
import { DEVELOPMENT } from '../CONSTANTS';
import { initTranslate } from '../utils/translate';

interface RootComponentProps {
  dappsListDisplay: number;
  menuCollapsed: boolean;
  navigationUrl: NavigationUrl;
  isMobile: boolean;
  language: Language;
  isNavigationInDapps: boolean;
  isNavigationInSettings: boolean;
  isNavigationInAccounts: boolean;
  isNavigationInTransactions: boolean;
  isNavigationInDeploy: boolean;
  isBeta: boolean;
  currentVersion: undefined | string;
  isAwaitingUpdate: boolean;
  modal: fromMain.Modal | undefined;
  initializationOver: boolean;
  toggleMenuCollapsed: () => void;
  navigate: (navigationUrl: NavigationUrl) => void;
}

class RootComponent extends React.Component<RootComponentProps, {}> {
  componentDidCatch(error: Error) {
    console.error('An error occured in components');
    if (DEVELOPMENT) {
      console.log(error);
    } else {
      window.Sentry.captureException(error);
    }
  }
  render() {
    if (!this.props.initializationOver) {
      return (
        <div className="root loading">
          <p>Loading</p>
        </div>
      );
    }

    /*
      Init window.t once
    */
    if (!window.t) {
      initTranslate(this.props.language);
    }

    let klasses = 'root';
    if (this.props.isMobile) {
      klasses += ' is-mobile';
    }
    if (this.props.menuCollapsed) {
      klasses += ' menu-collapsed';
    } else {
      klasses += ' menu-not-collapsed';
    }
    return (
      <div className={klasses}>
        {this.props.modal ? <Modal /> : undefined}
        <Menu
          dappsListDisplay={this.props.dappsListDisplay}
          menuCollapsed={this.props.menuCollapsed}
          toggleMenuCollapsed={this.props.toggleMenuCollapsed}
          isNavigationInDapps={this.props.isNavigationInDapps}
          isNavigationInSettings={this.props.isNavigationInSettings}
          isNavigationInAccounts={this.props.isNavigationInAccounts}
          isNavigationInDeploy={this.props.isNavigationInDeploy}
          isNavigationInTransactions={this.props.isNavigationInTransactions}
          isMobile={this.props.isMobile}
          isBeta={this.props.isBeta}
          currentVersion={this.props.currentVersion}
          isAwaitingUpdate={this.props.isAwaitingUpdate}
          navigate={this.props.navigate}
        />
        <div className="root-right">
          {this.props.isNavigationInSettings ? (
            <SettingsRoot navigationUrl={this.props.navigationUrl} navigate={this.props.navigate} />
          ) : (
            undefined
          )}
          {this.props.isNavigationInAccounts ? (
            <AccountsRoot navigationUrl={this.props.navigationUrl} navigate={this.props.navigate} />
          ) : (
            undefined
          )}
          {this.props.isNavigationInDeploy ? (
            <DeployRoot navigationUrl={this.props.navigationUrl} navigate={this.props.navigate} />
          ) : (
            undefined
          )}
          <Dapps />
          {this.props.isNavigationInTransactions ? <TransactionsRoot /> : undefined}
        </div>
      </div>
    );
  }
}

export const Root = connect(
  state => ({
    dappsListDisplay: fromUi.getDappsListDisplay(state),
    menuCollapsed: fromUi.getMenuCollapsed(state),
    isNavigationInDapps: fromUi.getIsNavigationInDapps(state),
    isNavigationInSettings: fromUi.getIsNavigationInSettings(state),
    isNavigationInAccounts: fromUi.getIsNavigationInAccounts(state),
    isNavigationInTransactions: fromUi.getIsNavigationInTransactions(state),
    isNavigationInDeploy: fromUi.getIsNavigationInDeploy(state),
    navigationUrl: fromUi.getNavigationUrl(state),
    isMobile: fromUi.getIsMobile(state),
    language: fromUi.getLanguage(state),
    currentVersion: fromMain.getCurrentVersion(state),
    isAwaitingUpdate: false,
    isBeta: fromMain.getIsBeta(state),
    modal: fromMain.getModal(state),
    initializationOver: fromMain.getInitializationOver(state),
  }),
  dispatch => ({
    navigate: (navigationUrl: NavigationUrl) => dispatch(fromUi.navigateAction({ navigationUrl: navigationUrl })),
    toggleMenuCollapsed: () => dispatch(fromUi.toggleMenuCollapsedAction()),
  })
)(RootComponent);
