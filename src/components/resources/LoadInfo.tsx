import * as React from 'react';
import { connect } from 'react-redux';

import './LoadInfo.scss';
import { Blockchain, IPServer, LoadCompletedData } from '/models';
import * as fromMain from '/store/main';
import * as fromDapps from '/store/dapps';
import * as fromSettings from '/store/settings';
import { searchToAddress } from '/utils/searchToAddress';
import { BadgeAppreciation } from '../utils/BadgeAppreciation';

interface LoadInfoComponentProps {
  appType: 'IP' | 'DA' | undefined;
  servers: IPServer[] | undefined;
  tabId: string;
  address: string | undefined;
  namesBlockchain: undefined | Blockchain;
  loadState: undefined | LoadCompletedData;
  badges: { [name: string]: string };
  resourceId: string;
  loadResource: (address: string, tabId: string) => void;
  closeDappModal: (a: { resourceId: string }) => void;
}

class LoadInfoComponent extends React.Component<LoadInfoComponentProps> {
  render() {

    let Badges = () => <p></p>;
    if (this.props.badges && Object.keys(this.props.badges).length) {
      const appType = this.props.appType === 'IP' ? t('ip application') : t('dapp');
      Badges = () =>
        <div className="badges">
          <h6><u>Referrals / Badges :</u></h6>
          {
            Object.keys(this.props.badges).map(b => {
              return <p key={b} className="badge">
                <a href="#" onClick={() => {
                  if (this.props.namesBlockchain) {
                    this.props.loadResource(
                      searchToAddress(b, this.props.namesBlockchain.chainId),
                      this.props.tabId
                    )
                  }
                }}>{b} </a>
                <BadgeAppreciation appreciation={this.props.badges[b]}/>
              </p>
            })
          }
        </div>
    }

    if (this.props.appType === 'IP') {
      return (
        <div className="load-info-background">
          <div className="load-info">
            <h5>{t('ip application')}</h5>
            <h6>{this.props.address}</h6>
            <h6>
              Internet url <b>https://dappy.tech/go/{this.props.address}</b>
            </h6>
            <Badges />
            <br />
            <p>{t('ip app security paragraph')}</p>
            <div className="servers">
              {this.props.servers
                ? this.props.servers.map((s) => (
                    <div key={s.ip}>
                      <span className="fa  fa-check"></span> {s.ip} as {s.host}
                    </div>
                  ))
                : undefined}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="load-info-background">
        <div className="load-info">
          <h5>{t('decentralized application')}</h5>
          <h6>{this.props.address}</h6>
          <h6>
            Internet url <b className="internet-url">https://dappy.tech/go/{this.props.address}</b>
          </h6>
          <Badges />
          <br />
          <p>{t('dapp security paragraph')}</p>

          {this.props.loadState ? (
            <div className="servers">
              {this.props.loadState.nodeUrls.map((url) => (
                <div key={url}>{url}</div>
              ))}
            </div>
          ) : undefined}
        </div>
      </div>
    );
  }
}

export const LoadInfo = connect(
  (state) => {
    return {
      namesBlockchain: fromSettings.getNamesBlockchain(state),
    }
  },
  (dispatch) => ({
    closeDappModal: (a: { resourceId: string }) => dispatch(fromMain.closeDappModalAction({ dappId: a.resourceId })),
    loadResource: (address: string, tabId: string) =>
      dispatch(
        fromDapps.loadResourceAction({
          address: address,
          tabId: tabId,
        })
      ),
  })
)(LoadInfoComponent);
