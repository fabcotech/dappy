import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { dappyNetworks } from '@fabcotech/dappy-lookup';

import { State as StoreState } from '/store';
import * as fromSettings from '/store/settings';

const connector = connect((state: StoreState) => {
  const currentNetwork = fromSettings.getFirstBlockchain(state)?.chainName;
  return {
    currentNetwork,
    otherNetwork: Object.keys(dappyNetworks).filter((n) => n !== currentNetwork),
  };
});

type NetworkSwitcherComponentProps = ConnectedProps<typeof connector>;

export const NetworkSwitcherComponent: FC<NetworkSwitcherComponentProps> = (props) => {
  const { currentNetwork, otherNetwork } = props;

  return currentNetwork ? (
    <div
      className="px-4"
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: 'fit-content',
      }}
    >
      <span className="mr-3">You are on network {currentNetwork}</span>
      <button>switch to {otherNetwork}</button>
    </div>
  ) : null;
};

export const NetworkSwitcher = connector(NetworkSwitcherComponent);
