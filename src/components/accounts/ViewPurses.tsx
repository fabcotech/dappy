import React, { Fragment, useState } from 'react';
import { readPursesTerm, readTerm } from 'rchain-token';
import * as rchainToolkit from 'rchain-toolkit';
import Ajv from 'ajv';

import * as fromBlockchain from '../../store/blockchain';
import { Blockchain, MultiCallError, MultiCallResult } from '../../models';
import { multiCall } from '../../utils/wsUtils';
import { getNodeIndex } from '../../utils/getNodeIndex';
import { rchainTokenValidators } from '../../store/decoders';
import { toRGB } from './ViewBox';
import './ViewPurses.scss';

const ajv = new Ajv();

interface ViewPursesProps {
  namesBlockchain: Blockchain | undefined;
  contractRegistryUri: string;
  pursesIds: string[];
}
interface ViewPursesState {
  fungible: boolean | undefined;
  purses: any;
  refreshing: boolean;
  error: undefined | string;
}

export class ViewPursesComponent extends React.Component<ViewPursesProps, ViewPursesState> {
  constructor(props: ViewPursesProps) {
    super(props);
    this.state = {
      fungible: undefined,
      error: undefined,
      purses: undefined,
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
      purses: undefined,
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
              readPursesTerm(this.props.contractRegistryUri, {
                pursesIds: this.props.pursesIds.slice(0, 100),
              }),
              readTerm(this.props.contractRegistryUri),
            ],
          },
        },
        {
          chainId: this.props.namesBlockchain.chainId,
          urls: indexes,
          resolverMode: 'absolute',
          resolverAccuracy: 100,
          resolverAbsolute: indexes.length,
          multiCallId: fromBlockchain.EXECUTE_NODES_CRON_JOBS,
        }
      );
    } catch (err) {
      this.setState({
        refreshing: false,
        error: err,
      });
      return;
    }

    try {
      const dataFromBlockchain = (multiCallResult as MultiCallResult).result.data;
      const dataFromBlockchainParsed: { data: { results: { data: string }[] } } = JSON.parse(dataFromBlockchain);
      const fungible = rchainToolkit.utils.rhoValToJs(JSON.parse(dataFromBlockchainParsed.data.results[1].data).expr[0])
        .fungible;
      if (fungible !== true && fungible !== false) {
        this.setState({
          refreshing: false,
          error: 'Could not get fungible property of the contract',
        });
        return;
      }
      const val = rchainToolkit.utils.rhoValToJs(JSON.parse(dataFromBlockchainParsed.data.results[0].data).expr[0]);
      const validate = ajv.compile(rchainTokenValidators['5.0.0'].purses);
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
        <div className="address-and-copy fc">
          <span className="">
            Contract
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
            {this.props.contractRegistryUri}
          </span>
          <span className="square ml5" style={{ background: toRGB(this.props.contractRegistryUri) }}></span>
          <a
            type="button"
            className="button is-white is-small"
            onClick={() => window.copyToClipboard(this.props.contractRegistryUri)}>
            copy contract address
            <i className="fa fa-copy fa-after"></i>
          </a>
        </div>
        <div className="view-purses">
          {this.props.pursesIds.map((id) => {
            return (
              <div className="view-purse">
                <span className="id">{id}</span>
                {this.state.purses && this.state.purses[id] ? (
                  <div className="values">
                    <span>type: {this.state.purses[id].type}</span>
                    <span>quantity: {this.state.purses[id].quantity}</span>
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
        </div>
      </Fragment>
    );
  }
}

export const ViewPurses = ViewPursesComponent;
