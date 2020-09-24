import * as React from 'react';
import { connect } from 'react-redux';

import { VERSION } from '../../CONSTANTS';
import './FetchContract.scss';
import * as fromSettings from '../../store/settings';
import * as fromUi from '../../store/ui';
import { Blockchain, NavigationUrl } from '../../models';

import { NavigationBarHome } from '../dapp/';

interface FetchContractProps {
  availableBlockchains: {
    [chainId: string]: Blockchain;
  };
  navigate: (a: NavigationUrl) => void;
}

class FetchContractComponent extends React.Component<FetchContractProps, {}> {
  render() {
    if (!Object.keys(this.props.availableBlockchains).length) {
      return (
        <div>
          <article className="message is-warning">
            <div className="message-body">
              You must have at least one blockchain configured to load dapps.
              <br />
              You can manage blockchains in the settings section.
              <br />
              <br />
              <a onClick={() => this.props.navigate('/settings')}>
                <i className="fa fa-wrench fa-before" />
                Settings
              </a>
            </div>
          </article>
        </div>
      );
    }

    return (
      <div className="fetch-contract">
        <NavigationBarHome></NavigationBarHome>
        <div className="home-page">
          <div className="img">
            <div className="froggy-01"></div>
          </div>
          <div className="text">
            <div>
              <h3 className="title is-1">Dappy</h3>
              <h4 className="title is-2">release {VERSION}</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const FetchContract = connect(
  state => ({
    availableBlockchains: fromSettings.getAvailableBlockchains(state),
  }),
  dispatch => ({
    navigate: (navigationUrl: NavigationUrl) => dispatch(fromUi.navigateAction({ navigationUrl: navigationUrl })),
  })
)(FetchContractComponent);
