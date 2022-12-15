import * as React from 'react';

import './DisplayError.scss';
import { TransitoryState, Tab, NavigationUrl } from '/models';
import { LoadErrorHtml } from '../utils';

interface DisplayErrorComponentProps {
  transitoryStates: { [tabId: string]: TransitoryState };
  zIndex: number;
  tab: Tab;
  clearLoadError: (tabId: string, clearSearch: boolean) => void;
  loadResource: (url: string, tabId: string) => void;
  navigate: (navigationUrl: NavigationUrl) => void;
}

class DisplayErrorComponent extends React.Component<DisplayErrorComponentProps> {
  el: null | HTMLIFrameElement = null;

  shouldComponentUpdate(nextProps: DisplayErrorComponentProps) {
    if (this.el) {
      this.el.style.zIndex = nextProps.zIndex.toString();
    }

    return true;
  }

  onClear = () => {
    this.props.clearLoadError(this.props.tab.id, true);
  };

  onClearAndNavigate = (path: NavigationUrl) => {
    this.props.clearLoadError(this.props.tab.id, true);
    this.props.navigate(path);
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
    const transitoryState = this.props.tab
      ? this.props.transitoryStates[this.props.tab.id]
      : undefined;

    return (
      <div
        ref={this.setMainEl}
        className={`display-error ${this.props.tab.id} ${
          this.props.tab.lastError ? 'with-error' : ''
        }`}
      >
        {this.props.tab.lastError ? (
          <div className="load-error">
            <div className="message scaling-and-appearing-once">
              <div className="message-body">
                <LoadErrorHtml
                  loadError={this.props.tab.lastError.error}
                  clear={this.onClear}
                  clearAndNavigate={this.onClearAndNavigate}
                />
              </div>
            </div>
          </div>
        ) : undefined}
        {[undefined, 'loading'].includes(transitoryState) && !this.props.tab.lastError ? (
          <div className={`retry ${transitoryState}`}>
            <div
              onClick={(e) => {
                if (transitoryState !== 'loading') {
                  this.props.loadResource(this.props.tab.url, this.props.tab.id);
                }
              }}
            >
              <span>Retry</span>
              <i
                className={`${transitoryState === 'loading' ? 'rotating' : ''} fas fa-redo mr-1`}
                title="Retry"
              />
            </div>
          </div>
        ) : undefined}
      </div>
    );
  }
}

export const DisplayError = DisplayErrorComponent;
