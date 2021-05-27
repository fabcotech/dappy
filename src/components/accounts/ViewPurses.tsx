import React, { Fragment } from 'react';
import { readPursesTerm, readConfigTerm } from 'rchain-token';
import * as rchainToolkit from 'rchain-toolkit';
import Ajv from 'ajv';

import * as fromBlockchain from '../../store/blockchain';
import { Blockchain,  MultiCallResult, RChainInfos } from '../../models';
import { multiCall } from '../../utils/wsUtils';
import { getNodeIndex } from '../../utils/getNodeIndex';
import { rchainTokenValidators } from '../../store/decoders';
import { toRGB } from './ViewBox';
import './ViewPurses.scss';

const ajv = new Ajv();

interface ViewPursesProps {
  namesBlockchain: Blockchain | undefined;
  contractId: string;
  rchainInfos: RChainInfos;
  pursesIds: string[];
  version: string;
}
interface ViewPursesState {
  fungible: boolean | undefined;
  contractName: undefined | string;
  purses: any;
  refreshing: boolean;
  error: undefined | string;
}

export class ViewPursesComponent extends React.Component<ViewPursesProps, ViewPursesState> {
  constructor(props: ViewPursesProps) {
    super(props);
    this.state = {
      fungible: undefined,
      contractName: undefined,
      error: undefined,
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
      const values = rchainToolkit.utils.rhoValToJs(JSON.parse(dataFromBlockchainParsed.data.results[1].data).expr[0]);
      const fungible = values.fungible;
      const contractName = values.name;
      if (fungible !== true && fungible !== false) {
        this.setState({
          refreshing: false,
          error: 'Could not get fungible property of the contract',
        });
        return;
      }
      const val = rchainToolkit.utils.rhoValToJs(JSON.parse(dataFromBlockchainParsed.data.results[0].data).expr[0]);
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
        contractName: contractName,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        refreshing: false,
        error: 'Could not validate response',
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
        <div className="view-purses-contract-name">{this.state.contractName}</div>
        <div className="address-and-copy fc">
          <span className="">
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
          <a
            type="button"
            className="button is-white is-small"
            onClick={() => window.copyToClipboard(this.props.contractId)}>
            {t('copy contract address')}
            <i className="fa fa-copy fa-after"></i>
          </a>
        </div>
        {this.props.pursesIds.length > 100 && (
          <div className="x-by-100-purses">Purses 100 / {this.props.pursesIds.length}</div>
        )}
        <div className="view-purses">
          {this.props.pursesIds.slice(0, 100).map((id) => {
            return (
              <div key={id} className="view-purse">
                <span className="id">{id}</span>
                {this.state.purses && this.state.purses[id] ? (
                  <div className="values">
                    <span>
                      {t('type')}: {this.state.purses[id].type}
                    </span>
                    {
                      this.state.fungible &&
                      <span>
                        {t('quantity')}: {this.state.purses[id].quantity}
                      </span>
                    }
                    <span>
                      {this.state.purses[id].price ? <span>price: {this.state.purses[id].price} </span> : undefined}
                    </span>
                  </div>
                ) : (
                  <i className="fa fa-after fa-redo rotating"></i>
                )}
              </div>
            );
          })}
          {this.props.pursesIds.length > 100 && <div className="more-purses">...</div>}
        </div>
      </Fragment>
    );
  }
}

export const ViewPurses = ViewPursesComponent;
