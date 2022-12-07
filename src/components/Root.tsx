import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import './Root.scss';
import { State as RootState } from '/store';
import * as fromUi from '/store/ui';
import * as fromMain from '/store/main';
import * as fromSettings from '/store/settings';
import { TopBar, Home2 } from './home';
import { Root as SettingsRoot } from './settings';
import { Root as AuthRoot } from './auth';
import { Root as WhitelistRoot } from './whitelist';
import { Root as AccountsRoot } from './accounts';
import { Root as TransactionsRoot } from './transactions';
import { Menu } from './Menu';
import { Modal, Gcu } from './utils';
import { NavigationUrl, Language } from '/models';
import { DEVELOPMENT } from '/CONSTANTS';
import { GCU_TEXT, GCU_VERSION } from '/GCU';
import { NoAccountForm } from './utils/NoAccountForm';
import { initTranslate } from '/utils/translate';
import { maximize, minimize, close } from '/interProcess';

interface RootComponentProps {
  tabsListDisplay: number;
  menuCollapsed: boolean;
  navigationUrl: NavigationUrl;
  isMobile: boolean;
  language: Language;
  isNavigationInDapps: boolean;
  isNavigationInSettings: boolean;
  isNavigationInAccounts: boolean;
  isNavigationInTransactions: boolean;
  isNavigationInAuth: boolean;
  isNavigationInWhitelist: boolean;
  isBeta: boolean;
  platform: fromUi.State['platform'];
  currentVersion: undefined | string;
  gcu: undefined | string;
  shouldDisplayAccountCreationForm: boolean;
  isAwaitingUpdate: boolean;
  modal: fromMain.Modal | undefined;
  initializationOver: boolean;
  toggleMenuCollapsed: () => void;
  updateGcu: () => void;
  navigate: (navigationUrl: NavigationUrl) => void;
}

class RootComponent extends React.Component<RootComponentProps> {
  state = {};

  componentDidCatch(error: Error) {
    console.error('An error occured in components');
    if (DEVELOPMENT) {
      console.log(error);
    } else {
      window.Sentry.captureException(error);
    }
  }

  render() {
    /*
      Init window.t once
    */
    if (!window.t) {
      initTranslate(this.props.language);
    }

    if (this.props.initializationOver && this.props.gcu !== GCU_VERSION) {
      return <Gcu version={GCU_VERSION} text={GCU_TEXT} continue={this.props.updateGcu}></Gcu>;
    }

    let klasses = 'root theme theme-black';
    if (this.props.isMobile) {
      klasses += ' is-mobile';
    }

    return (
      <div className={klasses}>
        {!this.props.initializationOver && (
          <div className={'loading'}>
            <p>loading</p>
          </div>
        )}
        {this.props.initializationOver && (
          <>
            {this.props.modal ? <Modal /> : undefined}
            {!this.props.isNavigationInDapps && (
              <Menu
                tabsListDisplay={this.props.tabsListDisplay}
                menuCollapsed={this.props.menuCollapsed}
                toggleMenuCollapsed={this.props.toggleMenuCollapsed}
                isNavigationInDapps={this.props.isNavigationInDapps}
                isNavigationInSettings={this.props.isNavigationInSettings}
                isNavigationInAccounts={this.props.isNavigationInAccounts}
                isNavigationInTransactions={this.props.isNavigationInTransactions}
                isNavigationInAuth={this.props.isNavigationInAuth}
                isNavigationInWhitelist={this.props.isNavigationInWhitelist}
                isMobile={this.props.isMobile}
                isBeta={this.props.isBeta}
                currentVersion={this.props.currentVersion}
                isAwaitingUpdate={this.props.isAwaitingUpdate}
                navigate={this.props.navigate}
              />
            )}
            <TopBar
              isNavigationInDapps={this.props.isNavigationInDapps}
              navigate={this.props.navigate}
            ></TopBar>
            <div className="root-full">
              <Home2 />
            </div>
            {!this.props.isNavigationInDapps && (
              <div className="root-right">
                {this.props.platform && false && (
                  <div className="fc top-window-buttons">
                    <div className="drag-top"></div>
                    <div className="drag-bottom"></div>
                    <i onClick={() => minimize()} className="fas fa-minus"></i>
                    <i onClick={() => maximize()} className="square-max"></i>
                    <i onClick={() => close()} className="fas fa-times"></i>
                  </div>
                )}
                {this.props.isNavigationInSettings ? (
                  <SettingsRoot
                    navigationUrl={this.props.navigationUrl}
                    navigate={this.props.navigate}
                  />
                ) : undefined}
                {this.props.isNavigationInAccounts ? (
                  <AccountsRoot
                    navigationUrl={this.props.navigationUrl}
                    navigate={this.props.navigate}
                  />
                ) : undefined}
                {this.props.isNavigationInAuth ? (
                  <AuthRoot
                    navigationUrl={this.props.navigationUrl}
                    navigate={this.props.navigate}
                  />
                ) : undefined}
                {this.props.isNavigationInWhitelist ? (
                  <WhitelistRoot
                    navigationUrl={this.props.navigationUrl}
                    navigate={this.props.navigate}
                  />
                ) : undefined}
                {this.props.isNavigationInTransactions ? <TransactionsRoot /> : undefined}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export const shouldDisplayAccountCreationForm = createSelector(
  fromSettings.getAccounts,
  fromUi.showAccountCreationAtStartup,
  (accounts, showAtStartup) => {
    return Object.values(accounts).length === 0 && showAtStartup;
  }
);

export const Root = connect(
  (state: RootState) => ({
    tabsListDisplay: fromUi.getTabsListDisplay(state),
    menuCollapsed: fromUi.getMenuCollapsed(state),
    isNavigationInDapps: fromUi.getIsNavigationInDapps(state),
    isNavigationInSettings: fromUi.getIsNavigationInSettings(state),
    isNavigationInAccounts: fromUi.getIsNavigationInAccounts(state),
    isNavigationInTransactions: fromUi.getIsNavigationInTransactions(state),
    isNavigationInAuth: fromUi.getIsNavigationInAuth(state),
    isNavigationInWhitelist: fromUi.getIsNavigationInWhitelist(state),
    navigationUrl: fromUi.getNavigationUrl(state),
    isMobile: fromUi.getIsMobile(state),
    language: fromUi.getLanguage(state),
    currentVersion: fromMain.getCurrentVersion(state),
    gcu: fromUi.getGcu(state),
    platform: fromUi.getPlatform(state),
    shouldDisplayAccountCreationForm: shouldDisplayAccountCreationForm(state),
    isAwaitingUpdate: false,
    isBeta: fromMain.getIsBeta(state),
    modal: fromMain.getModal(state),
    initializationOver: fromMain.getInitializationOver(state),
  }),
  (dispatch) => ({
    navigate: (navigationUrl: NavigationUrl) =>
      dispatch(fromUi.navigateAction({ navigationUrl: navigationUrl })),
    toggleMenuCollapsed: () => dispatch(fromUi.toggleMenuCollapsedAction()),
    updateGcu: () => dispatch(fromUi.updateGcuAction({ gcu: GCU_VERSION })),
  })
)(RootComponent);
