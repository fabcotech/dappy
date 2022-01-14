import * as React from 'react';

import image_ethereum from '/images/ethereum120x120.png';
import image_polygon from '/images/polygon120x120.png';
import image_arbitrum from '/images/arbitrum120x120.png';
import image_fantom_opera from '/images/fantom120x120.png';
import image_moonbeam from '/images/moonbeam120x120.png';
import image_moonriver from '/images/moonriver120x120.png';
import image_starkware from '/images/starkware120x120.png';
import image_evmos from '/images/evmos120x120.png';
import image_binance_smart_chain from '/images/binance120x120.png';
import image_avalanche from '/images/avalanche120x120.png';

import './EvmNetwork.scss';

// https://chainlist.org/
const getImgAndNetworkName = (chainId: number): { img: undefined | string; name: string } => {
  if (chainId === 1) {
    return {
      img: image_ethereum,
      name: 'Ethereum Mainnet',
    };
  } else if (chainId === 3) {
    return {
      img: image_ethereum,
      name: 'Ethereum Testnet Ropsten',
    };
  } else if (chainId === 4) {
    return {
      img: image_ethereum,
      name: 'Ethereum Testnet Rinkeby',
    };
  } else if (chainId === 61) {
    return {
      img: image_ethereum,
      name: 'Ethereum Classic Mainnet',
    };
  } else if (chainId === 137) {
    return {
      img: image_polygon,
      name: 'Polygon Mainnet',
    };
  } else if (chainId === 80001) {
    return {
      img: image_polygon,
      name: 'Polygon Testnet',
    };
  } else if (chainId === 42161) {
    return {
      img: image_arbitrum,
      name: 'Arbitrum One',
    };
  } else if (chainId === 421611) {
    return {
      img: image_arbitrum,
      name: 'Arbitrum Rinkeby',
    };
  } else if (chainId === 250) {
    return {
      img: image_fantom_opera,
      name: 'Fantom Opera',
    };
  } else if (chainId === 4002) {
    return {
      img: image_fantom_opera,
      name: 'Fantom Testnet',
    };
  } else if (chainId === 1284) {
    return {
      img: image_moonbeam,
      name: 'Moonbeam',
    };
  } else if (chainId === 1285) {
    return {
      img: image_moonriver,
      name: 'Moonriver',
    };
  } else if (chainId === 56) {
    return {
      img: image_binance_smart_chain,
      name: 'Binance Smart Chain Mainnet',
    };
  } else if (chainId === 97) {
    return {
      img: image_binance_smart_chain,
      name: 'Binance Smart Chain Testnet',
    };
  } else if (chainId === 43113) {
    return {
      img: image_avalanche,
      name: 'Avalanche Fuji Testnet',
    };
  } else if (chainId === 43114) {
    return {
      img: image_avalanche,
      name: 'Avalanche Mainnet',
    };
  } else {
    return {
      img: undefined,
      name: 'Unknown network',
    };
  }
};

interface EvmNetworkProps {
  chainId: string | undefined;
}

export const EvmNetwork = ({ chainId }: EvmNetworkProps) => {
  const imgAndNetworkName = getImgAndNetworkName(chainId);
  return (
    <React.Fragment>
      {chainId && typeof chainId === 'string' && (
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Network ID</label>
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
      <div className="field is-horizontal field">
        <div className="field-label is-normal">
          <label className="label">Network</label>
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
    </React.Fragment>
  );
};
