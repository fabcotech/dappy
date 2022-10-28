import * as React from 'react';
import { connect } from 'react-redux';

import { WithSuggestions } from './WithSuggestions';
import * as fromDapps from '/store/dapps';
import * as fromSettings from '/store/settings';
import * as fromHistory from '/store/history';
import * as fromUi from '/store/ui';
import * as fromMain from '/store/main';
import { Tab } from '/models';
import { State as StoreState } from '/store';
import './NavigationBar.scss';

class NavigationBarComponent extends WithSuggestions {
  onShowLoadInfo = () => {
    if (!this.props.tab || !this.props.resourceLoaded) {
      return;
    }
    this.props.showLoadInfos(this.props.tab.id, {
      tab: this.props.tab,
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
            {this.props.tab && this.props.tab.favorite ? (
              <i onClick={(e) => this.props.stopTab(tab.id)} className="fa fa-stop " title="Stop" />
            ) : (
              <i
                onClick={(e) => {
                  this.props.stopTab(tab.id);
                  this.props.removeTab(tab.id);
                }}
                className="fa fa-times "
                title="Close"
              />
            )}
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
    let appType: 'DA' | 'IP' = 'IP';
    let url = undefined;
    if (tab) {
      url = tab.url;
      try {
        if (tab.url && tab.data.html) {
          appType = 'DA';
        }
      } catch (err) {
        // url is invalid
      }
      if (appType === 'DA') {
        resourceLoaded = true;
      } else {
        resourceLoaded = !transitoryStates[tab.id] || !['loading', 'reloading'].includes(transitoryStates[tab.id]);
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
      transitoryState: tab ? transitoryStates[tab.id] : undefined,
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
      removeTab: (tabId: string) => dispatch(fromDapps.removeTabAction({ tabId: tabId })),
      showLoadInfos: (tabId: string, parameters: any) =>
        dispatch(
          fromMain.openDappModalAction({
            title: 'LOAD_INFO_MODAL',
            parameters: parameters,
            text: '',
            buttons: [],
            tabId: tabId,
          })
        ),
      loadResource: (a: fromDapps.LoadResourcePayload) => dispatch(fromDapps.loadResourceAction(a)),
      updateTabSearch: (a: fromDapps.UpdateTabSearchPayload) => dispatch(fromDapps.updateTabSearchAction(a)),
      goForward: (tabId: string) => dispatch(fromHistory.goForwardAction({ tabId: tabId })),
      goBackward: (tabId: string) => dispatch(fromHistory.goBackwardAction({ tabId: tabId })),
    };
  }
)(NavigationBarComponent);