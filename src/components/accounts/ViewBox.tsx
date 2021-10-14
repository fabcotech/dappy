import React from 'react';
import { readBoxTerm } from 'rchain-token';
import * as rchainToolkit from 'rchain-toolkit';
import Ajv from 'ajv';

import * as fromBlockchain from '/store/blockchain';
import { Blockchain, MultiCallResult, RChainInfos, Account } from '/models';
import { multiCall, copyToClipboard } from '/interProcess';
import { toRGB } from '/utils/color';
import { DAPPY_TOKEN_CONTRACT_ID, RCHAIN_TOKEN_SUPPORTED_VERSIONS } from '/CONSTANTS';
import { getNodeIndex } from '/utils/getNodeIndex';
import { rchainTokenValidators } from '/store/decoders';
import { ViewContract } from './ViewContract';
import './ViewBox.scss';
import { AccountPassword } from './AccountPassword';

const ajv = new Ajv();

interface BoxProps {
  back: () => void;
  boxId: string;
  account: Account;
  rchainInfos: RChainInfos;
  namesBlockchain: Blockchain | undefined;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}
interface BoxState {
  readBox: any;
  error: undefined | string;
  privateKey: undefined | string;
  refreshing: boolean;
}

export class ViewBoxComponent extends React.Component<BoxProps, BoxState> {
  constructor(props: BoxProps) {
    super(props);
    this.state = {
      readBox: undefined,
      error: undefined,
      refreshing: false,
      privateKey: undefined,
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
      const indexes = this.props.namesBlockchain.nodes.filter((n) => n.readyState === 1).map(getNodeIndex);
      multiCallResult = await multiCall(
        {
          type: 'api/explore-deploy',
          body: {
            term: readBoxTerm({
              masterRegistryUri: this.props.rchainInfos.info.rchainNamesMasterRegistryUri,
              boxId: this.props.boxId,
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
      console.log(err);
      this.setState({
        refreshing: false,
        error: err.error.error,
      });
      return;
    }

    try {
      const dataFromBlockchain = (multiCallResult as MultiCallResult).result.data;
      const dataFromBlockchainParsed: { data: string } = JSON.parse(dataFromBlockchain);
      const val = rchainToolkit.utils.rhoValToJs(JSON.parse(dataFromBlockchainParsed.data).expr[0]);
      if (!RCHAIN_TOKEN_SUPPORTED_VERSIONS.includes(val.version)) {
        this.setState({
          refreshing: false,
          error:
            '[rchain-token error]: only boxes and contract on version ' +
            RCHAIN_TOKEN_SUPPORTED_VERSIONS.join(',') +
            ' are supported',
        });
        return;
      }
      const valid = rchainTokenValidators[val.version].readBox(val);
      if (valid !== undefined) {
        this.setState({
          refreshing: false,
          error: valid.map((e) => e.message).join(', '),
        });
        return;
      }
      this.setState({
        refreshing: false,
        readBox: {
          ...val,
          purses: {
            [DAPPY_TOKEN_CONTRACT_ID]: [],
            ...val.purses,
          },
        },
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
    const Refresh = () => (
      <button
        onClick={() => {
          if (!this.state.refreshing) {
            this.refresh();
          }
        }}
        disabled={this.state.refreshing}
        className={`button is-light ${this.state.refreshing && 'disabled'}`}>
        {!this.state.refreshing && <i className="fa fa-before fa-redo"></i>}
        {this.state.refreshing && <i className="fa fa-before fa-redo rotating"></i>}
        {t('reload')}
      </button>
    );
    if (this.state.error) {
      return (
        <div className={`settings-view-box pb20`}>
          <button onClick={this.props.back} className="button is-light">
            {t('back to accounts')}
          </button>
          <Refresh />
          <h4 className="title is-4">
            <i className="fa fa-before fa-box"></i>
            {t('token box')} "{this.props.boxId}"
          </h4>

          <span className="text-danger">{this.state.error}</span>
        </div>
      );
    }

    if (this.state.refreshing) {
      return (
        <div className="settings-box pb20">
          <button onClick={this.props.back} className="button is-light">
            {t('back to accounts')}
          </button>
          <Refresh />
        </div>
      );
    }

    if (this.state.readBox) {
      return (
        <div className="settings-view-box pb20">
          <button onClick={this.props.back} className="button is-light">
            {t('back to accounts')}
          </button>
          <Refresh />
          <h4 className="title is-4">
            <i className="fa fa-before fa-box"></i>
            {t('token box')} "{this.props.boxId}"
          </h4>
          <div className="field unlock-account">
            <label className="is-5">
              <i className="fa fa-before fa-key"></i>
              {t('unlock account')}
            </label>
            <div className="control">
              <AccountPassword
                encrypted={this.props.account.encrypted}
                decryptedPrivateKey={(privateKey: undefined | string) =>
                  this.setState({ privateKey: privateKey })
                }></AccountPassword>
            </div>
            <p className="help">{t('unlock account help text')}</p>
          </div>
          <h4 className="title is-5">Purses</h4>
          <p>{t('box definition')}</p>
          {Object.keys(this.state.readBox.purses).map((k) => {
            return (
              <div className={`view-box ${k === DAPPY_TOKEN_CONTRACT_ID ? 'special' : ''}`} key={k}>
                <ViewContract
                  version={this.state.readBox.version}
                  namesBlockchain={this.props.namesBlockchain}
                  rchainInfos={this.props.rchainInfos}
                  contractId={k}
                  account={this.props.account}
                  privateKey={this.state.privateKey}
                  pursesIds={this.state.readBox.purses[k]}
                  sendRChainTransaction={this.props.sendRChainTransaction}></ViewContract>
              </div>
            );
          })}
          {this.state.readBox.superKeys && this.state.readBox.superKeys.length ? (
            <div className="super-keys">
              <h4 className="title is-5">Super keys</h4>
              <p>{t('box super key definition')}</p>
              {this.state.readBox.superKeys.map((sk: string) => {
                return (
                  <span key={sk} className="super-key">
                    <i className="fa fa-key fa-before"></i>
                    {sk.replace('rho:id:', '')}
                    <span className="square" style={{ background: toRGB(sk.replace('rho:id:', '')) }}></span>
                    &nbsp;
                    <a
                      type="button"
                      className="underlined-link"
                      onClick={() => copyToClipboard(sk.replace('rho:id:', ''))}>
                      <i className="fa fa-copy fa-before"></i>
                      {t('copy contract address')}
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
