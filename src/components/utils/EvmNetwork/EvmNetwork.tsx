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
  }
  if (chainId === 3) {
    return {
      img: image_ethereum,
      name: 'Ethereum Testnet Ropsten',
    };
  }
  if (chainId === 4) {
    return {
      img: image_ethereum,
      name: 'Ethereum Testnet Rinkeby',
    };
  }
  if (chainId === 61) {
    return {
      img: image_ethereum,
      name: 'Ethereum Classic Mainnet',
    };
  }
  if (chainId === 137) {
    return {
      img: image_polygon,
      name: 'Polygon Mainnet',
    };
  }
  if (chainId === 80001) {
    return {
      img: image_polygon,
      name: 'Polygon Testnet',
    };
  }
  if (chainId === 42161) {
    return {
      img: image_arbitrum,
      name: 'Arbitrum One',
    };
  }
  if (chainId === 421611) {
    return {
      img: image_arbitrum,
      name: 'Arbitrum Rinkeby',
    };
  }
  if (chainId === 250) {
    return {
      img: image_fantom_opera,
      name: 'Fantom Opera',
    };
  }
  if (chainId === 4002) {
    return {
      img: image_fantom_opera,
      name: 'Fantom Testnet',
    };
  }
  if (chainId === 1284) {
    return {
      img: image_moonbeam,
      name: 'Moonbeam',
    };
  }
  if (chainId === 1285) {
    return {
      img: image_moonriver,
      name: 'Moonriver',
    };
  }
  if (chainId === 56) {
    return {
      img: image_binance_smart_chain,
      name: 'Binance Smart Chain Mainnet',
    };
  }
  if (chainId === 97) {
    return {
      img: image_binance_smart_chain,
      name: 'Binance Smart Chain Testnet',
    };
  }
  if (chainId === 43113) {
    return {
      img: image_avalanche,
      name: 'Avalanche Fuji Testnet',
    };
  }
  if (chainId === 43114) {
    return {
      img: image_avalanche,
      name: 'Avalanche Mainnet',
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
