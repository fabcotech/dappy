import React, { Fragment } from 'react';
import { purchaseTerm, readPursesTerm } from 'rchain-token';
import * as rchainToolkit from 'rchain-toolkit';

import './RecordsForm.scss';
import {
  Record,
  TransactionState,
  RChainInfos,
  Account,
  PartialRecord,
  TransactionStatus,
  Blockchain,
  MultiCallResult,
  RChainTokenPurse,
} from '../../../models';
import { blockchain as blockchainUtils } from '../../../utils';
import * as fromBlockchain from '../../../store/blockchain';
import { TransactionForm } from '../../utils';
import { multiCall } from '../../../utils/wsUtils';
import { getNodeIndex } from '../../../utils/getNodeIndex';
import { RecordForm } from '.';
import { LOGREV_TO_REV_RATE } from '../../../CONSTANTS';

interface PurchaseRecordProps {
  records: { [key: string]: Record };
  transactions: { [id: string]: TransactionState };
  rchainInfos: { [chainId: string]: RChainInfos };
  namesBlockchainInfos: RChainInfos | undefined;
  accounts: { [accountName: string]: Account };
  namesBlockchain: Blockchain;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const defaultState = {
  privatekey: '',
  publickey: '',
  box: '',
  phloLimit: 0,
  settingUpIpServers: false,
  partialRecord: undefined,

  name: '',
  loadNameError: undefined,
  loadedPurse: undefined,
  loadingPurse: false,
};

export class PurchaseRecord extends React.Component<PurchaseRecordProps, {}> {
  constructor(props: PurchaseRecordProps) {
    super(props);
    this.setTouched = undefined;
  }

  setTouched: undefined | (() => void);

  state: {
    privatekey: string;
    publickey: string;
    box: string | undefined;
    phloLimit: number;
    settingUpIpServers: boolean;
    partialRecord: PartialRecord | undefined;
    name: string;
    loadNameError: undefined | string;
    loadedPurse: undefined | RChainTokenPurse;
    loadingPurse: boolean;
  } = defaultState;

  transactionId = '';

  onFilledTransactionData = (t: {
    privatekey: string;
    publickey: string;
    phloLimit: number;
    box: string | undefined;
  }) => {
    this.setState(t);
    if (this.setTouched) this.setTouched();
  };

  onLookup = async () => {
    this.setState({
      loadingPurse: true,
      loadedPurse: undefined,
    });

    const indexes = this.props.namesBlockchain.nodes.map(getNodeIndex);

    // todo only ask for names that are not in this.state.availables
    let multiCallResult;
    try {
      multiCallResult = await multiCall(
        {
          type: 'explore-deploy-x',
          body: {
            terms: [
              readPursesTerm((this.props.namesBlockchainInfos as RChainInfos).info.rchainNamesRegistryUri, {
                pursesIds: [this.state.name, '0'],
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
      console.log(err);
      this.setState({
        loadedPurse: undefined,
        loadingPurse: false,
        loadNameError: err.error.error,
      });
      return;
    }

    try {
      const dataFromBlockchain = (multiCallResult as MultiCallResult).result.data;
      const dataFromBlockchainParsed: { data: { results: { data: string }[] } } = JSON.parse(dataFromBlockchain);
      const records = rchainToolkit.utils.rhoValToJs(JSON.parse(dataFromBlockchainParsed.data.results[0].data).expr[0]);

      const recordOnChain = records[this.state.name];
      const recordZero = records['0'];
      this.setState({
        loadingPurse: false,
        loadedPurse: recordOnChain || recordZero,
        loadNameError: undefined,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        loadingPurse: false,
        loadedPurse: undefined,
        loadNameError: 'Error when parsing result',
      });
    }
  };

  onFilledRecords = (t: PartialRecord | undefined) => {
    this.setState({ partialRecord: t });
  };

  onSubmit = () => {
    const partialRecord = this.state.partialRecord as PartialRecord;

    const id = blockchainUtils.getUniqueTransactionId();
    this.transactionId = id;

    const term = purchaseTerm((this.props.namesBlockchainInfos as RChainInfos).info.rchainNamesRegistryUri, {
      toBoxRegistryUri: this.state.box,
      newId: this.state.name,
      purseId: (this.state.loadedPurse as RChainTokenPurse).id,
      quantity: 1,
      price: (this.props.namesBlockchainInfos as RChainInfos).info.namePrice,
      publicKey: this.state.publickey,
      data: Buffer.from(
        JSON.stringify({
          address: partialRecord.address,
          badges: partialRecord.badges || {},
          servers: partialRecord.servers || [],
        }),
        'utf8'
      ).toString('hex'),
    });

    let validAfterBlockNumber = 0;
    if ((this.props.namesBlockchainInfos as RChainInfos).info) {
      validAfterBlockNumber = (this.props.namesBlockchainInfos as RChainInfos).info.lastFinalizedBlockNumber;
    }

    let special = (this.props.namesBlockchainInfos as RChainInfos).info.special;
    if (!special || !['special1'].includes(special.name)) {
      special = undefined;
    }

    const deployOptions = blockchainUtils.rchain.getDeployOptions(
      new Date().valueOf(),
      term,
      this.state.privatekey,
      this.state.publickey,
      1,
      this.state.phloLimit,
      validAfterBlockNumber
    );

    this.props.sendRChainTransaction({
      transaction: deployOptions,
      origin: { origin: 'record', recordName: partialRecord.name },
      platform: 'rchain',
      blockchainId: (this.props.namesBlockchainInfos as RChainInfos).chainId,
      id: id,
      alert: false,
      sentAt: new Date().toISOString(),
    });
  };

  render() {
    console.log(this.state.name);
    if (
      !this.props.namesBlockchainInfos ||
      !(this.props.namesBlockchainInfos as RChainInfos).info ||
      !(this.props.namesBlockchainInfos as RChainInfos).info.rchainNamesRegistryUri
    ) {
      return (
        <Fragment>
          <h3 className="subtitle is-4">{t('purchase a name')}</h3>
          <p
            className="smaller-text"
            dangerouslySetInnerHTML={{
              __html: t('purchase name paragraph'),
            }}></p>
        </Fragment>
      );
    }

    if (
      this.transactionId &&
      this.props.transactions[this.transactionId] &&
      this.props.transactions[this.transactionId].status === TransactionStatus.Aired
    ) {
      return (
        <Fragment>
          <h3 className="subtitle is-4">{t('purchase a name')}</h3>
          <p className="smaller-text">
            ✓ Transaction was successfully sent to the blockchain. Your name should appear in ten or twenty minutes
            after the transaction is processed, and the new name indexed by network members.
          </p>
          <br />
          <br />
          <button
            type="button"
            className="button is-light"
            onClick={() => {
              this.transactionId = '';
              this.setState(defaultState);
            }}>
            {t('ok go back')}
          </button>
        </Fragment>
      );
    }

    const dNetwork = this.props.namesBlockchain.chainId === 'd';
    return (
      <Fragment>
        <h3 className="subtitle is-4">{t('purchase a name')}</h3>
        <p className="smaller-text">{t('purchase name paragraph short')} </p>
        <br />
        <TransactionForm
          chooseBox={true}
          accounts={this.props.accounts}
          filledTransactionData={this.onFilledTransactionData}
        />
        {this.state.privatekey && !this.state.box && (
          <p className="text-danger pt10">You must have a token box to purchase a name (NFT)</p>
        )}
        <br />
        <div className="message is-danger">
          <div className="message-body">{t('dappy beta warning')}</div>
        </div>
        <div className="field is-horizontal">
          <label className="label">Name</label>
          <div className="control">
            <input
              disabled={this.state.loadingPurse}
              className="input name-input"
              onChange={(e) =>
                this.setState({ partialRecord: undefined, name: e.target.value, loadedPurse: undefined })
              }
              placeholder={`amazoon`}
            />
          </div>
        </div>
        {this.state.loadNameError && <p className="text-danger name-error no-padding">{this.state.loadNameError}</p>}
        <div className="field is-horizontal is-grouped">
          <label className="label"></label>
          <div className="control">
            <button
              type="button"
              className="button is-link"
              disabled={
                !!this.state.loadedPurse || !this.state.name || this.state.name === '0' || this.state.loadingPurse
              }
              onClick={(a) => {
                this.onLookup();
              }}>
              {this.state.loadingPurse && <i className="fa fa-before fa-redo rotating"></i>}
              {t('lookup name')}
            </button>
          </div>
        </div>
        {this.state.loadedPurse && this.state.loadedPurse.id === '0' && (
          <div className="field is-horizontal is-grouped">
            <label className="label"></label>
            <div className={`control you-will-purchase-control ${dNetwork ? 'dNetwork' : ''}`}>
              {dNetwork && (
                <h4 className="d-network">
                  {' '}
                  <span className="fa  fa-check"></span> d network
                </h4>
              )}
              <h4 className="you-will-purchase-purse">
                {' '}
                <span className="fa  fa-check"></span> {t('name is available')}
              </h4>
              <h5 className="current-price-existing-purse">
                {t('at price')}
                <span className="num">
                  {formatter.format(this.state.loadedPurse.price / LOGREV_TO_REV_RATE).substr(1)}
                </span>
                <span className="unit">{t('rev', true)}</span>
                <span className="dust">{this.state.loadedPurse.price} dust</span>
              </h5>
            </div>
          </div>
        )}
        {this.state.loadedPurse &&
          typeof this.state.loadedPurse.price === 'number' &&
          this.state.loadedPurse.id !== '0' && (
            <div className="field is-horizontal is-grouped">
              <label className="label"></label>
              <div className={`control you-will-purchase-control ${dNetwork ? 'dNetwork' : ''}`}>
                {dNetwork && (
                  <h4 className="d-network">
                    {' '}
                    <span className="fa  fa-check"></span> d network
                  </h4>
                )}
                <h4 className="you-will-purchase-purse">
                  {' '}
                  <span className="fa  fa-check"></span> {t('name is for sale')}
                </h4>
                <h5 className="current-price-existing-purse">
                  {t('at price')}
                  <span className="num">
                    {formatter.format(this.state.loadedPurse.price / LOGREV_TO_REV_RATE).substr(1)}
                  </span>
                  <span className="unit">{t('rev', true)}</span>
                  <span className="dust">{this.state.loadedPurse.price} dust</span>
                </h5>
              </div>
            </div>
          )}
        {this.state.loadedPurse &&
          typeof this.state.loadedPurse.price !== 'number' &&
          this.state.loadedPurse.id !== '0' && (
            <div className="field is-horizontal is-grouped">
              <label className="label"></label>
              <div className="control">
                <h4 className="you-will-purchase-purse">{t('name is not for sale')}</h4>
              </div>
            </div>
          )}
        {this.state.loadedPurse && typeof this.state.loadedPurse.price === 'number' && (
          <RecordForm
            special={(this.props.namesBlockchainInfos as RChainInfos).info.special}
            validateName
            nameDisabledAndForced={this.state.name}
            filledRecord={this.onFilledRecords}
            partialRecord={this.state.partialRecord}
            records={this.props.records}
            namesBlockchain={this.props.namesBlockchain}
          />
        )}
        <form>
          <div className="field is-horizontal is-grouped pt20">
            <div className="control">
              <button
                type="button"
                className="button is-link"
                disabled={
                  !this.state.partialRecord || !this.state.privatekey || !this.state.box || !this.state.loadedPurse
                }
                onClick={(a) => {
                  this.onSubmit();
                }}>
                {t('purchase name')}
              </button>
            </div>
          </div>
        </form>
      </Fragment>
    );
  }
}
