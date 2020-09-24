import * as React from 'react';
import { connect } from 'react-redux';

import './LoadInfo.scss';
import { IPServer, LoadCompletedData } from '../../models';
import * as fromMain from '../../store/main';

interface LoadInfoComponentProps {
  appType: 'IP' | 'DA' | undefined;
  servers: IPServer[] | undefined;
  address: string | undefined;
  loadState: undefined | LoadCompletedData;
  resourceId: string;
  closeDappModal: (a: { resourceId: string }) => void;
}

class LoadInfoComponent extends React.Component<LoadInfoComponentProps> {
  render() {
    if (this.props.appType === 'IP') {
      return (
        <div className="load-info-background">
          <div className="load-info">
            <h5>{t('ip application')}</h5>
            <h6>{this.props.address}</h6>
            <h6>
              Internet url <b>https://dappy.tech/go/{this.props.address}</b>
            </h6>
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

export const LoadInfo = connect(undefined, (dispatch) => ({
  closeDappModal: (a: { resourceId: string }) => dispatch(fromMain.closeDappModalAction({ dappId: a.resourceId })),
}))(LoadInfoComponent);
