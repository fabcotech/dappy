import * as React from 'react';
import { connect } from 'react-redux';
import { utils } from 'rchain-toolkit';

import { blockchain as blockchainUtils } from '/utils/';
import { WithSuggestions } from './WithSuggestions';
import * as fromDapps from '/store/dapps';
import * as fromCommon from '/common';
import * as fromBlockchain from '/store/blockchain';
import * as fromSettings from '/store/settings';
import * as fromHistory from '/store/history';
import * as fromUi from '/store/ui';
import * as fromMain from '/store/main';
import { Tab, LoadCompletedData } from '/models';
import { State as StoreState } from '/store';
import './NavigationBar.scss';

class NavigationBarComponent extends WithSuggestions {
  onShowLoadInfo = () => {
    if (!this.props.tab || !this.props.resourceLoaded) {
      return;
    }
    this.props.showLoadInfos(this.props.tab.resourceId, {
      resourceId: this.props.tab.resourceId,
      appType: this.props.appType,
      url: this.props.url,
      tabId: this.props.tab.id,
      loadState: this.props.loadState,
      badges: {},
    });
  };

  render() {
    if (!this.stream) {
      this.init();
    }

    const tab = this.props.tab as Tab;
    const loadingOrReloading =
      this.props.transitoryState && ['loading', 'reloading'].includes(this.props.transitoryState);
    return (
      <div style={{ zIndex: this.props.zIndex }} id={tab.id} className={`navigation-bar ${'active'}`}>
        <div className="actions pl-1 pr-1 actions-4">
          <div>
            {this.props.canGoBackward ? (
              <i onClick={(e) => this.props.goBackward(tab.id)} className="fa fa-arrow-left " title="Go backward" />
            ) : (
              <i className="disabled fa fa-arrow-left "></i>
            )}
          </div>
          <div>
            {this.props.canGoForward ? (
              <i onClick={(e) => this.props.goForward(tab.id)} className="fa fa-arrow-right " title="Go forward" />
            ) : (
              <i className="disabled fa fa-arrow-right "></i>
            )}
          </div>
          <div>
            <i onClick={(e) => this.props.stopTab(tab.id)} className="fa fa-stop " title="Stop" />
          </div>
          {this.props.resourceLoaded && !loadingOrReloading ? (
            <div>
              <i
                onClick={(e) => this.props.loadResource({ tabId: tab.id, url: tab.url })}
                className={`fa fa-redo `}
                title="Reload"
              />
            </div>
          ) : (
            <div className={`${loadingOrReloading ? 'disabled' : ''}`}>
              <i
                onClick={(e) => {
                  if (!loadingOrReloading) {
                    this.props.loadResource({
                      url: tab.url,
                      tabId: tab.id,
                    });
                  }
                }}
                className={`${loadingOrReloading ? 'rotating' : ''} fa fa-redo `}
                title="Retry"
              />
            </div>
          )}
        </div>

        <div className={`form pl-1 pr-2 ${this.props.resourceLoaded ? 'with-app-type' : ''}`}>
          {this.props.resourceLoaded ? (
            <div
              className={`lock-div mr-1 with-type resource-loaded`}
              onClick={() => {
                if (this.props.tab) {
                  this.onShowLoadInfo();
                }
              }}>
              <i className="fa fa-lock" />
              <span className="app-type fc">{this.props.appType}</span>
            </div>
          ) : (
            <span className="lock-div">
              <i className="fa fa-lock" />
            </span>
          )}

          <input
            spellCheck="false"
            ref={this.setInputEl}
            placeholder={``}
            className={`${this.state.pristine ? 'pristine' : ''} input`}
            value={this.state.url || ''}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
          />
          <div
            className={`fc tip-div ${this.props.resourceLoaded && this.props.publicKey && this.props.chainId && this.props.resourceId
              ? 'resource-loaded'
              : ''
              }`}>
            {this.props.resourceLoaded && this.props.publicKey && this.props.chainId && this.props.resourceId ? (
              <i
                title="Tip the owner of this app"
                onClick={() => {
                  // always true
                  if (this.props.sendRChainPayment) {
                    this.props.sendRChainPayment(
                      this.props.chainId as string,
                      this.props.publicKey as string,
                      this.props.resourceId as string,
                      new URL(this.props.url as string).hostname
                    );
                  }
                }}
                className="fa fa-money-bill-wave"></i>
            ) : (
              <i title="Tipping unavailable" className="fa fa-money-bill-wave"></i>
            )}
          </div>
          {this.state.pristine ? undefined : (
            <span className="reset" onClick={this.onReset}>
              <i className="fa fa-times" />
            </span>
          )}
        </div>
      </div>
    );
  }
}

export const NavigationBar = connect(
  (state: StoreState, ownProps: { tab: Tab }) => {
    const tab = ownProps.tab;

    const transitoryStates = fromDapps.getDappsTransitoryStates(state);
    let resourceLoaded = false;
    let appType: 'DA' | 'IP' = 'DA';
    let url = undefined;
    let resourceId: string | undefined = '';
    let publicKey: string | undefined = '';
    let chainId: string | undefined = '';
    let loadState: undefined | LoadCompletedData;
    if (tab) {
      const dapp = fromDapps.getDapps(state)[tab.resourceId];
      const ipApp = fromDapps.getIpApps(state)[tab.resourceId];
      const loadedFile = fromDapps.getLoadedFiles(state)[tab.resourceId];
      if (!!dapp) {
        const firstKey = Object.keys(dapp.loadState.completed)[0];
        loadState = dapp.loadState.completed[firstKey];
        resourceLoaded = true;
        resourceId = dapp.id;
        publicKey = dapp.publicKey;
        chainId = dapp.chainId;
        url = dapp.url;
      } else if (!!ipApp) {
        resourceLoaded = !transitoryStates[ipApp.id] || !['loading', 'reloading'].includes(transitoryStates[ipApp.id]);
        appType = 'IP';
        url = ipApp.url;
        resourceId = ipApp.id;
        publicKey = ipApp.publicKey;
        chainId = ipApp.chainId;
      } else if (!!loadedFile) {
        resourceLoaded = true;
        const firstKey = Object.keys(loadedFile.loadState.completed)[0];
        loadState = loadedFile.loadState.completed[firstKey];
        url = loadedFile.url;
        resourceId = loadedFile.id;
        publicKey = loadedFile.publicKey;
        chainId = loadedFile.chainId;
      }
    }

    const sessions = fromHistory.getSessions(state);
    const session = sessions[tab.id];
    let sessionItem = undefined;
    if (session) {
      sessionItem = session.items[session.cursor];
    }

    const namesBlockchain = fromSettings.getNamesBlockchain(state);
    return {
      namesBlockchainId: namesBlockchain ? namesBlockchain.chainId : 'unknown',
      sessionItem: sessionItem,
      resourceLoaded: resourceLoaded,
      appType: appType,
      url: url,
      resourceId: resourceId,
      publicKey: publicKey,
      chainId: chainId,
      loadState: loadState,
      transitoryState: tab ? transitoryStates[tab.resourceId] : undefined,
      canGoForward: fromHistory.getCanGoForward(state),
      canGoBackward: fromHistory.getCanGoBackward(state),
      navigationSuggestionsDisplayed: fromUi.getNavigationSuggestionsDisplayed(state),
      tab: tab,
    };
  },
  (dispatch, ownProps) => {
    return {
      isDisplayed: (a: boolean) =>
        dispatch(fromUi.updateNavigationSuggestinsDisplayAction({ navigationSUggestionsDisplayed: a })),
      stopTab: (tabId: string) => dispatch(fromDapps.stopTabAction({ tabId: tabId })),
      showLoadInfos: (resourceId: string, parameters: any) =>
        dispatch(
          fromMain.openDappModalAction({
            title: 'LOAD_INFO_MODAL',
            parameters: parameters,
            text: '',
            buttons: [],
            resourceId: resourceId,
          })
        ),
      loadResource: (a: fromDapps.LoadResourcePayload) => dispatch(fromDapps.loadResourceAction(a)),
      updateTabSearch: (a: fromDapps.UpdateTabSearchPayload) => dispatch(fromDapps.updateTabSearchAction(a)),
      goForward: (tabId: string) => dispatch(fromHistory.goForwardAction({ tabId: tabId })),
      goBackward: (tabId: string) => dispatch(fromHistory.goBackwardAction({ tabId: tabId })),
      sendRChainPayment: (chainId: string, publicKey: string, resourceId: string, address: string) => {
        let revAddress;
        try {
          revAddress = utils.revAddressFromPublicKey(publicKey);
        } catch (err) {
          dispatch(
            fromMain.openDappModalAction({
              title: 'Failed to tip',
              parameters: {},
              text: 'Could not get REV address from public key ' + publicKey,
              buttons: [],
              resourceId: resourceId,
            })
          );
          return;
        }
        const parameters: fromCommon.RChainPaymentRequestParameters = {
          from: undefined,
          to: revAddress,
          amount: undefined,
        };
        dispatch(
          fromMain.openDappModalAction({
            title: 'PAYMENT_REQUEST_MODAL',
            text: `tip ${address}`,
            parameters: {
              parameters: parameters,
              chainId: chainId,
              resourceId: resourceId,
              origin: { origin: 'transfer' },
            },
            buttons: [],
            resourceId: resourceId,
          })
        );
      },
    };
  }
)(NavigationBarComponent);
