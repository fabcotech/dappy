import * as React from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';

import * as fromDapps from '../../store/dapps';
import * as fromBlockchain from '../../store/blockchain';
import * as fromHistory from '../../store/history';
import * as fromSettings from '../../store/settings';
import './ReactAutoSuggest';
import './NavigationBar.scss';
import { WithSuggestions, getSuggestionValue, renderSuggestion } from './WithSuggestions';

class NavigationBarHomeComponent extends WithSuggestions {
  render() {
    if (!this.stream) {
      this.init();
    }

    const inputProps = {
      placeholder: `Type dappy or ${this.props.namesBlockchainId}/dappy`,
      className: `${this.state.pristine ? 'pristine' : ''} input`,
      value: this.state.search || '',
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
    };

    return (
      <div className={`navigation-bar ${'active'}`}>
        <div className="actions actions-4">
          <div className="disabled">
            <i className="fa fa-arrow-left" />
          </div>
          <div className="disabled">
            <i className="fa fa-arrow-right" />
          </div>
          <div className="disabled">
            <i className="fa fa-stop" />
          </div>
          <div className="disabled">
            <i className="fa fa-redo" />
          </div>
        </div>

        <div className="form">
          <span className="lock-div">
            <i className="fa fa-lock" />
          </span>
          <Autosuggest
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
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
      previews: fromHistory.getPreviews(state),
      recordNames: fromBlockchain.getRecordNamesInAlphaOrder(state),
      appType: undefined,
      resourceLoaded: false,
      transitoryState: undefined,
      tab: undefined,
      resourceId: undefined,
      publicKey: undefined,
      chainId: undefined,
      canGoForward: false,
      canGoBackward: false,
      search: undefined,
      loadState: undefined,
      servers: [],
    };
  },
  (dispatch) => {
    return {
      goForward: () => null,
      goBackward: () => null,
      stopTab: () => null,
      reloadResource: () => null,
      showLoadInfos: () => null,
      updateTabSearch: (a: fromDapps.UpdateTabSearchPayload) => dispatch(fromDapps.updateTabSearchAction(a)),
      loadResource: (a: fromDapps.LoadResourcePayload) => dispatch(fromDapps.loadResourceAction(a)),
    };
  }
)(NavigationBarHomeComponent);
