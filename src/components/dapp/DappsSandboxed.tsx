import * as React from 'react';
import { connect } from 'react-redux';

import './DappsSandboxed.scss';
import * as fromDapps from '../../store/dapps';
import * as fromMain from '../../store/main';
import {
  Dapp,
  TransitoryState,
  Tab,
  LastLoadError,
  IpApp,
  LoadedFile,
} from '../../models';
import { DisplayError, DownloadFile, NavigationBar } from './';
import { Modal } from '../utils';

interface DappsSandboxedComponentProps {
  activeTabs: { [tabId: string]: Tab };
  loadedFiles: { [fileId: string]: LoadedFile };
  ipApps: { [appId: string]: IpApp };
  dapps: { [dappId: string]: Dapp };
  dappModals: { [dappId: string]: fromMain.Modal[] };
  tabsFocusOrder: string[];
  transitoryStates: { [dappId: string]: TransitoryState };
  lastLoadErrors: { [þabId: string]: LastLoadError };
  clearSearchAndLoadError: (tabId: string, clearSearch: boolean) => void;
  loadResource: (address: string, tabId: string) => void;
}

class DappsSandboxedComponent extends React.Component<DappsSandboxedComponentProps, {}> {
  render() {
    return (
      <div className={`dapps-sandboxed ${Object.keys(this.props.activeTabs).length ? '' : 'hidden'}`}>
        {Object.keys(this.props.activeTabs).map((tabId, index) => {
          const tab = this.props.activeTabs[tabId];
          if (this.props.dappModals[tab.resourceId] && this.props.dappModals[tab.resourceId][0]) {
            /*
              If there is a modal, the modal will be at DisplayError z index + 1
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
          const dapp = this.props.dapps[tab.resourceId];
          const zIndex = (this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10 + 2;
          if (dapp) {
            return (
              <React.Fragment key={tabId}>
                <NavigationBar key={`${tabId}-${zIndex}`} zIndex={zIndex} tab={tab} />
              </React.Fragment>
            );
          }

          if (ipApp) {
            return (
              <React.Fragment key={tabId}>
                <NavigationBar key={`${tabId}-${zIndex}`} zIndex={zIndex} tab={tab} />
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
                  tab={tab}
                  loadResource={this.props.loadResource}
                />
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={tabId}>
              <NavigationBar
                key={`${tabId}-${zIndex}`}
                zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10 + 2}
                tab={tab}
              />
              <DisplayError
                zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10}
                transitoryStates={this.props.transitoryStates}
                lastLoadError={this.props.lastLoadErrors[tabId]}
                tab={tab}
                clearSearchAndLoadError={this.props.clearSearchAndLoadError}
                loadResource={this.props.loadResource}
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
      transitoryStates: fromDapps.getDappsTransitoryStates(state),
      lastLoadErrors: fromDapps.getLastLoadErrors(state),
      dappModals: fromMain.getDappModals(state),
    };
  },
  (dispatch) => {
    return {
      clearSearchAndLoadError: (tabId: string, clearSearch: boolean) =>
        dispatch(fromDapps.clearSearchAndLoadErrorAction({ tabId: tabId, clearSearch: clearSearch })),
      loadResource: (address: string, tabId: string) =>
        dispatch(
          fromDapps.loadResourceAction({
            address: address,
            tabId: tabId,
          })
        ),
    };
  }
)(DappsSandboxedComponent);
