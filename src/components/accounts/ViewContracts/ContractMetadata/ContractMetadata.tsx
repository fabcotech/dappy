import React from "react";

import { RChainContractConfig } from '/models';
import { feePermillage, toDuration, toDurationString } from '/utils/unit';

interface ContractMetadataProps {
  contractConfig?: RChainContractConfig
}

const ContractMetadataComponent = ({ contractConfig } : ContractMetadataProps) => {
  return (<div className="mb-5">
  {contractConfig && (
    <span 
      className={`${contractConfig.locked ? 'has-text-success' : 'has-text-danger'}`}
      title={contractConfig.locked ? t('locked title'): t('not locked title')}>
      <i className={`mr-1 fa fa-${contractConfig.locked ? 'lock' : 'exclamation-triangle'}`}></i>
      {t(contractConfig.locked ? 'locked' : 'not locked')}
    </span>
  )}
  {contractConfig && contractConfig.expires && (
    <span className="ml-2">
      <i className="fa fa-clock mx-1"></i>
      {t('expiration')}: {toDurationString(t, toDuration(contractConfig.expires))}
    </span>
  )}
  {contractConfig && contractConfig.fee && (
    <span className="ml-2">
      <i className="fa fa-money-bill-wave mr-1"></i>
      {t('rchain token fee')}: {feePermillage(contractConfig.fee)}%
    </span>
  )}
  </div>);
}

export const ContractMetadata = ContractMetadataComponent;
