import * as React from 'react';
import xs, { Stream } from 'xstream';
import throttle from 'xstream/extra/throttle';
import debounce from 'xstream/extra/debounce';

import { blockchain as blockchainUtils } from '/utils';
import { validateSearch } from '/utils/validateSearch';
import { searchToAddress } from '/utils/searchToAddress';
import * as fromDapps from '/store/dapps';
import './NavigationBar.scss';
import { TransitoryState, Tab, Preview, IPServer, LoadCompletedData, SessionItem } from '/models';
import { DappImage } from '../utils';

interface Sugg {
  id: string;
  search: string;
  url?: string;
  preview?: Preview;
}

export const getSuggestionValue = (suggestion: Sugg) => suggestion.search;

export const renderSuggestion = (suggestion: Sugg) => {
  return (
    <div className="suggestion-item">
      <div className="suggestion-image">
        {suggestion.preview ? (
          <DappImage
            small
            id={suggestion.preview.search}
            img={suggestion.preview.img}
            title={suggestion.preview.title}
            transitoryState={undefined}
          />
        ) : (
          <i className="fa fa-search"></i>
        )}
      </div>
      {suggestion.preview ? <div className="suggestion-title">{suggestion.preview.title}</div> : undefined}
      <div className="suggestion-search">
        {suggestion.preview ? suggestion.preview.search : suggestion.url || suggestion.id}
      </div>
    </div>
  );
};

export interface WithSuggestionsComponentProps {
  resourceLoaded: boolean;
  transitoryState: undefined | TransitoryState;
  tab: undefined | Tab;
  recordNames: string[];
  canGoForward: boolean;
  canGoBackward: boolean;
  previews: { [search: string]: Preview };
  sessionItem: undefined | SessionItem;
  namesBlockchainId: string;
  appType: 'IP' | 'DA' | undefined;
  servers: IPServer[] | undefined;
  address: string | undefined;
  search: string | undefined;
  loadState: undefined | LoadCompletedData;
  navigationSuggestionsDisplayed?: boolean;
  zIndex?: number;
  resourceId: string | undefined;
  publicKey: string | undefined;
  chainId: string | undefined;
  recordBadges: undefined | { [name: string]: { [name: string]: string } };
  showLoadInfos: (resourceId: string, parameters: any) => void;
  isDisplayed?: (a: boolean) => void;
  stopTab: (tabId: string) => void;
  loadResource: (a: fromDapps.LoadResourcePayload) => void;
  updateTabSearch: (a: fromDapps.UpdateTabSearchPayload) => void;
  goForward: (tabId: string) => void;
  goBackward: (tabId: string) => void;
  sendRChainPayment?: (chainId: string, publicKey: string, resourceId: string, address: string) => void;
}
export interface WithSuggestionsComponentState {
  pristine: boolean;
  search: undefined | string;
  suggestions: Sugg[];
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

  stream: undefined | Stream<{ search: string | undefined; launch: boolean }>;
  dispatchTabUpdateStream: undefined | Stream<{ tabId: string | undefined; search: string | undefined }>;
  state = {
    pristine: true,
    search: undefined,
    suggestions: [],
    currentCounter: 0,
    lastUpdateTriggeredByUserAction: false,
    currentSessionItem: undefined,
  };
  inputEl: HTMLInputElement | null = null;

  static getDerivedStateFromProps(nextProps: WithSuggestionsComponentProps, prevState: WithSuggestionsComponentState) {
    /*
      Component has just been created
    */
    if (nextProps.tab && typeof prevState.search === 'undefined') {
      return {
        search: nextProps.tab.address,
        currentCounter: nextProps.tab.counter,
        pristine: true,
        lastUpdateTriggeredByUserAction: false,
        currentSessionItem: nextProps.sessionItem,
      };
      /*
        Tab has been focused
      */
    } else if (nextProps.tab && nextProps.tab.counter > prevState.currentCounter) {
      return {
        search: nextProps.tab.address,
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
      let search = prevState.search;
      /*
        Probably always true
      */
      if (
        !prevState.lastUpdateTriggeredByUserAction &&
        nextProps.sessionItem &&
        // change the search ONLY IF a navigation is going on (forward/backward)
        nextProps.sessionItem !== prevState.currentSessionItem &&
        nextProps.tab
      ) {
        if (nextProps.sessionItem.address !== search) {
          search = nextProps.sessionItem.address;
        }
      }
      return {
        search: search,
        lastUpdateTriggeredByUserAction: false,
        currentSessionItem: nextProps.sessionItem,
      };
    }
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.stream) {
      this.stream.shamefullySendNext({ search: e.target.value || '', launch: false });
    }
  };

  init = () => {
    this.dispatchTabUpdateStream = xs.create();
    xs.merge(
      this.dispatchTabUpdateStream.compose(throttle(600)),
      this.dispatchTabUpdateStream.compose(debounce(600))
    ).subscribe({
      next: (x) => {
        if (x.tabId && x.search) {
          this.props.updateTabSearch({
            tabId: x.tabId,
            search: x.search,
          });
        }
      },
    });

    this.stream = xs.create();
    this.stream.subscribe({
      next: (e: { search: string | undefined; launch: boolean }) => {
        let s = e.search;

        if (e.launch) {
          if (!validateSearch(s || '') && !/^\w[a-z]*\/\w[a-z0-9,-.]*$/gs.test(s || '')) {
            s = searchToAddress(s as string, this.props.namesBlockchainId);
          }

          this.setState({
            search: '',
            pristine: true,
            lastUpdateTriggeredByUserAction: true,
          });

          this.props.loadResource({
            address: s as string,
            tabId: this.props.tab ? this.props.tab.id : undefined,
            url: undefined,
          });
          if (this.inputEl) {
            this.inputEl.blur();
          }
        } else {
          // always true
          if (this.dispatchTabUpdateStream) {
            this.dispatchTabUpdateStream.shamefullySendNext({
              tabId: this.props.tab ? this.props.tab.id : undefined,
              search: s,
            });
          }
          this.setState({
            search: s,
            pristine: this.props.tab ? blockchainUtils.resourceIdToAddress(this.props.tab.resourceId) === s : false,
            lastUpdateTriggeredByUserAction: true,
          });
        }
      },
    });
  };

  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter' && this.stream) {
      this.stream.shamefullySendNext({ search: this.state.search || '', launch: true });
    }
  };

  onReset = (e: any) => {
    this.setState({
      search: blockchainUtils.resourceIdToAddress((this.props.tab as Tab).resourceId),
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