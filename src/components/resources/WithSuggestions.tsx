import React, { Component } from 'react';
import xs, { Stream } from 'xstream';
import throttle from 'xstream/extra/throttle';
import debounce from 'xstream/extra/debounce';

import * as fromDapps from '/store/dapps';
import './NavigationBar2.scss';
import { TransitoryState, Tab } from '/models';

export interface WithSuggestionsComponentProps {
  resourceLoaded: boolean;
  transitoryState: undefined | TransitoryState;
  tab: undefined | Tab;
  canGoForward: boolean;
  canGoBackward: boolean;
  namesBlockchainId: string;
  appType: 'IP' | 'DA' | undefined;
  url: string | undefined;
  navigationSuggestionsDisplayed?: boolean;
  zIndex?: number;
  showLoadInfos: (tabId: string, parameters: any) => void;
  isDisplayed?: (a: boolean) => void;
  stopTab: (tabId: string) => void;
  removeTab: (tabId: string) => void;
  loadResource: (a: fromDapps.LoadResourcePayload) => void;
  updateTabSearch: (a: fromDapps.UpdateTabSearchPayload) => void;
  goForward: (tabId: string) => void;
  goBackward: (tabId: string) => void;
}
export interface WithSuggestionsComponentState {
  pristine: boolean;
}
export class WithSuggestionsComponent extends Component<
  WithSuggestionsComponentProps,
  WithSuggestionsComponentState
> {
  stream: undefined | Stream<{ url: string | undefined; launch: boolean }>;

  dispatchTabUpdateStream:
    | undefined
    | Stream<{ tabId: string | undefined; url: string | undefined }>;

  state = {
    pristine: true,
  };

  static defaultProps = {
    canGoBackward: false,
    canGoForward: false,
  };

  inputEl: HTMLInputElement | null = null;

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.stream) {
      this.stream.shamefullySendNext({ url: e.target.value || '', launch: false });
    }
  };

  init = () => {
    this.dispatchTabUpdateStream = xs.create();
    this.stream = xs.create();
    this.stream.subscribe({
      next: (e: { url: string | undefined; launch: boolean }) => {
        if (e.launch) {
          this.setState({
            pristine: true,
          });
          console.log('if navigation bar and same host, must navigate instead of load resource');

          this.props.loadResource({
            url: e.url as string,
            tabId: this.props.tab ? this.props.tab.id : undefined,
          });
          if (this.inputEl) {
            this.inputEl.blur();
            this.inputEl.value = '';
          }
        } else {
          this.setState({
            pristine: this.props.tab ? this.props.tab.url === e.url : false,
          });
        }
      },
    });
  };

  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && this.stream) {
      this.stream.shamefullySendNext({
        url: (this.inputEl as HTMLInputElement).value || '',
        launch: true,
      });
    }
  };

  setInputEl = (e: HTMLInputElement) => {
    const tabId = this.props.tab ? this.props.tab.id : 'home';
    if (!window.inputEls[tabId]) {
      window.inputEls[tabId] = e;
    }
    if (this.inputEl) {
      return;
    }
    this.inputEl = e;
  };
}

export const WithSuggestions = WithSuggestionsComponent;
