import * as React from 'react';

import './EvmNetwork.scss';
import { evmNetworks } from '/models';

// https://chainlist.org/
const getImgAndNetworkName = (chainId: number): { img: undefined | string; name: string } => {
  if (Object.keys(evmNetworks).find((cid) => parseInt(cid, 10) === chainId)) {
    return {
      name: evmNetworks[chainId][0],
      img: evmNetworks[chainId][1],
    };
  }
  return {
    img: undefined,
    name: 'Unknown network',
  };
};

interface EvmNetworkProps {
  chainId: number | undefined;
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
