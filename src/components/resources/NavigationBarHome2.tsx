import * as React from 'react';
import { connect } from 'react-redux';

import * as fromDapps from '/store/dapps';
import * as fromSettings from '/store/settings';
import { WithSuggestions } from './WithSuggestions';

import './NavigationBarHome.scss';

class NavigationBarHome2Component extends WithSuggestions {
  render() {
    if (!this.stream) {
      this.init();
    }

    return (
      <div className={`navigation-bar-home ${'active'}`}>
        <div className="form">
          <input
            spellCheck="false"
            ref={this.setInputEl}
            placeholder={
              this.props.namesBlockchainId ? `dappy.${this.props.namesBlockchainId}` : 'dappy.d'
            }
            className={`${this.state.pristine ? 'pristine' : ''} input`}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            aria-label="address"
          ></input>
        </div>
      </div>
    );
  }
}

export const NavigationBarHome2 = connect(
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
      updateTabSearch: (a: fromDapps.UpdateTabSearchPayload) =>
        dispatch(fromDapps.updateTabSearchAction(a)),
      loadResource: (a: fromDapps.LoadResourcePayload) => dispatch(fromDapps.loadResourceAction(a)),
    };
  }
)(NavigationBarHome2Component);
