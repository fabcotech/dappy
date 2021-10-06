import React, { Fragment } from 'react';
import { readPursesTerm, readConfigTerm } from 'rchain-token';
import * as rchainToolkit from 'rchain-toolkit';
import Ajv from 'ajv';

import * as fromBlockchain from '../../../store/blockchain';
import { Blockchain, MultiCallResult, RChainInfos, Account } from '../../../models';
import { multiCall } from '../../../utils/wsUtils';
import { feePermillage, toDuration, toDurationString } from '../../../utils/unit';
import { getNodeIndex } from '../../../utils/getNodeIndex';
import { rchainTokenValidators } from '../../../store/decoders';
import { toRGB } from '../ViewBox';
import { ViewPurse } from './ViewPurse';
import { ContractConfig, Fee } from '../../../models';

import './ViewContracts.scss';

const ajv = new Ajv();

interface ViewContractsProps {
  namesBlockchain: Blockchain | undefined;
  contractId: string;
  rchainInfos: RChainInfos;
  pursesIds: string[];
  version: string;
  privateKey: undefined | string;
  account: Account;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}
interface ViewContractsState {
  fungible?: boolean;
  purses: any;
  refreshing: boolean;
  error?: string;
  contractConfig: ContractConfig;
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

  refresh = async () => {
    if (this.state.refreshing) {
      return;
    }
    this.setState({
      fungible: undefined,
      error: undefined,
      purses: {},
      refreshing: true,
    });
    let multiCallResult;
    if (!this.props.namesBlockchain) {
      this.setState({
        refreshing: false,
        error: 'Names blockchain not found',
      });
      return;
    }
    try {
      const indexes = this.props.namesBlockchain.nodes.filter((n) => n.readyState === 1).map(getNodeIndex);
      multiCallResult = await multiCall(
        {
          type: 'explore-deploy-x',
          body: {
            terms: [
              readPursesTerm({
                masterRegistryUri: this.props.rchainInfos.info.rchainNamesMasterRegistryUri,
                contractId: this.props.contractId,
                pursesIds: this.props.pursesIds.slice(0, 100),
              }),
              readConfigTerm({
                masterRegistryUri: this.props.rchainInfos.info.rchainNamesMasterRegistryUri,
                contractId: this.props.contractId,
              }),
            ],
          },
        },
        {
          chainId: this.props.namesBlockchain.chainId,
          urls: indexes,
          resolverMode: 'absolute',
          resolverAccuracy: 100,
          resolverAbsolute: indexes.length,
          multiCallId: fromBlockchain.EXPLORE_DEPLOY_X,
        }
      );
    } catch (err) {
      this.setState({
        refreshing: false,
        error: err.error.error,
      });
      return;
    }

    try {
      const dataFromBlockchain = (multiCallResult as MultiCallResult).result.data;
      const dataFromBlockchainParsed: { data: { results: { data: string }[] } } = JSON.parse(dataFromBlockchain);
      const contractConfig = rchainToolkit.utils.rhoValToJs(
        JSON.parse(dataFromBlockchainParsed.data.results[1].data).expr[0]
      ) as ContractConfig;
      const fungible = contractConfig.fungible;

      if (fungible !== true && fungible !== false) {
        this.setState({
          refreshing: false,
          error: 'Could not get fungible property of the contract',
        });
        return;
      }
      let val = {};
      try {
        val = rchainToolkit.utils.rhoValToJs(JSON.parse(dataFromBlockchainParsed.data.results[0].data).expr[0]);
      } catch (err) {}
      const validate = ajv.compile(rchainTokenValidators[this.props.version].purses);
      const valid = validate(Object.values(val));
      if (!valid) {
        this.setState({
          refreshing: false,
          error: (validate.errors as { dataPath: string; message: string }[])
            .map((e) => `body${e.dataPath} ${e.message}`)
            .join(', '),
        });
        return;
      }
      this.setState({
        refreshing: false,
        purses: val,
        fungible: fungible,
        contractConfig,
        //        contractExpiration: contractConfig.expires,
        // contractFee: contractConfig.fee,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        refreshing: false,
        error: 'Could not validate response, contrat: ' + this.props.contractId,
      });
    }
  };

  render() {
    if (this.state.error) {
      return (
        <div>
          <span className="text-danger">{this.state.error}</span>
        </div>
      );
    }
    return (
      <Fragment>
        <div className="address-and-copy fc">
          <span className="address">
            {t('contract') + ' '}
            {this.state.fungible === true && (
              <span title="Contract for fungible tokens" className="tag is-light">
                FT
              </span>
            )}
            {this.state.fungible === false && (
              <span title="Contract for non-fungible tokens" className="tag is-light">
                NFT
              </span>
            )}
            {this.props.contractId}
          </span>

          <span className="square ml5" style={{ background: toRGB(this.props.contractId) }}></span>
          <a type="button" className="underlined-link" onClick={() => window.copyToClipboard(this.props.contractId)}>
            <i className="fa fa-copy fa-before"></i>
            {t('copy contract address')}
          </a>
        </div>
        <div className="mb-2">
          {this.state.contractConfig && (
            <span className={`${this.state.contractConfig.locked ? 'has-text-success' : 'has-text-danger'}`}>
              <i className={`mr-1 fa fa-${this.state.contractConfig.locked ? 'lock' : 'lock-open'}`}></i>
              {t(this.state.contractConfig.locked ? 'locked' : 'unlocked')}
            </span>
          )}
          {this.state.contractConfig && this.state.contractConfig.expires && (
            <span className="ml-2">
              <i className="fa fa-clock mx-1"></i>
              {t('expires in')} {toDurationString(t, toDuration(this.state.contractConfig.expires))}
            </span>
          )}
          {this.state.contractConfig && this.state.contractConfig.fee && (
            <span className="ml-2">
              <i className="fa fa-money-bill-wave mr-1"></i>
              {t('fee')}: {feePermillage(this.state.contractConfig.fee)}
            </span>
          )}
        </div>
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
                fungible={this.state.fungible}
                privateKey={this.props.privateKey}
                purse={this.state.purses[id]}
                sendRChainTransaction={this.props.sendRChainTransaction}
              />
            );
          })}
          {this.props.pursesIds.length > 100 && <div className="more-purses">...</div>}
        </div>
      </Fragment>
    );
  }
}

export const ViewContracts = ViewContractsComponent;
