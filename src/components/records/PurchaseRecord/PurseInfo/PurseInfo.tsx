import React from 'react';

import { RChainTokenPurse, RChainContractConfig } from '/models';
import { formatAmountNoDecimal, formatAmount } from '/utils/formatAmount';
import { LOGREV_TO_REV_RATE } from '/CONSTANTS';
import { ContractHeader } from '/components/utils/ContractHeader';

import reservedDomains from 'dappy-reserved-domains/reserved-domains.json';

import './PurseInfo.scss';

export const isPurchasable = (purse: RChainTokenPurse, domainName: string) =>
  Array.isArray(purse.price) && !(reservedDomains as any)[domainName];

const isAvailable = (purse: RChainTokenPurse, domainName: string) =>
  isPurchasable(purse, domainName) && purse.id === '0';

export const PurseInfoComponent = ({
  purse,
  contractConfig,
  dNetwork,
  domainName,
}: {
  purse: RChainTokenPurse;
  contractConfig: RChainContractConfig;
  dNetwork: boolean;
  domainName: string;
}) => {
  if (isPurchasable(purse, domainName)) {
    return (
      <div className="field is-horizontal is-grouped">
        <label className="label"></label>
        <div className="control">
          {dNetwork && (
            <div className="message d-network">
              <div className="message-body">
                <span className="fa fa-check has-text-white"></span>
                <span className="d-network-font ml-3 subtitle is-5 ml-1 has-text-white">d network</span>
              </div>
            </div>
          )}
          <div className="message is-success">
            <div className="message-body">
              <i className="fa fa-check" />
              <span className="ml-1 subtitle is-5">
                {isAvailable(purse, domainName) ? t('name is available') : t('name is for sale')}
              </span>
              <div className="current-price-existing-purse">
                {t('at price')}
                <span className="ml-1">{formatAmount((purse.price![1] as number) / LOGREV_TO_REV_RATE)}</span>
                <span className="ml-1">{t('rev', true)} / </span>
                <span>{formatAmountNoDecimal(purse.price![1] as number)} dust</span>
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
