import * as React from 'react';
import xs, { Stream } from 'xstream';
import throttle from 'xstream/extra/throttle';
import debounce from 'xstream/extra/debounce';

import { blockchain as blockchainUtils } from '/utils';
import * as fromDapps from '/store/dapps';
import './NavigationBar.scss';
import { TransitoryState, Tab, LoadCompletedData, SessionItem } from '/models';
import { DappImage } from '../utils';


export interface WithSuggestionsComponentProps {
  resourceLoaded: boolean;
  transitoryState: undefined | TransitoryState;
  tab: undefined | Tab;
  canGoForward: boolean;
  canGoBackward: boolean;
  sessionItem: undefined | SessionItem;
  namesBlockchainId: string;
  appType: 'IP' | 'DA' | undefined;
  url: string | undefined;
  loadState: undefined | LoadCompletedData;
  navigationSuggestionsDisplayed?: boolean;
  zIndex?: number;
  resourceId: string | undefined;
  publicKey: string | undefined;
  chainId: string | undefined;
  showLoadInfos: (resourceId: string, parameters: any) => void;
  isDisplayed?: (a: boolean) => void;
  stopTab: (tabId: string) => void;
  loadResource: (a: fromDapps.LoadResourcePayload) => void;
  updateTabSearch: (a: fromDapps.UpdateTabSearchPayload) => void;
  goForward: (tabId: string) => void;
  goBackward: (tabId: string) => void;
  sendRChainPayment?: (chainId: string, publicKey: string, resourceId: string, hostname: string) => void;
}
export interface WithSuggestionsComponentState {
  pristine: boolean;
  url: undefined | string;
  currentCounter: number;
  lastUpdateTriggeredByUserAction: boolean;
  currentSessionItem: undefined | SessionItem;
}
export class WithSuggestionsComponent extends React.Component<
  WithSuggestionsComponentProps,
  WithSuggestionsComponentState
> {
  constructor(props: WithSuggestionsComponentProps) {
    super(props);
  }

  stream: undefined | Stream<{ url: string | undefined; launch: boolean }>;
  dispatchTabUpdateStream: undefined | Stream<{ tabId: string | undefined; url: string | undefined }>;
  state = {
    pristine: true,
    url: undefined,
    currentCounter: 0,
    lastUpdateTriggeredByUserAction: false,
    currentSessionItem: undefined,
  };
  inputEl: HTMLInputElement | null = null;

  static getDerivedStateFromProps(nextProps: WithSuggestionsComponentProps, prevState: WithSuggestionsComponentState) {
    /*
      Component has just been created
    */
    if (nextProps.tab && typeof prevState.url === 'undefined') {
      let newUrl = nextProps.tab.url;
      if (newUrl.startsWith('https://')) {
        newUrl = newUrl.slice(8);
      }
      return {
        url: newUrl,
        currentCounter: nextProps.tab.counter,
        pristine: true,
        lastUpdateTriggeredByUserAction: false,
        currentSessionItem: nextProps.sessionItem,
      };
      /*
        Tab has been focused
      */
    } else if (nextProps.tab && nextProps.tab.counter > prevState.currentCounter) {
      let newUrl = nextProps.tab.url;
      if (newUrl.startsWith('https://')) {
        newUrl = newUrl.slice(8);
      }
      return {
        url: newUrl,
        currentCounter: nextProps.tab.counter,
        pristine: true,
        lastUpdateTriggeredByUserAction: false,
        currentSessionItem: nextProps.sessionItem,
      };
      /*
        Counter is the same,
        there might be a navigation going on
        OR the user is typing (prevState.lastUpdateTriggeredByUserAction === true)
      */
    } else {
      let newUrl = prevState.url;
      /*
        Probably always true
      */
      if (
        !prevState.lastUpdateTriggeredByUserAction &&
        nextProps.sessionItem &&
        // change the url ONLY IF a navigation is going on (forward/backward)
        nextProps.sessionItem !== prevState.currentSessionItem &&
        nextProps.tab
      ) {
        if (nextProps.sessionItem.url !== newUrl) {
          newUrl = nextProps.sessionItem.url;
          if (newUrl.startsWith('https://')) {
            newUrl = newUrl.slice(8);
          }
        }
      }
      return {
        url: newUrl,
        lastUpdateTriggeredByUserAction: false,
        currentSessionItem: nextProps.sessionItem,
      };
    }
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.stream) {
      this.stream.shamefullySendNext({ url: e.target.value || '', launch: false });
    }
  };

  init = () => {
    this.dispatchTabUpdateStream = xs.create();
    xs.merge(
      this.dispatchTabUpdateStream.compose(throttle(600)),
      this.dispatchTabUpdateStream.compose(debounce(600))
    ).subscribe({
      next: (x) => {
        if (x.tabId && x.url) {
          this.props.updateTabSearch({
            tabId: x.tabId,
            url: x.url,
          });
        }
      },
    });

    this.stream = xs.create();
    this.stream.subscribe({
      next: (e: { url: string | undefined; launch: boolean }) => {
        console.log(e);
        if (e.launch) {
          this.setState({
            url: '',
            pristine: true,
            lastUpdateTriggeredByUserAction: true,
          });

          this.props.loadResource({
            url: e.url as string,
            tabId: this.props.tab ? this.props.tab.id : undefined
          });
          if (this.inputEl) {
            this.inputEl.blur();
          }
        } else {
          // always true
          if (this.dispatchTabUpdateStream) {
            this.dispatchTabUpdateStream.shamefullySendNext({
              tabId: this.props.tab ? this.props.tab.id : undefined,
              url: e.url,
            });
          }
          this.setState({
            url: e.url,
            pristine: this.props.tab ? this.props.tab.url === e.url : false,
            lastUpdateTriggeredByUserAction: true,
          });
        }
      },
    });
  };

  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter' && this.stream) {
      this.stream.shamefullySendNext({ url: this.state.url || '', launch: true });
    }
  };

  onReset = (e: any) => {
    this.setState({
      url: (this.props.tab as Tab).url,
      pristine: true,
    });
  };

  setInputEl = (e: HTMLInputElement) => {
    if (this.inputEl) {
      return;
    }
    this.inputEl = e;
  };
}

export const WithSuggestions = WithSuggestionsComponent;
