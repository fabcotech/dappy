import * as React from 'react';
import xs, { Subscription } from 'xstream';

import { DappImage } from '../utils';
import { ActionsComponent } from '.';
import { TransitoryState, Tab, Dapp } from '../../models';
import './TabListItem.scss';

interface TabListItemProps {
  dapp: undefined | Dapp;
  tab: Tab;
  transitoryState: undefined | TransitoryState;
  launchedAt: string | undefined;
  focused: boolean;
  onlyIcons: boolean;
  focusTab: (tabId: string) => void;
  launchDapp: (resourceId: string, tabId: string) => void;
  reloadResource: (tabId: string) => void;
  onSetMuteResource: (tabId: string, a: boolean) => void;
  removeTab: (tabId: string) => void;
  stopTab: (tabId: string) => void;
}

export class TabListItem extends React.Component<TabListItemProps, {}> {
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
      this.props.launchDapp(this.props.tab.resourceId, this.props.tab.id);
    } else if (this.props.tab.active) {
      this.props.focusTab(this.props.tab.id);
    }
  };

  onReloadResource = () => {
    this.props.reloadResource(this.props.tab.id);
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
          }`}>
          <div title={this.props.tab.title} className="img-col fc">
            <DappImage
              small={true}
              id={this.props.tab.address}
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
        } pl5 pr5`}>
        <div className="img-col fc">
          <DappImage
            id={this.props.tab.address}
            title={this.props.tab.title}
            img={this.props.tab.img}
            transitoryState={this.props.tab.active ? this.props.transitoryState : undefined}
          />
        </div>
        <span className="dapp-title pl5">
          {this.props.tab.muted ? <i className="fa fa-before fa-volume-mute" /> : undefined}
          {this.props.tab.title}
        </span>
        <div className="dapp-status">
          {this.props.tab.active &&
          (!this.props.transitoryState ||
            !['launching', 'stopping', 'loading', 'reloading'].includes(this.props.transitoryState)) ? (
            <ActionsComponent
              dapp={this.props.dapp}
              tab={this.props.tab}
              reloadResource={this.onReloadResource}
              onSetMuteResource={this.props.onSetMuteResource}
              removeTab={this.onRemoveTab}
              stopTab={this.onStopTab}
            />
          ) : undefined}
          {!this.props.transitoryState && !this.props.tab.active && (
            <i onClick={this.onRemoveTab} className="fa fa-times fa-after" title={t('remove tab')} />
          )}
        </div>
      </div>
    );
  }
}
