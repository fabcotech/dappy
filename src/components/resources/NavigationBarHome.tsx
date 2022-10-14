import * as React from 'react';
import { connect } from 'react-redux';

import * as fromDapps from '/store/dapps';
import * as fromSettings from '/store/settings';
import { WithSuggestions } from './WithSuggestions';

import './NavigationBar.scss';

class NavigationBarHomeComponent extends WithSuggestions {
  render() {
    if (!this.stream) {
      this.init();
    }

    return (
      <div className={`navigation-bar ${'active'}`}>
        <div className="actions pl-1 pr-1 actions-4">
          <div className="disabled">
            <i className="fa fa-arrow-left" />
          </div>
          <div className="disabled">
            <i className="fa fa-arrow-right" />
          </div>
          <div className="disabled">
            <i className="fa fa-times" />
          </div>
          <div className="disabled">
            <i className="fa fa-redo" />
          </div>
        </div>

        <div className="form pl-1 pr-2">
          <span className="lock-div">
            <i className="fa fa-lock" />
          </span>
          <input
            spellCheck="false"
            ref={this.setInputEl}
            placeholder={``}
            className={`${this.state.pristine ? 'pristine' : ''} input`}
            value={this.state.url || ''}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            aria-label="address"></input>
        </div>
      </div>
    );
  }
}

export const NavigationBarHome = connect(
  (state) => {
    const namesBlockchain = fromSettings.getNamesBlockchain(state);

    return {
      namesBlockchainId: namesBlockchain ? namesBlockchain.chainId : 'unknown',
      sessionItem: undefined,
      appType: undefined,
      resourceLoaded: false,
      transitoryState: undefined,
      tab: undefined,
      canGoForward: false,
      canGoBackward: false,
      search: undefined,
      loadState: undefined,
      url: undefined,
    };
  },
  (dispatch) => {
    return {
      goForward: () => null,
      goBackward: () => null,
      stopTab: () => null,
      removeTab: () => null,
      showLoadInfos: () => null,
      updateTabSearch: (a: fromDapps.UpdateTabSearchPayload) => dispatch(fromDapps.updateTabSearchAction(a)),
      loadResource: (a: fromDapps.LoadResourcePayload) => dispatch(fromDapps.loadResourceAction(a)),
    };
  }
)(NavigationBarHomeComponent);
