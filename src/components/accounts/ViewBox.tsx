import React, { useState } from 'react';
import { readBoxTerm } from 'rchain-token';
import * as rchainToolkit from 'rchain-toolkit';
import Ajv from 'ajv';

import * as fromBlockchain from '../../store/blockchain';
import { Blockchain, MultiCallError, MultiCallResult } from '../../models';
import { multiCall } from '../../utils/wsUtils';
import { getNodeIndex } from '../../utils/getNodeIndex';
import { rchainTokenValidators } from '../../store/decoders';
import { ViewPurses } from './ViewPurses';
import './ViewBox.scss';

const ajv = new Ajv();

interface BoxProps {
  back: () => void;
  boxRegistryUri: string;
  namesBlockchain: Blockchain | undefined;
}
interface BoxState {
  readBox: any;
  error: undefined | string;
  refreshing: boolean;
}

const toRGB = (s: string) => {
  var hash = 0;
  if (s.length === 0) return hash;
  for (var i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  var rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 255;
    rgb[i] = value;
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

export class ViewBoxComponent extends React.Component<BoxProps, BoxState> {
  constructor(props: BoxProps) {
    super(props);
    this.state = {
      readBox: undefined,
      error: undefined,
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
      readBox: undefined,
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
      console.log(readBoxTerm(this.props.boxRegistryUri));

      const indexes = this.props.namesBlockchain.nodes.filter((n) => n.readyState === 1).map(getNodeIndex);
      console.log(indexes);
      multiCallResult = await multiCall(
        {
          type: 'api/explore-deploy',
          body: {
            term: readBoxTerm(this.props.boxRegistryUri),
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
      const validate = ajv.compile(rchainTokenValidators['5.0.0'].readBox);
      const valid = validate(val);
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
        readBox: val,
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
        <div className="settings-view-box pb20">
          <button onClick={this.props.back} className="button is-light">
            Back to accounts
          </button>
          <h4 className="title is-4">Purses in box {this.props.boxRegistryUri}</h4>
          <span className="text-danger">{this.state.error}</span>
        </div>
      );
    }

    if (this.state.refreshing) {
      return (
        <div className="settings-box pb20">
          Loading
          <i className="fa fa-after fa-redo rotating"></i>
        </div>
      );
    }

    if (this.state.readBox) {
      console.log(this.state.readBox.superKeys);
      return (
        <div className="settings-view-box pb20">
          <button onClick={this.props.back} className="button is-light">
            Back to accounts
          </button>
          <h4 className="title is-4">Box {this.props.boxRegistryUri}</h4>
          <h4 className="title is-5">Purses</h4>
          <p>
            A box can contains one or more purses from one or more contracts. A purse can be a NFT, or a represent
            fungible tokens depending on the rchain-token contract it is linked to.
          </p>
          {Object.keys(this.state.readBox.purses).map((k) => {
            return (
              <div className="view-box" key={k}>
                <div className="address-and-copy fc">
                  <span className=""> Contract {k.replace('rho:id:', '')}</span>
                  <span className="square ml5" style={{ background: toRGB(k.replace('rho:id:', '')) }}></span>
                  <a
                    type="button"
                    className="button is-white is-small"
                    onClick={() => window.copyToClipboard(k.replace('rho:id:', ''))}>
                    copy contract address
                    <i className="fa fa-copy fa-after"></i>
                  </a>
                </div>
                <ViewPurses
                  namesBlockchain={this.props.namesBlockchain}
                  contractRegistryUri={k}
                  pursesIds={this.state.readBox.purses[k]}></ViewPurses>
              </div>
            );
          })}
          {this.state.readBox.superKeys && this.state.readBox.superKeys.length ? (
            <div className="super-keys">
              <h4 className="title is-5">Super keys</h4>
              <p>
                A box can store super keys. Usually you own a super key for a contract that you have deployed, this
                capabability allows you to create purses, you can also lock the contract to loose this capability.
              </p>
              {this.state.readBox.superKeys.map((sk: string) => {
                return (
                  <span key={sk} className="super-key">
                    <i className="fa fa-key fa-before"></i>
                    {sk.replace('rho:id:', '')}
                    <span className="square" style={{ background: toRGB(sk.replace('rho:id:', '')) }}></span>
                    <a
                      type="button"
                      className="button is-white is-small"
                      onClick={() => window.copyToClipboard(sk.replace('rho:id:', ''))}>
                      copy contract address
                      <i className="fa fa-copy fa-after"></i>
                    </a>
                  </span>
                );
              })}
            </div>
          ) : undefined}
        </div>
      );
    }
    return <div className="settings-box pb20"></div>;
  }
}

export const ViewBox = ViewBoxComponent;
