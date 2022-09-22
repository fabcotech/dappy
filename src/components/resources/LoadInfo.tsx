import * as React from 'react';
import { connect } from 'react-redux';

import './LoadInfo.scss';
import { Blockchain, Tab } from '/models';
import * as fromMain from '/store/main';
import * as fromSettings from '/store/settings';

interface LoadInfoComponentProps {
  tab: Tab;
  namesBlockchain: undefined | Blockchain;
  closeDappModal: (a: { tabId: string }) => void;
}

class LoadInfoComponent extends React.Component<LoadInfoComponentProps> {
  render() {

    let host = this.props.tab.url;
    if (this.props.tab.data.isIp) {
      host = this.props.tab.url;
    } else {
      try {
        host = new URL(this.props.tab.url).host;
      } catch (err) {
        console.error('cannot get host from url')
        console.log(this.props.tab.url)
      }
    }

    return (
      <div className="load-info-background">
        <div className="load-info">
          <h5>{!!this.props.tab.data.html ? t('decentralized application') : t('ip application')}</h5>
          <h6>{host}</h6>
          <h6>
            Internet url <b>https://go.dappy.tech/go/{this.props.tab.url}</b>
          </h6>
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
