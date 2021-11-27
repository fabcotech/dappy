import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import './Root.scss';
import { State as RootState } from '/store';
import * as fromUi from '/store/ui';
import * as fromMain from '/store/main';
import * as fromBlockchain from '/store/blockchain';
import * as fromSettings from '/store/settings';
import { Home } from './home';
import { Root as DeployRoot } from './deploy';
import { Root as SettingsRoot } from './settings';
import { Root as RecordRoot } from './records';
import { Root as AccountsRoot } from './accounts';
import { Root as TransactionsRoot } from './transactions';
import { Menu } from './Menu';
import { Modal, Gcu } from './utils';
import { NavigationUrl, Language } from '/models';
import { DEVELOPMENT } from '/CONSTANTS';
import { GCU_TEXT, GCU_VERSION } from '/GCU';
import { NoAccountForm } from './utils/NoAccountForm';
import { initTranslate } from '/utils/translate';

interface RootComponentProps {
  tabsListDisplay: number;
  menuCollapsed: boolean;
  navigationUrl: NavigationUrl;
  isMobile: boolean;
  language: Language;
  isNavigationInDapps: boolean;
  isNavigationInSettings: boolean;
  isNavigationInNames: boolean;
  isNavigationInAccounts: boolean;
  isNavigationInTransactions: boolean;
  isNavigationInDeploy: boolean;
  isBeta: boolean;
  currentVersion: undefined | string;
  gcu: undefined | string;
  shouldDisplayAccountCreationForm: boolean;
  isAwaitingUpdate: boolean;
  modal: fromMain.Modal | undefined;
  initializationOver: boolean;
  namesBlockchainInfos: RChainInfos | undefined;
  toggleMenuCollapsed: () => void;
  updateGcu: () => void;
  navigate: (navigationUrl: NavigationUrl) => void;
}

interface RootComponentState {
  accountCreationFormClosed: boolean;
}

class RootComponent extends React.Component<RootComponentProps, RootComponentState> {
  state = {
    accountCreationFormClosed: false,
  };
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

    if (!this.props.initializationOver) {
      return (
        <div className="root loading">
          <p>Loading</p>
        </div>
      );
    }

    if (this.props.gcu !== GCU_VERSION) {
      return <Gcu version={GCU_VERSION} text={GCU_TEXT} continue={this.props.updateGcu}></Gcu>;
    }

    if (this.props.shouldDisplayAccountCreationForm && !this.state.accountCreationFormClosed) {
      return (
        <NoAccountForm
          onClose={() => {
            this.setState({
              accountCreationFormClosed: true,
            });
          }}
        />
      );
    }

    let klasses = 'root theme-default';
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
          tabsListDisplay={this.props.tabsListDisplay}
          menuCollapsed={this.props.menuCollapsed}
          toggleMenuCollapsed={this.props.toggleMenuCollapsed}
          isNavigationInDapps={this.props.isNavigationInDapps}
          isNavigationInSettings={this.props.isNavigationInSettings}
          isNavigationInNames={this.props.isNavigationInNames}
          isNavigationInAccounts={this.props.isNavigationInAccounts}
          isNavigationInDeploy={this.props.isNavigationInDeploy}
          isNavigationInTransactions={this.props.isNavigationInTransactions}
          isMobile={this.props.isMobile}
          isBeta={this.props.isBeta}
          currentVersion={this.props.currentVersion}
          isAwaitingUpdate={this.props.isAwaitingUpdate}
          namesBlockchainInfos={this.props.namesBlockchainInfos}
          navigate={this.props.navigate}
        />
        <div className="root-right">
          {this.props.isNavigationInSettings ? (
            <SettingsRoot navigationUrl={this.props.navigationUrl} navigate={this.props.navigate} />
          ) : undefined}
          {this.props.isNavigationInNames ? <RecordRoot /> : undefined}
          {this.props.isNavigationInAccounts ? (
            <AccountsRoot navigationUrl={this.props.navigationUrl} navigate={this.props.navigate} />
          ) : undefined}
          {this.props.isNavigationInDeploy ? (
            <DeployRoot navigationUrl={this.props.navigationUrl} navigate={this.props.navigate} />
          ) : undefined}
          <Home />
          {this.props.isNavigationInTransactions ? <TransactionsRoot /> : undefined}
        </div>
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
    isNavigationInNames: fromUi.getIsNavigationInNames(state),
    isNavigationInAccounts: fromUi.getIsNavigationInAccounts(state),
    isNavigationInTransactions: fromUi.getIsNavigationInTransactions(state),
    isNavigationInDeploy: fromUi.getIsNavigationInDeploy(state),
    navigationUrl: fromUi.getNavigationUrl(state),
    isMobile: fromUi.getIsMobile(state),
    language: fromUi.getLanguage(state),
    currentVersion: fromMain.getCurrentVersion(state),
    gcu: fromUi.getGcu(state),
    shouldDisplayAccountCreationForm: shouldDisplayAccountCreationForm(state),
    isAwaitingUpdate: false,
    isBeta: fromMain.getIsBeta(state),
    modal: fromMain.getModal(state),
    initializationOver: fromMain.getInitializationOver(state),
    namesBlockchainInfos: fromBlockchain.getNamesBlockchainInfos(state),
  }),
  (dispatch) => ({
    navigate: (navigationUrl: NavigationUrl) => dispatch(fromUi.navigateAction({ navigationUrl: navigationUrl })),
    toggleMenuCollapsed: () => dispatch(fromUi.toggleMenuCollapsedAction()),
    updateGcu: () => dispatch(fromUi.updateGcuAction({ gcu: GCU_VERSION })),
  })
)(RootComponent);
