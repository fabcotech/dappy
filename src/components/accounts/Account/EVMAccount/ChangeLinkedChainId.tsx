import React from 'react';

import { evmNetworks, EvmNetworks } from '/models';

import './EVMAccount.scss';

interface ChangeLinkedChainIdProps {
  setChainId: (a: keyof EvmNetworks | undefined | null) => void;
}

export const ChangeLinkedChainId = ({ setChainId }: ChangeLinkedChainIdProps) => {
  return (
    <div className="networks">
      {Object.keys(evmNetworks).map((a) => {
        return (
          <a
            key={a}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setChainId(a);
            }}
          >
            <img className="pr-1" title={evmNetworks[a][0]} src={evmNetworks[a][1]}></img>
          </a>
        );
      })}
      <a
        href="#"
        title={t('none')}
        onClick={(e) => {
          e.preventDefault();
          setChainId(undefined);
        }}
      >
        <i className="fa fa-times fa-after"></i>
      </a>
      <a
        href="#"
        title={t('cancel')}
        onClick={(e) => {
          e.preventDefault();
          setChainId(null);
        }}
      >
        <i className="fa fa-arrow-left fa-after"></i>
      </a>
    </div>
  );
};
