import React, { Fragment } from 'react';
import { RChainContractConfig } from '/models';

import { toRGB } from '/utils/color';
import { copyToClipboard } from '/interProcess';
import { ContractMetadata } from './ContractMetadata';

interface ContractHeaderProps {
  contractConfig: RChainContractConfig;
}

export const ContractHeader = ({ contractConfig }: ContractHeaderProps) => (
  <Fragment>
    <div>
      <span className="subtitle is-5">
        {t('contract') + ' '}
        {contractConfig.fungible && <span title="Contract for fungible tokens">FT</span>}
        {!contractConfig.fungible && (
          <span title="Contract for non-fungible tokens" className="ml-1">
            NFT
          </span>
        )}
        <span className="ml-1">{contractConfig.contractId}</span>
      </span>

      <span className="ml-4" style={{ background: toRGB(contractConfig.contractId) }}></span>
      <a onClick={() => copyToClipboard(contractConfig.contractId)}>
        <i className="fa fa-copy fa-before"></i>
        {t('copy contract address')}
      </a>
    </div>

    <ContractMetadata contractConfig={contractConfig} />
  </Fragment>
);
