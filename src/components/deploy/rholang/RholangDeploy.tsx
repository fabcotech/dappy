import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { rhoValToJs } from 'rchain-toolkit/dist/utils';

import { buildUnforgeableDeployQuery } from '/utils/buildUnforgeableDeployQuery';
import { buildUnforgeableNameQuery } from '/utils/buildUnforgeableNameQuery';
import { multiCall } from '/interProcess';
import { Account, Blockchain, RChainInfos, TransactionState, TransactionStatus, MultiCallError } from '/models';
import * as fromBlockchain from '/store/blockchain';
import * as fromMain from '/store/main';
import * as fromSettings from '/store/settings';
import { TransactionForm } from '../../utils';
import { blockchain as blockchainUtils } from '/utils';
import { getNodeIndex } from '/utils/getNodeIndex';
import './RholangDeploy.scss';

const defaultRholang = `new a, stdout(\`rho:io:stdout\`), deployId(\`rho:rchain:deployId\`) in {\n  a!("bonjour !") |\n  stdout!("bonjour !") |\n  deployId!("bonjour !")\n}`;
const depth = 5;

interface RholangDeployProps {
  accounts: { [accountName: string]: Account };
  blockchains: {
    [chainId: string]: Blockchain;
  };
  settings: fromSettings.Settings;
  rchainInfos: { [chainId: string]: RChainInfos };
  transactions: { [id: string]: TransactionState };
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
  openModal: (t: fromMain.OpenModalPayload) => void;
}

interface RholangDeployState {
  step: number;
  rholang: string; // step 1
  privatekey: string; // step 2
  publickey: string; // step 2
  accountName: string; // step 2
  phloLimit: number; // step 2
  parsedResp: string; // step 3
  jsValue: string; // step 3
  run: number; // step 3
  nodes: string[]; // step 3
}

export class RholangDeployComponent extends React.Component<RholangDeployProps, {}> {
  state: RholangDeployState = {
    rholang: defaultRholang,
    step: 1,
    privatekey: '',
    publickey: '',
    accountName: '',
    phloLimit: 0,
    parsedResp: '',
    jsValue: '',
    run: 0,
    nodes: [],
  };
  transactionId = '';
  deployId = '';
  unforgeableName = '';
  signature = '';
  interval: NodeJS.Timeout | undefined = undefined;
  query: { [type: string]: string } | undefined = undefined;
  el: HTMLTextAreaElement | undefined = undefined;

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  saveRef = (el: HTMLTextAreaElement) => {
    this.el = el;
    if (el) el.value = this.state.rholang;
  };

  onFilledTransactionData = (t: {
    privatekey: string;
    publickey: string;
    phloLimit: number;
    box: undefined | string;
    accountName: undefined | string;
  }) => {
    if (!this.state.rholang) {
      return;
    }
    try {
      this.setState({
        accountName: t.accountName,
        privatekey: t.privatekey,
        phloLimit: t.phloLimit,
        publickey: t.publickey,
      });
    } catch (err) {}
  };

  onBackToStep1 = () => {
    this.deployId = '';
    this.unforgeableName = '';
    this.setState({
      step: 1,
      run: 0,
    });
  };

  initStep3 = (query: any) => {
    this.setState({
      parsedResp: '',
      jsValue: '',
      run: 1,
      step: 3,
      nodes: [],
    });
    const that = this;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    this.query = query;
    const func = () => {
      try {
        const blockchainId = Object.keys(this.props.blockchains)[0];
        let nodes = this.props.blockchains[blockchainId].nodes.filter((n) => n.readyState === 1);
        multiCall(query, {
          chainId: blockchainId,
          urls: nodes.map(getNodeIndex),
          resolverMode: this.props.settings.resolverMode,
          resolverAccuracy: this.props.settings.resolverAccuracy,
          resolverAbsolute: this.props.settings.resolverAbsolute,
          multiCallId: fromBlockchain.LISTEN_FOR_DATA_AT_NAME,
        })
          .then((resp) => {
            const parsedResp = JSON.parse(resp.result.data);
            let p;
            try {
              p = JSON.parse(parsedResp.data.results[0].data);
            } catch (e) {}

            // get data at name
            if (parsedResp && parsedResp.data && parsedResp.data.expr) {
              this.setState({
                parsedResp: JSON.stringify(parsedResp.data, null, 2),
                jsValue: JSON.stringify(rhoValToJs(parsedResp.data.expr), null, 2),
                run: 0,
                nodes: nodes.map((p) => `${p.ip}, ${p.host}`),
              });
              if (this.interval) {
                clearInterval(this.interval);
                this.interval = undefined;
              }
            } else if (parsedResp && parsedResp.data && parsedResp.data.results[0] && p && p.expr) {
              const expr = p.expr;
              this.setState({
                parsedResp: expr[0] ? JSON.stringify(expr[0], null, 2) : 'No data',
                jsValue: expr[0] ? JSON.stringify(rhoValToJs(expr[0]), null, 2) : 'No data',
                run: 0,
                nodes: nodes.map((p) => `${p.ip}, ${p.host}`),
              });
              if (this.interval) {
                clearInterval(this.interval);
                this.interval = undefined;
              }
            } else {
              console.log('Did not find transaction data (unforgeable name), will try again in 15 seconds');
              this.setState({
                run: this.state.run + 1,
              });
            }
          })
          .catch((err: MultiCallError) => {
            console.log('Error when getting transaction data (unforgeable name)');
            console.log(err.error.error);
            this.props.openModal({
              title: 'Error when getting transaction data',
              text: err.error.error,
              buttons: [
                {
                  classNames: 'is-link',
                  text: 'Ok',
                  action: fromMain.closeModalAction(),
                },
              ],
            });
          });
      } catch (err) {
        console.log('Error when getting transaction data (unforgeable name)');
        console.log(err.message || err);
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = undefined;
        }
        this.setState({
          run: 0,
          nodes: [],
        });
        this.props.openModal({
          title: 'Error when getting transaction data',
          text: err.message || err,
          buttons: [
            {
              classNames: 'is-link',
              text: 'Ok',
              action: fromMain.closeModalAction(),
            },
          ],
        });
      }
    };

    this.interval = setInterval(func, 15000);
    func();
  };

  onDeploy = () => {
    const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
    this.transactionId = id;

    const timestamp = new Date().valueOf();
    try {
      const previewUnforgeable = async () => {
        if (!this.state.rholang) {
          this.props.openModal({
            title: 'Failed to deploy rholang',
            text: `Unknwon error occured`,
            buttons: [
              {
                classNames: 'is-link',
                text: 'Ok',
                action: fromMain.closeModalAction(),
              },
            ],
          });
          return;
        }
        const chainId = Object.keys(this.props.blockchains)[0];
        if (!chainId) {
          this.props.openModal({
            title: 'Failed to deploy rholang',
            text: `You need to be connected to a blockchain with at least one endpoint available`,
            buttons: [
              {
                classNames: 'is-link',
                text: 'Ok',
                action: fromMain.closeModalAction(),
              },
            ],
          });
          return;
        }

        const term = this.state.rholang;
        let validAfterBlockNumber = 0;
        if (this.props.rchainInfos && this.props.rchainInfos[chainId]) {
          validAfterBlockNumber = this.props.rchainInfos[chainId].info.lastFinalizedBlockNumber;
        }
        const deployOptions = blockchainUtils.rchain.getDeployOptions(
          timestamp,
          term,
          this.state.privatekey,
          this.state.publickey,
          1,
          this.state.phloLimit,
          validAfterBlockNumber
        );
        this.signature = deployOptions.signature;
        this.props.sendRChainTransaction({
          transaction: deployOptions,
          origin: { origin: 'rholang', accountName: this.state.accountName },
          platform: 'rchain',
          blockchainId: chainId,
          id: id,
          alert: false,
          sentAt: new Date().toISOString(),
        });
      };

      previewUnforgeable();
    } catch (err) {
      console.log(err.message || err);
      this.props.openModal({
        title: 'Failed to deploy rholang',
        text: err.message || err,
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
        ],
      });
    }
  };

  render() {
    if (
      this.transactionId &&
      this.props.transactions[this.transactionId] &&
      this.props.transactions[this.transactionId].status === TransactionStatus.Aired
    ) {
      const transaction = this.props.transactions[this.transactionId];
      this.transactionId = '';
      if (transaction.value && typeof transaction.value === 'string') {
        this.deployId = transaction.value.slice(24);
        this.deployId = this.deployId.substr(0, this.deployId.length - 1);
        this.unforgeableName = '';
        this.initStep3({
          type: 'api/listen-for-data-at-name',
          body: {
            name: buildUnforgeableDeployQuery(this.deployId),
            depth: depth,
          },
        });
      } else {
        console.log('Error, transaction value is not string :', transaction.value);
      }
      this.props.openModal({
        title: 'Rholang successfully deployed',
        text: t('transaction successful'),
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
        ],
      });
    }
    let runningGetDataAtName = false;
    let getDataAtName = this.query && this.query.type === 'api/listen-for-data-at-name';
    let runningExploreDeploy = false;
    let exploreDeploy = this.query && this.query.type === 'explore-deploy-x';
    if (this.state.run > 0 && !this.state.parsedResp && this.query) {
      runningGetDataAtName = this.query.type === 'api/listen-for-data-at-name';
      runningExploreDeploy = this.query.type === 'explore-deploy-x';
    }

    return (
      <div className="pb20 settings-rholang-deploy">
        <div>
          <b className="label">
            {/* this.state.step === 1 && t('deploy rholang (step 1)') */}
            {this.state.step === 2 && t('deploy rholang (step 2)')}
          </b>
          {this.state.step === 1 ? (
            <div>
              <div className="field check-deploy-id">
                <label className="label">Check deploy ID</label>
                <div className="control">
                  <input
                    className="input"
                    onChange={(e) => {
                      this.deployId = e.target.value;
                      this.setState({});
                    }}
                    type="text"
                    placeholder="Deploy ID"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      this.unforgeableName = '';
                      this.initStep3({
                        type: 'api/listen-for-data-at-name',
                        body: {
                          name: buildUnforgeableDeployQuery(this.deployId),
                          depth: depth,
                        },
                      });
                    }}
                    className="button is-link"
                    disabled={!this.deployId}>
                    Directly check deploy ID
                  </button>
                </div>
              </div>
              <div className="field check-deploy-id">
                <label className="label">Check unforgeable name</label>
                <div className="control">
                  <input
                    className="input"
                    onChange={(e) => {
                      this.unforgeableName = e.target.value;
                      this.setState({});
                    }}
                    type="text"
                    placeholder="Deploy ID"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      this.deployId = '';
                      this.initStep3({
                        type: 'api/listen-for-data-at-name',
                        body: {
                          name: buildUnforgeableNameQuery(this.unforgeableName),
                          depth: depth,
                        },
                      });
                    }}
                    className="button is-link"
                    disabled={!this.unforgeableName}>
                    Directly check unforgeable name
                  </button>
                </div>
              </div>
              <hr />
              <div className="field">
                <label className="label">Deploy rholang</label>
                <textarea
                  className="textarea"
                  rows={16}
                  ref={this.saveRef}
                  onChange={(a) => {
                    this.setState({
                      rholang: a.target.value,
                    });
                  }}
                />
              </div>
              <br />
              <button
                type="button"
                onClick={() => {
                  this.setState({
                    step: 2,
                  });
                }}
                className="deploy-button button is-link"
                disabled={!this.state.rholang}>
                {t('next')} (deploy)
              </button>

              <button
                type="button"
                onClick={() => {
                  this.initStep3({
                    type: 'explore-deploy-x',
                    body: {
                      terms: [this.state.rholang],
                    },
                  });
                }}
                className="deploy-button button is-link"
                disabled={!this.state.rholang}>
                Free explore deploy
              </button>
            </div>
          ) : undefined}
          {this.state.step === 2 && this.state.rholang ? (
            <div>
              <br />
              <TransactionForm accounts={this.props.accounts} filledTransactionData={this.onFilledTransactionData} />
              <button type="button" className="button is-light" onClick={this.onBackToStep1}>
                {t('back')}
              </button>{' '}
              <button
                type="button"
                onClick={this.onDeploy}
                className="button is-link"
                disabled={!this.state.rholang || !this.state.privatekey}>
                {t('deploy')}
              </button>
            </div>
          ) : undefined}
          {this.state.step === 3 ? (
            <div>
              <p>
                {runningGetDataAtName || runningExploreDeploy ? (
                  <i className="fa fa-before fa-redo rotating"></i>
                ) : undefined}
                {getDataAtName
                  ? `Now trying to get data every 15 seconds, note that depth is limited to ${depth} blocks in the past (run ${this.state.run})`
                  : undefined}
                {this.query && this.query.type === 'explore-deploy-x' ? `Running explore deploy` : undefined}
              </p>
              <br />
              {getDataAtName && this.deployId && (
                <Fragment>
                  <p>
                    Data will be retreived from deploy ID <b>new deployId(`rho:rchain:deployId`)</b>
                    <br />
                  </p>
                  <p className="deploy-id">
                    deploy ID: {this.deployId}
                    <br />
                    <br />
                  </p>
                </Fragment>
              )}
              {getDataAtName && this.unforgeableName && (
                <Fragment>
                  <p>
                    Data will be retreived from unforgeable name
                    <br />
                  </p>
                  <p className="deploy-id">
                    unforgeable name: {this.unforgeableName}
                    <br />
                    <br />
                  </p>
                </Fragment>
              )}
              {this.state.nodes.length ? (
                <div>
                  <b>Nodes queried</b>
                  <br />
                  {this.state.nodes.join('\n')}
                  <br />
                </div>
              ) : undefined}
              <div>
                <b>Raw data</b>
                <br />
                {this.state.parsedResp && <pre>{this.state.parsedResp}</pre>}
                {!this.state.parsedResp && <pre>No data</pre>}
              </div>
              <div>
                <b>Rholang expression as JSON / simplified</b>
                <br />
                {this.state.jsValue && <pre>{this.state.jsValue}</pre>}
                {!this.state.jsValue && <pre>No data</pre>}
              </div>
              <br />
              <button
                disabled={runningGetDataAtName || runningExploreDeploy}
                type="button"
                className="deploy-button button is-link"
                onClick={() => this.initStep3(this.query)}>
                Rerun
                {getDataAtName ? ' data-at-name query' : undefined}
                {exploreDeploy ? ' explore-deploy query' : undefined}
              </button>
              <br />
              <button type="button" className="button is-light" onClick={this.onBackToStep1}>
                {t('back')}
              </button>{' '}
            </div>
          ) : undefined}
        </div>
      </div>
    );
  }
}

export const RholangDeploy = connect(
  (state) => {
    return {
      accounts: fromSettings.getRChainAccounts(state),
      blockchains: fromSettings.getOkBlockchains(state),
      rchainInfos: fromBlockchain.getRChainInfos(state),
      transactions: fromBlockchain.getTransactions(state),
      settings: fromSettings.getSettings(state),
    };
  },
  (dispatch) => ({
    sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => {
      dispatch(
        fromBlockchain.sendRChainTransactionAction({
          ...t,
          alert: false,
        })
      );
    },
    openModal: (t: fromMain.OpenModalPayload) => {
      dispatch(fromMain.openModalAction(t));
    },
  })
)(RholangDeployComponent);
