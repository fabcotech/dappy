import * as React from 'react';
import { connect } from 'react-redux';

import './LoadInfo.scss';
import { Tab } from '/models';

interface LoadInfoComponentProps {
  tab: Tab;
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
        console.error('cannot get host from url');
        console.log(this.props.tab.url);
      }
    }

    return (
      <div className="load-info-background">
        <div className="load-info">
          <h5>{this.props.tab.data.html ? t('decentralized application') : t('ip application')}</h5>
          <h6>{host}</h6>
        </div>
      </div>
    );
  }
}

export const LoadInfo = connect(
  (state) => {
    return {};
  },
  (dispatch) => ({})
)(LoadInfoComponent);
