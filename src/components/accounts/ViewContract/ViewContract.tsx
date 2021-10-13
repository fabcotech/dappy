import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import * as fromBlockchain from '/store/blockchain';
import { getPursesAndContractConfig } from '/api/dappy';
import { Blockchain, RChainInfos, Account, RChainContractConfig, RChainTokenPurse } from '/models';
import { ContractHeader } from '/components/utils/ContractHeader'
import { ValidationError } from '/store/decoders';

import { ViewPurse } from './ViewPurse';

import './ViewContract.scss';

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
export interface ViewContractProps {
  namesBlockchain: Blockchain | undefined;
  contractId: string;
  rchainInfos: RChainInfos;
  pursesIds: string[];
  version: string;
  privateKey: string | undefined;
  account: Account;
  getPursesAndContractConfig: typeof getPursesAndContractConfig;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}

interface ViewContractState {
  purses: Record<string, RChainTokenPurse>;
  refreshing: boolean;
  error?: string;
  contractConfig?: RChainContractConfig;
}

export class ViewContractComponent extends React.Component<ViewContractProps, ViewContractState> {
  constructor(props: ViewContractProps) {
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
          <ContractHeader contractConfig={contractConfig} />
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

export const ViewContract = connect(null, () => ({
  getPursesAndContractConfig,
}))(ViewContractComponent);
