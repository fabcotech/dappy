import * as React from 'react';

import './DappSandboxed.scss';
import { Dapp, TransitoryState, Tab, LastLoadError, Cookie } from '../../models';
import { LoadErrorHtml } from '../utils';
import { blockchain as blockchainUtils } from '../../utils/';

interface DappSandboxedComponentProps {
  dapp: undefined | Dapp;
  transitoryStates: { [resourceId: string]: TransitoryState };
  zIndex: number;
  devMode: boolean;
  tab: Tab;
  lastLoadError: undefined | LastLoadError;
  cookies: Cookie[];
  address: string;
  clearSearchAndLoadError: (tabId: string, clearSearch: boolean) => void;
  loadResource: (address: string, tabId: string) => void;
}

interface DappSandboxedComponentState {
  notInElectronError: undefined | string;
}

class DappSandboxedComponent extends React.Component<DappSandboxedComponentProps, DappSandboxedComponentState> {
  el: null | HTMLIFrameElement = null;
  currentlyRenderingRandomId: undefined | string;
  state = { notInElectronError: undefined };

  shouldComponentUpdate(nextProps: DappSandboxedComponentProps, nextState: DappSandboxedComponentState) {
    if (this.el) {
      this.el.style.zIndex = nextProps.zIndex.toString();
    }
    if (
      (nextProps.lastLoadError && nextProps.lastLoadError !== this.props.lastLoadError) ||
      (!nextProps.lastLoadError && this.props.lastLoadError)
    ) {
      return true;
    }
    if (nextState.notInElectronError && !this.state.notInElectronError) {
      return true;
    }

    if (nextProps.dapp && nextProps.dapp.randomId !== this.currentlyRenderingRandomId) {
      this.currentlyRenderingRandomId = nextProps.dapp.randomId;
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

    if (!this.props.lastLoadError && !!this.props.dapp) {
      window.dispatchInMain(window.uniqueEphemeralToken, {
        type: '[MAIN] Load or reload browser view',
        payload: {
          currentUrl: `dist/dapp-sandboxed.html`,
          resourceId: this.props.dapp.id,
          tabId: this.props.tab.id,
          muted: this.props.tab.muted,
          randomId: this.props.dapp.randomId,
          path: this.props.dapp.path,
          title: this.props.dapp.title,
          address: this.props.address,
          devMode: this.props.devMode,
          servers: [],
          html: this.props.dapp.html,
          cookies: this.props.cookies
        },
      });
    }

    return (
      <div
        ref={this.setMainEl}
        className={`dapp-sandboxed ${this.props.tab.id} ${this.props.lastLoadError ? 'with-error' : ''}`}>
        {this.state.notInElectronError ? (
          <div className="not-in-electron-error">
            <p>{this.state.notInElectronError}</p>
          </div>
        ) : undefined}
        {this.props.lastLoadError ? (
          <div className="load-error">
            <div className="message is-danger">
              <div className="message-body scaling-and-appearing-once">
                <LoadErrorHtml
                  loadError={this.props.lastLoadError.error}
                  clearSearchAndLoadError={this.onClearSearchAndLoadError}
                />
              </div>
            </div>
          </div>
        ) : undefined}
        {!this.props.lastLoadError && !this.props.dapp ? (
          <div className="retry">
            <div
              onClick={(e) =>
                this.props.loadResource(
                  blockchainUtils.resourceIdToAddress(this.props.tab.resourceId),
                  this.props.tab.id
                )
              }>
              <span>Retry</span>
              <i className={`${transitoryState === 'loading' ? 'rotating' : ''} fa fa-redo fa-before`} title="Retry" />
            </div>
          </div>
        ) : undefined}
      </div>
    );
  }
}

export const DappSandboxed = DappSandboxedComponent;
