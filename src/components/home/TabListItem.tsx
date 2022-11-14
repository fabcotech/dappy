import React from 'react';
import xs, { Subscription } from 'xstream';

import { DappImage } from '../utils';
import { TransitoryState, Tab } from '/models';
import './TabListItem.scss';

interface TabListItemProps {
  tab: Tab;
  transitoryState: undefined | TransitoryState;
  focused: boolean;
  onlyIcons: boolean;
  focusTab: (tabId: string) => void;
  loadResource: (address: string, tabId: string) => void;
  onSetMuteTab: (tabId: string, a: boolean) => void;
  onSetFavoriteTab: (tabId: string, a: boolean) => void;
  removeTab: (tabId: string) => void;
  stopTab: (tabId: string) => void;
}

export class TabListItem extends React.Component<TabListItemProps> {
  renderSubscription: Subscription | undefined = undefined;

  state = {};

  componentDidMount() {
    this.renderSubscription = xs.periodic(10000).subscribe({
      next: () => this.forceUpdate(),
    });
  }

  componentWillUnmount() {
    if (this.renderSubscription) {
      this.renderSubscription.unsubscribe();
    }
  }

  onLaunchOrFocusDapp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!this.props.transitoryState && !this.props.tab.active) {
      e.preventDefault();
      this.props.loadResource(this.props.tab.url, this.props.tab.id);
    } else if (this.props.tab.active) {
      this.props.focusTab(this.props.tab.id);
    }
  };

  onRemoveTab = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.props.removeTab(this.props.tab.id);
  };

  onStopTab = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.props.stopTab(this.props.tab.id);
  };

  render() {
    if (this.props.onlyIcons) {
      return (
        <div
          onClick={this.onLaunchOrFocusDapp}
          className={`tab-list-item small ${this.props.tab.active ? 'active' : ''} ${
            this.props.focused ? 'focused' : ''
          }`}
        >
          <div title={this.props.tab.title} className="img-col fc">
            <DappImage
              small={true}
              title={this.props.tab.title}
              img={this.props.tab.img}
              transitoryState={this.props.tab.active ? this.props.transitoryState : undefined}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={this.onLaunchOrFocusDapp}
        className={`tab-list-item ${this.props.tab.active ? 'active' : ''} ${
          this.props.focused ? 'focused' : ''
        } pl5 pr5`}
      >
        <div className="img-col fc">
          <DappImage
            title={this.props.tab.title}
            img={this.props.tab.img}
            transitoryState={this.props.tab.active ? this.props.transitoryState : undefined}
          />
        </div>
        <span className="tab-title pl5">
          {this.props.tab.muted && this.props.tab.active ? (
            <i
              title="Unmute"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.props.onSetMuteTab(this.props.tab.id, false);
              }}
              className="fa fa-before fa-volume-mute"
            />
          ) : undefined}
          {this.props.tab.favorite ? (
            <i
              title="Remove from bookmarks"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.props.onSetFavoriteTab(this.props.tab.id, false);
              }}
              className="fa fa-before fa-star"
            />
          ) : undefined}
          <span>{this.props.tab.title}</span>
        </span>
        <div className="tab-status">
          {/* this.props.tab.active &&
          (!this.props.transitoryState ||
            !['launching', 'stopping', 'loading', 'reloading'].includes(this.props.transitoryState)) ? (
            <TabActions
              tab={this.props.tab}
              reloadTab={() => this.props.loadResource(this.props.tab.url, this.props.tab.id)}
              onSetMuteTab={this.props.onSetMuteTab}
              onSetFavoriteTab={this.props.onSetFavoriteTab}
              removeTab={this.onRemoveTab}
              stopTab={this.onStopTab}
            />
          ) : undefined */}
          {!this.props.transitoryState && !this.props.tab.favorite && !this.props.tab.active && (
            <i
              onClick={this.onRemoveTab}
              className="fa fa-times fa-after"
              title={t('remove tab')}
            />
          )}
        </div>
      </div>
    );
  }
}
