import * as React from 'react';
import { connect } from 'react-redux';

import { WithSuggestions } from './WithSuggestions';
import * as fromDapps from '/store/dapps';
import * as fromSettings from '/store/settings';
import * as fromUi from '/store/ui';
import * as fromMain from '/store/main';
import { Tab } from '/models';
import { State as StoreState } from '/store';
import './NavigationBar2.scss';
import locked_gold from '/images/locked_gold.png';
import locked_grey from '/images/locked_grey.png';
import { dispatchInMain } from '/interProcess';

class NavigationBar2Component extends WithSuggestions {
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
      <div
        style={{ zIndex: this.props.zIndex }}
        id={tab.id}
        className={`navigation-bar ${'active'}`}
      >
        <div className="actions pl-1 pr-1 actions-4">
          <div>
            {this.props.tab && this.props.tab.canGoBackward ? (
              <i
                onClick={(e) => this.props.goBackward(tab.id)}
                className="fas fa-arrow-left "
                title="Go backward"
              />
            ) : (
              <i className="disabled fas fa-arrow-left"></i>
            )}
          </div>
          <div>
            {this.props.tab && this.props.tab.canGoForward ? (
              <i
                onClick={(e) => this.props.goForward(tab.id)}
                className="fas fa-arrow-right "
                title="Go forward"
              />
            ) : (
              <i className="disabled fas fa-arrow-right"></i>
            )}
          </div>
          {this.props.tab && this.props.tab.favorite ? (
            <button className="nb-button" onClick={(e) => this.props.stopTab(tab.id)}>
              <i className="fas fa-stop" title="stop" />
            </button>
          ) : (
            <button
              className="nb-button"
              onClick={() => {
                this.props.stopTab(tab.id);
                this.props.removeTab(tab.id);
              }}
            >
              <i className="fas fa-times" title="close" />
            </button>
          )}

          <button
            className="nb-button"
            onClick={() => this.props.loadResource({ tabId: tab.id, url: tab.url })}
          >
            <i className={`fas fa-redo ${loadingOrReloading ? 'rotating' : ''}`} title="Reload" />
          </button>
        </div>

        <div className={`form pl-1 pr-2 ${this.props.resourceLoaded ? 'with-app-type' : ''}`}>
          {this.props.resourceLoaded ? (
            <div
              className="lock-div mr-1 resource-loaded"
              onClick={() => {
                if (this.props.tab) {
                  this.onShowLoadInfo();
                }
              }}
            >
              {this.props.tab && this.props.tab.data && this.props.tab.data.isDappyNameSystem ? (
                <img className="lock" src={locked_gold}></img>
              ) : (
                <img className="lock" src={locked_grey}></img>
              )}
            </div>
          ) : (
            <div className="lock-div"></div>
          )}

          <input
            spellCheck="false"
            ref={this.setInputEl}
            placeholder=""
            className={`${this.state.pristine ? 'pristine' : ''} input`}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
          />
        </div>
      </div>
    );
  }
}

export const NavigationBar2 = connect(
  (state: StoreState, ownProps: { tab: Tab }) => {
    const tab = ownProps.tab;

    const transitoryStates = fromDapps.getDappsTransitoryStates(state);
    let resourceLoaded = false;
    let appType: 'DA' | 'IP' = 'IP';
    let url;
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
        resourceLoaded =
          !transitoryStates[tab.id] || !['loading', 'reloading'].includes(transitoryStates[tab.id]);
      }
    }

    const namesBlockchain = fromSettings.getNamesBlockchain(state);
    return {
      namesBlockchainId: namesBlockchain ? namesBlockchain.chainId : 'unknown',
      resourceLoaded,
      appType,
      url,
      transitoryState: tab ? transitoryStates[tab.id] : undefined,
      navigationSuggestionsDisplayed: fromUi.getNavigationSuggestionsDisplayed(state),
      tab,
    };
  },
  (dispatch) => {
    return {
      isDisplayed: (a: boolean) =>
        dispatch(
          fromUi.updateNavigationSuggestinsDisplayAction({ navigationSUggestionsDisplayed: a })
        ),
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
      updateTabSearch: (a: fromDapps.UpdateTabSearchPayload) =>
        dispatch(fromDapps.updateTabSearchAction(a)),
      goForward: (tabId: string) => {
        dispatchInMain({
          type: '[MAIN] Go forward',
          payload: { tabId },
        });
      },
      goBackward: (tabId: string) => {
        dispatchInMain({
          type: '[MAIN] Go backward',
          payload: { tabId },
        });
      },
    };
  }
)(NavigationBar2Component);
