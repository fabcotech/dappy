import * as React from 'react';
import { connect } from 'react-redux';

import './Resources.scss';
import * as fromDapps from '/store/dapps';
import * as fromMain from '/store/main';
import { TransitoryState, Tab } from '/models';
import { DisplayError, NavigationBar } from '.';
import { Modal } from '../utils';

interface ResourcesComponentProps {
  focusedTabId: string | undefined;
  activeTabs: { [tabId: string]: Tab };
  dappModals: { [resourceId: string]: fromMain.Modal[] };
  tabsFocusOrder: string[];
  transitoryStates: { [resourceId: string]: TransitoryState };
  clearSearchAndLoadError: (tabId: string, clearSearch: boolean) => void;
  loadResource: (address: string, tabId: string) => void;
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
                <NavigationBar
                  key={`${tabId}-${zIndex}`}
                  zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10 + 2}
                  tab={tab}
                />
                <DisplayError
                  zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10}
                  transitoryStates={this.props.transitoryStates}
                  tab={tab}
                  clearSearchAndLoadError={this.props.clearSearchAndLoadError}
                  loadResource={this.props.loadResource}
                />
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={tabId}>
              <NavigationBar key={`${tabId}-${zIndex}`} zIndex={zIndex} tab={tab} />
              <DisplayError
                zIndex={(this.props.tabsFocusOrder.indexOf(tabId) + 1) * 10}
                transitoryStates={this.props.transitoryStates}
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
      clearSearchAndLoadError: (tabId: string, clearSearch: boolean) =>
        dispatch(fromDapps.clearSearchAndLoadErrorAction({ tabId, clearSearch })),
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
