import * as React from 'react';
import { connect } from 'react-redux';

import './LoadInfo.scss';
import { Blockchain } from '/models';
import * as fromMain from '/store/main';
import * as fromSettings from '/store/settings';

interface LoadInfoComponentProps {
  appType: 'IP' | 'DA' | undefined;
  tabId: string;
  url: string ;
  namesBlockchain: undefined | Blockchain;
  badges: { [name: string]: string };
  closeDappModal: (a: { tabId: string }) => void;
}

class LoadInfoComponent extends React.Component<LoadInfoComponentProps> {
  render() {

    const host = new URL(this.props.url).host;
    if (this.props.appType === 'IP') {
      return (
        <div className="load-info-background">
          <div className="load-info">
            <h5>{t('ip application')}</h5>
            <h6>{host}</h6>
            <h6>
              Internet url <b>https://go.dappy.tech/go/{this.props.url}</b>
            </h6>
          </div>
        </div>
      );
    }

    return (
      <div className="load-info-background">
        <div className="load-info">
          <h5>{t('decentralized application')}</h5>
          <h6>{host}</h6>
          <h6>
            Internet url <b>https://go.dappy.tech/go/{this.props.url}</b>
          </h6>
          <br />
          <p>{t('dapp security paragraph')}</p>
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
    closeDappModal: (a: { tabId: string }) => dispatch(fromMain.closeDappModalAction({ tabId: a.tabId })),
  })
)(LoadInfoComponent);
