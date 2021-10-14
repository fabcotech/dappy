import React from 'react';

import { RChainTokenPurse, RChainContractConfig } from '/models';
import { formatAmountNoDecimal, formatAmount } from '/utils/formatAmount';
import { LOGREV_TO_REV_RATE } from '/CONSTANTS';
import { ContractHeader } from '/components/utils/ContractHeader';

import './PurseInfo.scss';

export const isPurchasable = (purse: RChainTokenPurse) => typeof purse.price === 'number';
const isAvailable = (purse: RChainTokenPurse) => isPurchasable(purse) && purse.id === '0';

export const PurseInfoComponent = ({
  purse,
  contractConfig,
  dNetwork,
}: {
  purse: RChainTokenPurse;
  contractConfig: RChainContractConfig;
  dNetwork: boolean;
}) => {
  if (isPurchasable(purse)) {
    return (
      <div className="field is-horizontal is-grouped">
        <label className="label"></label>
        <div className="control">
          {dNetwork && (
            <div className="message d-network">
              <div className="message-body">
                <span className="fa fa-check has-text-white"></span>
                <span className="subtitle is-5 ml-1 has-text-white">d network</span>
              </div>
            </div>
          )}
          <div className="message is-success">
            <div className="message-body">
              <i className="fa fa-check" />
              <span className="ml-1 subtitle is-5">
                {t(isAvailable(purse) ? 'name is available' : 'name is for sale')}
              </span>
              <div className="current-price-existing-purse">
                {t('at price')}
                <span className="ml-1">{formatAmount((purse.price as number) / LOGREV_TO_REV_RATE)}</span>
                <span className="ml-1">{t('rev', true)} / </span>
                <span>{formatAmountNoDecimal(purse.price as number)} dust</span>
              </div>
            </div>
          </div>
          <div className="is-rounded-8 p-4 has-background-light">
            <ContractHeader contractConfig={contractConfig} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="field is-horizontal is-grouped">
      <label className="label"></label>
      <div className="control">
        <h4>{t('name is not for sale')}</h4>
      </div>
    </div>
  );
};

export const PurseInfo = PurseInfoComponent;
