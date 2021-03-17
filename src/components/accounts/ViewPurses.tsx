import React, { useState } from 'react';
import { readPursesTerm } from 'rchain-token';
import * as rchainToolkit from 'rchain-toolkit';
import Ajv from 'ajv';

import * as fromBlockchain from '../../store/blockchain';
import { Blockchain, MultiCallError, MultiCallResult } from '../../models';
import { multiCall } from '../../utils/wsUtils';
import { getNodeIndex } from '../../utils/getNodeIndex';
import { rchainTokenValidators } from '../../store/decoders';
import './ViewPurses.scss';

const ajv = new Ajv();

interface ViewPursesProps {
  namesBlockchain: Blockchain | undefined;
  contractRegistryUri: string;
  pursesIds: string[];
}
interface ViewPursesState {
  purses: any;
  refreshing: boolean;
  error: undefined | string;
}

export class ViewPursesComponent extends React.Component<ViewPursesProps, ViewPursesState> {
  constructor(props: ViewPursesProps) {
    super(props);
    this.state = {
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
          type: 'api/explore-deploy',
          body: {
            term: readPursesTerm(this.props.contractRegistryUri.replace('rho:id:', ''), {
              pursesIds: this.props.pursesIds.slice(0, 100),
            }),
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
      const dataFromBlockchainParsed: { data: string } = JSON.parse(dataFromBlockchain);
      const val = rchainToolkit.utils.rhoValToJs(JSON.parse(dataFromBlockchainParsed.data).expr[0]);
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
    );
  }
}

export const ViewPurses = ViewPursesComponent;
