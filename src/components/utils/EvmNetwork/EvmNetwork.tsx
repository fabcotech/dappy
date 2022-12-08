import * as React from 'react';

import './EvmNetwork.scss';
import { evmNetworks } from '/models';
import { toHex } from '/utils/toHex';

// https://chainlist.org/
const getImgAndNetworkName = (chainId: string): { img: undefined | string; name: string } => {
  const foundChainId = Object.keys(evmNetworks).find((cid) => toHex(cid) === `${chainId}`);
  if (foundChainId) {
    return {
      name: evmNetworks[foundChainId][0],
      img: evmNetworks[foundChainId][1],
    };
  }
  return {
    img: undefined,
    name: 'Unknown network',
  };
};

interface EvmNetworkProps {
  chainId: string | undefined;
}

export const EvmNetwork = ({ chainId }: EvmNetworkProps) => {
  const imgAndNetworkName = getImgAndNetworkName(chainId!);
  return (
    <React.Fragment>
      <div className="field is-horizontal field">
        <div className="field-label is-normal">
          <label className="label">Chain</label>
        </div>
        <div className="field-body ">
          {imgAndNetworkName.img && imgAndNetworkName.name && (
            <div className="field field-evm-network-name">
              <p className="control">
                <img className="evm-network-img" src={imgAndNetworkName.img}></img>
                <b className="evm-network-name">{imgAndNetworkName.name}</b>
              </p>
            </div>
          )}
          {!imgAndNetworkName.img && (
            <div className="field field-evm-network-name">
              <p className="control">{imgAndNetworkName.name}</p>
            </div>
          )}
        </div>
      </div>
      {chainId && typeof chainId === 'number' && (
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">chainId</label>
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control">
                <span>{chainId}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
