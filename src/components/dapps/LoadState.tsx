import * as React from 'react';

import * as fromDapps from '../../store/dapps';
import * as fromMain from '../../store/main';
import './LoadState.scss';
import { connect } from 'react-redux';
import { DappManifest } from '../../models';

interface LoadStateProps {
  dappId: string;
  closeModal: () => void;
  dappManifest: DappManifest;
}

class LoadStateComponent extends React.Component<LoadStateProps, {}> {
  render() {
    const completeds = Object.keys(this.props.dappManifest.loadState.completed);
    const errors = Object.keys(this.props.dappManifest.loadState.errors);
    return (
      <div className={`load-state`}>
        <u>
          <b>File informations :</b>
        </u>
        <ul>
          <li>Origin : {this.props.dappManifest.origin}</li>
          <li>Platform : RChain</li>
          <li>Shard : {this.props.dappManifest.chainId}</li>
          <li className="unforgeable-name">Blockchain address : {this.props.dappManifest.resourceId}</li>
          {this.props.dappManifest.publicKey ? (
            <li>
              Signature : <i className="fa fa-lock fa-after" /> <b>verified</b>
            </li>
          ) : (
            <li>No signature provided</li>
          )}
          {this.props.dappManifest.publicKey ? (
            <li className="public-key">Public key : {this.props.dappManifest.publicKey}</li>
          ) : undefined}
        </ul>
        <br />
        <u>
          <b>Network informations :</b>
        </u>
        <div>
          {completeds.length ? <b>Success(es) : </b> : undefined}
          {this.props.dappManifest.loadState &&
            completeds.map((key) => (
              <div className="completeds" key={key}>
                {this.props.dappManifest.loadState &&
                  this.props.dappManifest.loadState.completed[key].nodeUrls.map((url) => (
                    <div key={key + url}>
                      <span>{url}</span>
                      <div className="fc">
                        <span className="tag is-success">Completed</span>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          {errors.length ? (
            <span>
              <br />
              <br />
            </span>
          ) : undefined}
          {errors.length ? <b>Failure(s) : </b> : undefined}
          <div className="errors">
            {this.props.dappManifest.loadState &&
              errors.map((key) => (
                <div key={key}>
                  <span>{key}</span>
                  <div className="fc">
                    <span className="tag is-danger">
                      {this.props.dappManifest.loadState && this.props.dappManifest.loadState.errors[key].status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <br />
        </div>
      </div>
    );
  }
}

export const LoadState = connect(
  (state, props: { dappId: string }) => ({
    dappManifest: fromDapps.getDappManifests(state)[props.dappId],
    dappId: props.dappId,
  }),
  (dispatch) => ({
    closeModal: () => dispatch(fromMain.closeModalAction()),
  })
)(LoadStateComponent);
