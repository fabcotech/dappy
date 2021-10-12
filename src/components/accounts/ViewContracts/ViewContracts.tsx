import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { readPursesTerm, readConfigTerm } from 'rchain-token';
import * as rchainToolkit from 'rchain-toolkit';

import * as fromBlockchain from '/store/blockchain';
import { Blockchain, RChainInfos, Account, RChainContractConfig, RChainTokenPurse } from '/models';
import { multiCallParseAndValidate, RequestResult } from '/utils/wsUtils';
import { getNodeIndex } from '/utils/getNodeIndex';
import { rchainTokenValidators, ValidationError } from '/store/decoders';

import { toRGB } from '../ViewBox';
import { ViewPurse } from './ViewPurse';
import { ContractMetadata } from './ContractMetadata';

import './ViewContracts.scss';

const parseRhoValToJs = (r: { data: string }) => {
  const data = JSON.parse(r.data);
  if (data && data.expr && data.expr[0]) {
    return rchainToolkit.utils.rhoValToJs(JSON.parse(r.data).expr[0]);
  }

  return undefined;
};

async function getPursesAndContractConfig({
  blockchain,
  pursesIds,
  masterRegistryUri,
  contractId,
  version,
}: {
  blockchain: Blockchain;
  pursesIds: string[];
  masterRegistryUri: string;
  contractId: string;
  version: string;
}): Promise<[RequestResult<Record<string, RChainTokenPurse>>, RequestResult<RChainContractConfig>]> {
  const indexes = blockchain.nodes.filter((n) => n.readyState === 1).map(getNodeIndex);

  return multiCallParseAndValidate(
    [
      {
        execute: () => readPursesTerm({ masterRegistryUri, contractId, pursesIds }),
        parse: parseRhoValToJs,
        validate: rchainTokenValidators[version].purses,
      },
      {
        execute: () => readConfigTerm({ masterRegistryUri, contractId }),
        parse: parseRhoValToJs,
        validate: rchainTokenValidators[version].contractConfig,
      },
    ],
    {
      chainId: blockchain.chainId,
      urls: indexes,
      resolverMode: 'absolute',
      resolverAccuracy: 100,
      resolverAbsolute: indexes.length,
      multiCallId: fromBlockchain.EXPLORE_DEPLOY_X,
    }
  ) as Promise<[RequestResult<Record<string, RChainTokenPurse>>, RequestResult<RChainContractConfig>]>;
}

const Loading = (props: { contractId: string }) => {
  return (
    <Fragment>
      <div className="address-and-copy fc">
        <span className="address">
          {t('contract') + ' '}
          {props.contractId}
        </span>
        <i className="fa fa-after fa-redo rotating"></i>
      </div>
    </Fragment>
  );
};
export interface ViewContractsProps {
  namesBlockchain?: Blockchain;
  contractId: string;
  rchainInfos: RChainInfos;
  pursesIds: string[];
  version: string;
  privateKey?: string;
  account: Account;
  getPursesAndContractConfig: typeof getPursesAndContractConfig;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}

interface ViewContractsState {
  purses: Record<string, RChainTokenPurse>;
  refreshing: boolean;
  error?: string;
  contractConfig?: RChainContractConfig;
}

export class ViewContractsComponent extends React.Component<ViewContractsProps, ViewContractsState> {
  constructor(props: ViewContractsProps) {
    super(props);
    this.state = {
      purses: {},
      refreshing: false,
    };
  }

  componentDidMount() {
    this.refresh();
  }

  displayError(message: string) {
    this.setState({
      refreshing: false,
      error: message,
    });
  }

  refresh = async () => {
    if (this.state.refreshing) {
      return;
    }

    this.setState({
      error: undefined,
      purses: {},
      refreshing: true,
    });

    if (!this.props.namesBlockchain) {
      this.displayError(t('Names blockchain not found'));
      return;
    }

    const [pursesRequest, contractConfigRequest] = await this.props.getPursesAndContractConfig({
      blockchain: this.props.namesBlockchain,
      pursesIds: this.props.pursesIds.slice(0, 100),
      masterRegistryUri: this.props.rchainInfos.info.rchainNamesMasterRegistryUri,
      contractId: this.props.contractId,
      version: this.props.version,
    });

    const validationErrors = [pursesRequest.validationErrors, contractConfigRequest.validationErrors]
      .filter((v) => !!v)
      .flatMap((e) => e) as ValidationError[];

    if (validationErrors.length) {
      this.displayError(validationErrors.map((e) => `${t('error')} on ${e.dataPath}: ${e.message}`).join(', '));
      return;
    }

    this.setState({
      refreshing: false,
      purses: pursesRequest.result,
      contractConfig: contractConfigRequest.result,
    });
  };

  render() {
    if (this.state.error) {
      return (
        <div data-testid="error">
          <span className="text-danger">{this.state.error}</span>
        </div>
      );
    }
    if (this.state.contractConfig) {
      const contractConfig = this.state.contractConfig as RChainContractConfig;
      return (
        <Fragment>
          <div className="address-and-copy fc">
            <span className="address">
              {t('contract') + ' '}
              {contractConfig.fungible && <span title="Contract for fungible tokens">FT</span>}
              {!contractConfig.fungible && <span title="Contract for non-fungible tokens">NFT</span>}
              {this.props.contractId}
            </span>

            <span className="square ml5" style={{ background: toRGB(this.props.contractId) }}></span>
            <a type="button" className="underlined-link" onClick={() => window.copyToClipboard(this.props.contractId)}>
              <i className="fa fa-copy fa-before"></i>
              {t('copy contract address')}
            </a>
          </div>
          <ContractMetadata contractConfig={contractConfig} />
          {this.props.pursesIds.length > 100 && (
            <div className="x-by-100-purses">Purses 100 / {this.props.pursesIds.length}</div>
          )}
          <div className="view-purses">
            {this.props.pursesIds.length === 0 ? (
              <div>
                <span className="no-purses">No purses</span>
              </div>
            ) : undefined}
            {this.props.pursesIds.slice(0, 100).map((id) => {
              return (
                <ViewPurse
                  rchainInfos={this.props.rchainInfos}
                  account={this.props.account}
                  key={id}
                  id={id}
                  contractId={this.props.contractId}
                  fungible={contractConfig.fungible}
                  privateKey={this.props.privateKey}
                  purse={this.state.purses[id]}
                  sendRChainTransaction={this.props.sendRChainTransaction}
                  contractExpiration={contractConfig.expires}
                />
              );
            })}
            {this.props.pursesIds.length > 100 && <div className="more-purses">...</div>}
          </div>
        </Fragment>
      );
    } else {
      return <Loading contractId={this.props.contractId}></Loading>;
    }
  }
}

export const ViewContracts = connect(null, () => ({
  getPursesAndContractConfig,
}))(ViewContractsComponent);
