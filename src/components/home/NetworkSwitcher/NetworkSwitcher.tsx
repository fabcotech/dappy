import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { dappyNetworks } from '@fabcotech/dappy-lookup';

import { State as StoreState } from '/store';
import * as fromSettings from '/store/settings';

import './NetworkSwitcher.scss';

const connector = connect(
  (state: StoreState) => {
    return {
      namesBlockchain: fromSettings.getNamesBlockchain(state),
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
  const { namesBlockchain, createBlockchain } = props;

  return (
    <div className="network-switcher">
      {namesBlockchain ? (
        <p className="mr-3">You are on network {namesBlockchain.chainId}</p>
      ) : (
        <p>Your are not connected with any dappy network</p>
      )}
      <p>
        {Object.keys(dappyNetworks).map((networkId: string) => {
          return (
            <>
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
                Restore or switch to network {networkId}
              </a>
              <br />
            </>
          );
        })}
      </p>
    </div>
  );
};

export const NetworkSwitcher = connector(NetworkSwitcherComponent);
