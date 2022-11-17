import * as React from 'react';
import { Tab } from '/models';

interface TabActionsProps {
  tab: Tab;
  removeTab: () => void;
  reloadTab: () => void;
  onSetMuteTab: (tabId: string, a: boolean) => void;
  onSetFavoriteTab: (tabId: string, a: boolean) => void;
}

export class TabActions extends React.Component<TabActionsProps, {}> {
  state = {
    active: false,
  };

  el: HTMLDivElement | undefined = undefined;

  componentDidMount() {
    document.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClick);
  }

  onReloadResource = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.reloadTab();
    //this.onToggle();
  };

  onToggle = (e?: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!this.state.active) {
      this.setState({
        active: true,
      });
    }
  };

  onClick = (e: MouseEvent) => {
    if (!this.el) {
      return;
    }
    if (
      this.state.active &&
      this.el.parentElement &&
      !this.el.parentElement.querySelector(':hover')
    ) {
      this.setState({
        active: false,
      });
    }
  };

  setEl = (el: HTMLDivElement) => {
    if (!this.el) {
      this.el = el;
    }
  };

  render() {
    return (
      <div className={`dropdown ${this.state.active ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <i
            className="three-points"
            onClick={this.onToggle}
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            ...
          </i>
        </div>
        <div ref={this.setEl} className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <a className="dropdown-item" onClick={this.onReloadResource}>
              <i className="fas fa-redo mr-1"></i>
              {`${t('reload')}`}
            </a>

            <a
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.props.onSetMuteTab(this.props.tab.id, !this.props.tab.muted);
              }}
            >
              {!!this.props.tab.muted ? (
                <React.Fragment>
                  <i className="fas mr-1 fa-volume-up" />
                  {t('unmute')}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <i className="fas mr-1 fa-volume-mute" />
                  {t('mute')}
                </React.Fragment>
              )}
            </a>
            <a
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.props.onSetFavoriteTab(this.props.tab.id, !this.props.tab.favorite);
              }}
            >
              {this.props.tab.favorite ? (
                <React.Fragment>
                  <i className="fas mr-1 fa-star" />
                  {t('remove from bookmarks')}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <i className="fas mr-1 fa-star" />
                  {t('add to bookmarks')}
                </React.Fragment>
              )}
            </a>
            <a
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <i className="fas mr-1 fa-stop"></i>
              {t('stop tab')}
            </a>
            {!this.props.tab.favorite && (
              <a
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.props.removeTab();
                }}
              >
                <i className="fas mr-1 fa-times"></i>
                {t('remove tab')}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
}
