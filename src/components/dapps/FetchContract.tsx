import * as React from 'react';
import { connect } from 'react-redux';

import { MAIN_CHAIN_ID, VERSION } from '../../CONSTANTS';
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
  onNavigateToDeploy = () => {
    this.props.navigate('/deploy/dapp');
  };

  onNavigateToAccounts = () => {
    this.props.navigate('/accounts');
  };

  onNavigateToNames = () => {
    this.props.navigate('/settings/names');
  };

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

    let dNetwork = false;
    if (Object.keys(this.props.availableBlockchains)[0] === MAIN_CHAIN_ID) {
      dNetwork = true;
    }

    return (
      <div className="fetch-contract">
        <NavigationBarHome></NavigationBarHome>
        <div className="home-page">
          <div className="froggy">
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
          <div className="topright fc">
            {dNetwork ? (
              <div className="dnetwork">
                <h4>d network is live</h4>
                <p>
                  d network is the main network of dappy. Join the future of the internet and get a name on dappy now !
                  <a></a>
                </p>
                <p className="purchase">
                  <a onClick={this.onNavigateToNames}>purchase a name</a>
                </p>
              </div>
            ) : undefined}
          </div>
          <div className="botleft">
            <div className="deploy-dapp hexagons">
              <div className="dapp-right">
                <button onClick={this.onNavigateToAccounts} className="button is-medium is-light mb5">
                  <i className="fa fa-money-check fa-before"></i>
                  Check your wallets / accounts
                </button>
                <button onClick={this.onNavigateToDeploy} className="button is-medium is-light mb5">
                  <i className="fa fa-angle-double-up fa-before"></i>
                  Deploy a contract for fungibles (FT)
                </button>
                <button onClick={this.onNavigateToDeploy} className="button is-medium is-light mb5">
                  <i className="fa fa-angle-double-up fa-before"></i>
                  Deploy a contract for non-fungibles (NFT)
                </button>
              </div>
            </div>
          </div>
          <div className="botright">
            <div className="deploy-dapp"></div>
          </div>
        </div>
      </div>
    );
  }
}

export const FetchContract = connect(
  (state) => ({
    availableBlockchains: fromSettings.getAvailableBlockchains(state),
  }),
  (dispatch) => ({
    navigate: (navigationUrl: NavigationUrl) => dispatch(fromUi.navigateAction({ navigationUrl: navigationUrl })),
  })
)(FetchContractComponent);
