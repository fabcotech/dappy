import * as React from 'react';

import { Tab, IpApp, Session, SessionItem, Cookie } from '../../models';
import './DappSandboxed.scss';

interface IpAppSandboxedComponentProps {
  ipApp: IpApp;
  devMode: boolean;
  zIndex: number;
  tab: Tab;
  session: undefined | Session;
  cookies: Cookie[];
  address: string;
}

interface IpAppSandboxedComponentState {
  notInElectronError: undefined | string;
}

export class IpAppSandboxedComponent extends React.Component<
  IpAppSandboxedComponentProps,
  IpAppSandboxedComponentState
> {
  el: null | HTMLIFrameElement = null;
  currentlyRenderingRandomId: undefined | string;
  state = { notInElectronError: undefined };
  currentUrl: undefined | string = undefined;

  shouldComponentUpdate(nextProps: IpAppSandboxedComponentProps, nextState: IpAppSandboxedComponentState) {
    if (this.el) {
      this.el.style.zIndex = nextProps.zIndex.toString();
    }

    if (nextState.notInElectronError && !this.state.notInElectronError) {
      return true;
    }

    if (nextProps.ipApp && nextProps.ipApp.randomId !== this.currentlyRenderingRandomId) {
      this.currentlyRenderingRandomId = nextProps.ipApp.randomId;
      return true;
    }

    return false;
  }

  componentDidMount() {
    if (this.el) {
      this.el.style.zIndex = this.props.zIndex.toString();
    }
  }

  setMainEl = (el: null | HTMLIFrameElement) => {
    this.el = el;
  };

  render() {
    let sessionItem: undefined | SessionItem = undefined;
    if (
      this.props.session &&
      // cursor not at last index
      this.props.session.items.length - 1 !== this.props.session.cursor &&
      this.props.session.items[this.props.session.cursor]
    ) {
      sessionItem = this.props.session.items[this.props.session.cursor];
    }

    const serverIndex = this.props.ipApp.servers.findIndex((s) => s.primary);
    if (serverIndex === -1) {
      // todo handled better: dispatch error
      return (
        <div ref={this.setMainEl} className={`dapp-sandboxed ${this.props.tab.id}`}>
          <div className="not-in-electron-error">
            <p>
              {'Could not find a primary server among the ' +
                this.props.ipApp.servers.length +
                ' servers. Cannot load IP application.'}
            </p>
          </div>
        </div>
      );
    }

    this.currentUrl = `https://${this.props.ipApp.servers[serverIndex].host}`;
    // First check if we are navigating
    if (sessionItem && sessionItem.url) {
      this.currentUrl = sessionItem.url;
      // if not, check if there is a path ex: rchain/alphanetwork/dappy/contact (/contact is the path)
    } else if (this.props.ipApp.path) {
      this.currentUrl = this.currentUrl + this.props.ipApp.path;
      // if not, check if the ipApp has been loaded with a default url
    } else if (this.props.ipApp.url) {
      this.currentUrl = this.props.ipApp.url;
    }

    // first render
    if (!this.currentlyRenderingRandomId) {
      this.currentlyRenderingRandomId = this.props.ipApp.randomId;
    }
    window.dispatchInMain(window.uniqueEphemeralToken, {
      type: '[MAIN] Load or reload browser view',
      payload: {
        currentUrl: this.currentUrl,
        resourceId: this.props.ipApp.id,
        tabId: this.props.tab.id,
        muted: this.props.tab.muted,
        randomId: this.props.ipApp.randomId,
        path: this.props.ipApp.path,
        address: this.props.address,
        servers: this.props.ipApp.servers,
        devMode: this.props.devMode,
        html: undefined,
        title: this.props.ipApp.name,
        cookies: this.props.cookies,
      },
    });

    return (
      <div ref={this.setMainEl} className={`dapp-sandboxed ${this.props.tab.id}`}>
        {this.state.notInElectronError ? (
          <div className="not-in-electron-error">
            <p>{this.state.notInElectronError}</p>
          </div>
        ) : undefined}
      </div>
    );
  }
}

export const IpAppSandboxed = IpAppSandboxedComponent;
