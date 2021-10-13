import React, { Fragment } from 'react';
import { RChainContractConfig } from '/models';

import { toRGB } from '/utils/color';

import { ContractMetadata } from './ContractMetadata';

interface ContractHeaderProps {
  contractConfig: RChainContractConfig 
}

export const ContractHeader = ({ contractConfig }: ContractHeaderProps) => (
  <Fragment>
      <div className="address-and-copy fc">
      <span className="address">
        {t('contract') + ' '}
        {contractConfig.fungible && <span title="Contract for fungible tokens">FT</span>}
        {!contractConfig.fungible && <span title="Contract for non-fungible tokens">NFT</span>}
        {contractConfig.contractId}
      </span>

      <span className="square ml5" style={{ background: toRGB(contractConfig.contractId) }}></span>
      <a type="button" className="underlined-link" onClick={() => window.copyToClipboard(contractConfig.contractId)}>
        <i className="fa fa-copy fa-before"></i>
        {t('copy contract address')}
      </a>
    </div>
    <ContractMetadata contractConfig={contractConfig} />
  </Fragment>
);