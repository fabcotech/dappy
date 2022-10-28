import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { DappyNetworkId, dappyNetworks } from '@fabcotech/dappy-lookup';

import { State as StoreState } from '/store';
import * as fromSettings from '/store/settings';

import './NetworkSwitcher.scss';

const connector = connect(
  (state: StoreState) => {
    return {
      currentNetwork: fromSettings.getNamesBlockchain(state)?.chainId,
    };
  },
  (dispatch) => {
    return {
      createBlockchain: (values: fromSettings.CreateBlockchainPayload) =>
        dispatch(fromSettings.createBlockchainAction(values)),
    };
  }
);

type NetworkSwitcherComponentProps = ConnectedProps<typeof connector>;

export const NetworkSwitcherComponent: FC<NetworkSwitcherComponentProps> = (props) => {
  const { currentNetwork, createBlockchain } = props;

  return (
    <div className="network-switcher">
      {currentNetwork ? (
        <p className="mr-3">You are on network {currentNetwork}</p>
      ) : (
        <p>Your are not connected with any dappy network</p>
      )}
      <p>
        {(Object.keys(dappyNetworks) as Array<DappyNetworkId>)
          .filter((n) => n !== currentNetwork)
          .map((networkId) => (
            <a
              type="button"
              onClick={() => {
                createBlockchain({
                  override: true,
                  blockchain: {
                    platform: 'rchain',
                    chainId: networkId,
                    chainName: networkId,
                    nodes: dappyNetworks[networkId],
                    auto: true,
                  },
                });
              }}
              key={networkId}
            >
              Switch to network {networkId}
            </a>
          ))}
      </p>
    </div>
  );
};

export const NetworkSwitcher = connector(NetworkSwitcherComponent);
