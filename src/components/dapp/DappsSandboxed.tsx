import * as React from 'react';
import { connect } from 'react-redux';

import './DappsSandboxed.scss';
import * as fromDapps from '../../store/dapps';
import * as fromBlockchain from '../../store/blockchain';
import * as fromMain from '../../store/main';
import * as fromHistory from '../../store/history';
import * as fromCookies from '../../store/cookies';
import * as fromSettings from '../../store/settings';
import {
  Dapp,
  TransactionState,
  TransitoryState,
  Tab,
  LastLoadError,
  Identification,
  IpApp,
  Session,
  LoadedFile,
  Cookie,
} from '../../models';
import { DappSandboxed, IpAppSandboxed, DownloadFile, NavigationBar } from './';
import { Modal } from '../utils';
import { searchToAddress } from '../../utils/searchToAddress';

interface DappsSandboxedComponentProps {
  activeTabs: { [tabId: string]: Tab };
  loadedFiles: { [fileId: string]: LoadedFile };
  ipApps: { [appId: string]: IpApp };
  dapps: { [dappId: string]: Dapp };
  tabsFocusOrder: string[];
  dappTransactions: TransactionState[];
  transitoryStates: { [dappId: string]: TransitoryState };
  lastLoadErrors: { [þabId: string]: LastLoadError };
  identifications: {
    [dappId: string]: {
      [callId: string]: Identification;
    };
  };
  settings: fromSettings.Settings;
  dappModals: { [dappId: string]: fromMain.Modal[] };
  sessions: {
    [tabId: string]: Session;
  };
  cookies: { [address: string]: Cookie[] };
  clearSearchAndLoadError: (tabId: string, clearSearch: boolean) => void;
  stopTab: (tabId: string) => void;
  reloadResource: (tabId: string) => void;
  loadResource: (address: string, tabId: string) => void;
  updateTransitoryState: (resourceId: string, ts: TransitoryState | undefined) => void;
  updateOrCreatePreview: (a: fromHistory.UpdateOrCreatePreviewPayload) => void;
}

const defaultCookies: Cookie[] = [];

class DappsSandboxedComponent extends React.Component<DappsSandboxedComponentProps, {}> {
  state = {};

  render() {
    return (
      <div className={`dapps-sandboxed ${Object.keys(this.props.activeTabs).length ? '' : 'hidden'}`}>
        {Object.keys(this.props.activeTabs).map((tabId, index) => {
          const tab = this.props.activeTabs[tabId];
          if (this.props.dappModals[tab.resourceId] && this.props.dappModals[tab.resourceId][0]) {
            /*
              If there is a modal, the modal will be at DappSandboxed z index + 1
              display is the following: dapp1 10, dapp1NavigationBar 12, dapp2 20, dapp2Modal 21, dapp2NavigationBar 22,
              dapp3 30, dapp3Modal 31, dapp3NavigationBar 32 etc...
            */
            return (
              <div
                key={tab.id}
                style={{ zIndex: (this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10 + 1 }}
                className="dapp-modal">
                <Modal dappId={tab.resourceId} />
              </div>
            );
          }

          return undefined;
        })}
        {Object.keys(this.props.activeTabs).map((tabId, index) => {
          const tab = this.props.activeTabs[tabId];
          const loadedFile: LoadedFile = this.props.loadedFiles[tab.resourceId];
          const ipApp = this.props.ipApps[tab.resourceId];
          const zIndex = (this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10 + 2;
          if (ipApp) {
            const address = searchToAddress(ipApp.search, ipApp.chainId);
            return (
              <React.Fragment key={tabId}>
                <NavigationBar key={`${tabId}-${zIndex}`} zIndex={zIndex} tab={tab} />
                <IpAppSandboxed
                  zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10}
                  ipApp={ipApp}
                  tab={tab}
                  devMode={this.props.settings.devMode}
                  session={this.props.sessions[tabId]}
                  cookies={this.props.cookies[address] || defaultCookies}
                  address={address}
                />
              </React.Fragment>
            );
          }

          if (loadedFile) {
            return (
              <React.Fragment key={tabId}>
                <NavigationBar
                  key={`${tabId}-${zIndex}`}
                  zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10 + 2}
                  tab={tab}
                />
                <DownloadFile
                  zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10}
                  loadedFile={loadedFile}
                  transitoryStates={this.props.transitoryStates}
                  lastLoadError={this.props.lastLoadErrors[tabId]}
                  tab={tab}
                  clearSearchAndLoadError={this.props.clearSearchAndLoadError}
                  stopTab={this.props.stopTab}
                  reloadResource={this.props.reloadResource}
                  loadResource={this.props.loadResource}
                  devMode={this.props.settings.devMode}
                />
              </React.Fragment>
            );
          }

          const dapp = this.props.dapps[tab.resourceId];
          const address = dapp ? searchToAddress(dapp.search, dapp.chainId) : '';
          return (
            <React.Fragment key={tabId}>
              <NavigationBar
                key={`${tabId}-${zIndex}`}
                zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10 + 2}
                tab={tab}
              />
              <DappSandboxed
                zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10}
                dapp={dapp}
                transitoryStates={this.props.transitoryStates}
                lastLoadError={this.props.lastLoadErrors[tabId]}
                tab={tab}
                clearSearchAndLoadError={this.props.clearSearchAndLoadError}
                loadResource={this.props.loadResource}
                devMode={this.props.settings.devMode}
                cookies={this.props.cookies[address] || defaultCookies}
                address={address}
              />
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

export const DappsSandboxed = connect(
  (state) => {
    return {
      activeTabs: fromDapps.getActiveTabs(state),
      loadedFiles: fromDapps.getLoadedFiles(state),
      ipApps: fromDapps.getIpApps(state),
      dapps: fromDapps.getDapps(state),
      tabsFocusOrder: fromDapps.getTabsFocusOrderWithoutSearch(state),
      dappTransactions: fromBlockchain.getDappTransactions(state),
      transitoryStates: fromDapps.getDappsTransitoryStates(state),
      lastLoadErrors: fromDapps.getLastLoadErrors(state),
      identifications: fromDapps.getIdentifications(state),
      settings: fromSettings.getSettings(state),
      dappModals: fromMain.getDappModals(state),
      sessions: fromHistory.getSessions(state),
      cookies: fromCookies.getCookies(state),
    };
  },
  (dispatch) => {
    return {
      stopTab: (tabId: string) => dispatch(fromDapps.stopTabAction({ tabId: tabId })),
      reloadResource: (tabId: string) => dispatch(fromDapps.reloadResourceAction({ tabId: tabId })),
      clearSearchAndLoadError: (tabId: string, clearSearch: boolean) =>
        dispatch(fromDapps.clearSearchAndLoadErrorAction({ tabId: tabId, clearSearch: clearSearch })),
      loadResource: (address: string, tabId: string) =>
        dispatch(
          fromDapps.loadResourceAction({
            address: address,
            tabId: tabId,
          })
        ),
      updateTransitoryState: (resourceId: string, ts: TransitoryState | undefined) =>
        dispatch(
          fromDapps.updateTransitoryStateAction({
            resourceId: resourceId,
            transitoryState: ts,
          })
        ),
      updateOrCreatePreview: (a: fromHistory.UpdateOrCreatePreviewPayload) =>
        dispatch(fromHistory.updateOrCreatePreviewAction(a)),
    };
  }
)(DappsSandboxedComponent);
