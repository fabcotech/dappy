import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './Resources.scss';
import * as fromDapps from '/store/dapps';
import * as fromMain from '/store/main';
import * as fromUi from '/store/ui';
import { TransitoryState, Tab, NavigationUrl } from '/models';
import { DisplayError, NavigationBar2 } from '.';
import { Modal } from '../utils';

interface ResourcesComponentProps {
  focusedTabId: string | undefined;
  activeTabs: { [tabId: string]: Tab };
  dappModals: { [resourceId: string]: fromMain.Modal[] };
  tabsFocusOrder: string[];
  transitoryStates: { [resourceId: string]: TransitoryState };
  clearLoadError: (tabId: string, clearSearch: boolean) => void;
  loadResource: (address: string, tabId: string) => void;
  navigate: (navigationUrl: NavigationUrl) => void;
}

class ResourcesComponent extends React.Component<ResourcesComponentProps, {}> {
  render() {
    return (
      <div className={`resources ${this.props.focusedTabId ? '' : 'hidden'}`}>
        {Object.keys(this.props.activeTabs).map((tabId, index) => {
          const tab = this.props.activeTabs[tabId];
          if (this.props.dappModals[tab.id] && this.props.dappModals[tab.id][0]) {
            /*
              If there is a modal, the modal will be at DisplayError z index + 1
              display is the following: dapp1 10, dapp1NavigationBar 12,
              dapp2 20, dapp2Modal 21, dapp2NavigationBar 22,
              dapp3 30, dapp3Modal 31, dapp3NavigationBar 32 etc...
            */
            return (
              <div
                key={tab.id}
                style={{ zIndex: (this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10 + 1 }}
                className="dapp-modal"
              >
                <Modal tabId={tab.id} />
              </div>
            );
          }

          return undefined;
        })}
        {Object.keys(this.props.activeTabs).map((tabId, index) => {
          const tab = this.props.activeTabs[tabId];
          const zIndex = (this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10 + 2;

          if (tab.lastError) {
            return (
              <React.Fragment key={tabId}>
                <NavigationBar2
                  key={`${tabId}-${zIndex}`}
                  zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10 + 2}
                  tab={tab}
                />
                <DisplayError
                  zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10}
                  transitoryStates={this.props.transitoryStates}
                  tab={tab}
                  clearLoadError={this.props.clearLoadError}
                  navigate={this.props.navigate}
                  loadResource={this.props.loadResource}
                />
              </React.Fragment>
            );
          }

          return (
            <Fragment key={tabId}>
              <NavigationBar2 key={`${tabId}-${zIndex}`} zIndex={zIndex} tab={tab} />
              <DisplayError
                zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10}
                transitoryStates={this.props.transitoryStates}
                tab={tab}
                navigate={this.props.navigate}
                clearLoadError={this.props.clearLoadError}
                loadResource={this.props.loadResource}
              />
            </Fragment>
          );
        })}
      </div>
    );
  }
}

export const Resources = connect(
  (state) => {
    return {
      focusedTabId: fromDapps.getFocusedTabId(state),
      activeTabs: fromDapps.getActiveTabs(state),
      tabsFocusOrder: fromDapps.getTabsFocusOrder(state),
      transitoryStates: fromDapps.getDappsTransitoryStates(state),
      dappModals: fromMain.getDappModals(state),
    };
  },
  (dispatch) => {
    return {
      navigate: (navigationUrl: NavigationUrl) =>
        dispatch(fromUi.navigateAction({ navigationUrl: navigationUrl })),
      clearLoadError: (tabId: string, clearSearch: boolean) =>
        dispatch(fromDapps.clearLoadErrorAction({ tabId, clearSearch })),
      loadResource: (url: string, tabId: string) =>
        dispatch(
          fromDapps.loadResourceAction({
            url,
            tabId,
          })
        ),
    };
  }
)(ResourcesComponent);
