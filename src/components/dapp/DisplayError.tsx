import * as React from 'react';

import './DisplayError.scss';
import { TransitoryState, Tab, LastLoadError, Cookie } from '/models';
import { LoadErrorHtml } from '../utils';
import { blockchain as blockchainUtils } from '/utils';

interface DisplayErrorComponentProps {
  transitoryStates: { [resourceId: string]: TransitoryState };
  zIndex: number;
  tab: Tab;
  lastLoadError: undefined | LastLoadError;
  clearSearchAndLoadError: (tabId: string, clearSearch: boolean) => void;
  loadResource: (address: string, tabId: string) => void;
}

class DisplayErrorComponent extends React.Component<DisplayErrorComponentProps, DisplayErrorComponentState> {
  el: null | HTMLIFrameElement = null;

  shouldComponentUpdate(nextProps: DisplayErrorComponentProps, nextState: DisplayErrorComponentState) {
    if (this.el) {
      this.el.style.zIndex = nextProps.zIndex.toString();
    }
    if (
      (nextProps.lastLoadError && nextProps.lastLoadError !== this.props.lastLoadError) ||
      (!nextProps.lastLoadError && this.props.lastLoadError)
    ) {
      return true;
    }

    return false;
  }

  onClearSearchAndLoadError = () => {
    this.props.clearSearchAndLoadError(this.props.tab.id, true);
  };

  componentDidMount() {
    if (this.el) {
      this.el.style.zIndex = this.props.zIndex.toString();
    }
  }

  setMainEl = (el: null | HTMLIFrameElement) => {
    this.el = el;
  };

  // we enter in render only when it must be loaded / reloaded
  render() {
    const transitoryState = this.props.tab ? this.props.transitoryStates[this.props.tab.resourceId] : undefined;

    return (
      <div
        ref={this.setMainEl}
        className={`display-error ${this.props.tab.id} ${this.props.lastLoadError ? 'with-error' : ''}`}>
        {!!this.props.lastLoadError ? (
          <div className="load-error">
            <div className="message is-danger scaling-and-appearing-once">
              <div className="message-body">
                <LoadErrorHtml
                  loadError={this.props.lastLoadError.error}
                  clearSearchAndLoadError={this.onClearSearchAndLoadError}
                />
              </div>
            </div>
          </div>
        ) : undefined}
        {!this.props.lastLoadError ? (
          <div className={`retry ${transitoryState}`}>
            <div
              onClick={(e) => {
                if (transitoryState !== 'loading') {
                  this.props.loadResource(
                    blockchainUtils.resourceIdToAddress(this.props.tab.resourceId),
                    this.props.tab.id
                  );
                }
              }}>
              <span>Retry</span>
              <i className={`${transitoryState === 'loading' ? 'rotating' : ''} fa fa-redo fa-before`} title="Retry" />
            </div>
          </div>
        ) : undefined}
      </div>
    );
  }
}

export const DisplayError = DisplayErrorComponent;
