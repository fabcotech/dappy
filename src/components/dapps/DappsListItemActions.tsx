import * as React from 'react';
import { DappManifest, Tab } from '../../models';

interface ActionsProps {
  dappManifest: undefined | DappManifest;
  tab: Tab;
  stopTab: () => void;
  removeTab: () => void;
  reloadResource: () => void;
  onSetMuteResource: (tabId: string, a: boolean) => void;
}

export class ActionsComponent extends React.Component<ActionsProps, {}> {
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
    this.props.reloadResource();
    this.onToggle();
  };

  onToggle = (e?: React.MouseEvent<HTMLElement>) => {
    if (!this.state.active) {
      this.setState({
        active: true,
      });
    }
  };

  onClick = (e) => {
    if (!this.el) {
      return;
    }
    if (this.state.active && !this.el.parentElement.querySelector(':hover')) {
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
          <i className="three-points" onClick={this.onToggle} aria-haspopup="true" aria-controls="dropdown-menu">
            ...
          </i>
        </div>
        <div ref={this.setEl} className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <a className="dropdown-item" onClick={this.onReloadResource}>
              <i className="fa fa-before fa-redo"></i>
              {`${t('reload')} ${!!this.props.dappManifest ? t('dapp') : t('ip app')}`}
            </a>

            <a
              className="dropdown-item"
              onClick={() => this.props.onSetMuteResource(this.props.tab.id, !this.props.tab.muted)}>
              {!!this.props.tab.muted ? (
                <React.Fragment>
                  <i className="fa fa-before fa-volume-up" />
                  {t('unmute')}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <i className="fa fa-before fa-volume-mute" />
                  {t('mute')}
                </React.Fragment>
              )}
            </a>
            <a className="dropdown-item" onClick={this.props.stopTab}>
              <i className="fa fa-before fa-stop"></i>
              {t('stop tab')}
            </a>
            <a className="dropdown-item" onClick={this.props.removeTab}>
              <i className="fa fa-before fa-times"></i>
              {t('remove tab')}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
