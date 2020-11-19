import * as React from 'react';
import xs, { Stream } from 'xstream';
import throttle from 'xstream/extra/throttle';
import debounce from 'xstream/extra/debounce';

import { blockchain as blockchainUtils } from '../../utils';
import { validateSearch } from '../../utils/validateSearch';
import { searchToAddress } from '../../utils/searchToAddress';
import * as fromDapps from '../../store/dapps';
import './ReactAutoSuggest';
import './NavigationBar.scss';
import { TransitoryState, Tab, Preview, IPServer, LoadCompletedData, SessionItem } from '../../models';
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
  recordBadges: undefined | { [name: string]: { [name: string]: string }};
  showLoadInfos: (resourceId: string, parameters: any) => void;
  isDisplayed?: (a: boolean) => void;
  stopTab: (tabId: string) => void;
  reloadResource: (tabId: string) => void;
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
  el: null | HTMLDivElement = null;
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

  getSuggestions = (value: string) => {
    if (!value) {
      return [];
    }

    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) {
      return [];
    }

    // Suggestions from previews
    let suggestions = Object.keys(this.props.previews)
      .filter((searchOrUrl) => {
        return (
          searchOrUrl.indexOf(inputValue) !== -1 || this.props.previews[searchOrUrl].title.indexOf(inputValue) !== -1
        );
      })
      .slice(0, 12)
      .map((previewId) => {
        const sugg = this.props.previews[previewId];
        return {
          id: previewId,
          search: sugg.search || '',
          preview: this.props.previews[previewId],
        };
      });

    // Add suggestions from record names
    if (suggestions.length < 12) {
      suggestions = suggestions.concat(
        this.props.recordNames
          .filter((r) => !suggestions.find((s) => s.id === r))
          .filter((r) => r.toLowerCase().slice(0, inputLength) === inputValue)
          .slice(0, 12 - suggestions.length)
          .map((name) => {
            return {
              id: name,
              search: name,
              preview: this.props.previews[searchToAddress(name, this.props.namesBlockchainId)],
            };
          })
      );
    }

    return suggestions;
  };

  onSuggestionsFetchRequested = (a: { value: string }) => {
    const suggestions = this.getSuggestions(a.value);
    const displayed = suggestions.length > 0;
    if (this.props.isDisplayed && this.props.navigationSuggestionsDisplayed !== displayed) {
      this.props.isDisplayed(displayed);
    }
    this.setState({
      suggestions: suggestions,
    });
  };

  onSuggestionsClearRequested = () => {
    if (this.props.isDisplayed && this.props.navigationSuggestionsDisplayed) {
      this.props.isDisplayed(false);
    }
    this.setState({
      suggestions: [],
    });
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>, x: any) => {
    if (this.stream) {
      this.stream.shamefullySendNext({ search: x.newValue || '', launch: false });
    }
  };

  init = () => {
    this.dispatchTabUpdateStream = xs.create();
    xs.merge(
      this.dispatchTabUpdateStream.compose(throttle(600)),
      this.dispatchTabUpdateStream.compose(debounce(600))
    ).subscribe({
      next: (x) => {
        if (x.tabId) {
          this.props.updateTabSearch({
            tabId: x.tabId,
            search: x.search || '',
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
            search: s,
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

  onKeyDown = (e: KeyboardEvent<any>) => {
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

  setEl = (e: HTMLDivElement) => {
    if (this.inputEl) {
      return;
    }
    this.el = e;
    const qs = e.querySelector('.react-autosuggest__container');
    if (qs) {
      this.inputEl = qs.querySelector('input');
    }
  };
}

export const WithSuggestions = WithSuggestionsComponent;
