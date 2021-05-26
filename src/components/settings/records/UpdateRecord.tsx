import React, { Fragment } from 'react';
import { updatePurseDataTerm, updatePursePriceTerm } from 'rchain-token';

import { Record, TransactionState, RChainInfos, Account, PartialRecord } from '../../../models';
import { blockchain as blockchainUtils } from '../../../utils';
import * as fromBlockchain from '../../../store/blockchain';
import { getNodeIndex } from '../../../utils/getNodeIndex';
import { formatAmount, formatAmountNoDecimal } from '../../../utils/formatAmount';
import { TransactionForm } from '../../utils';
import { multiCall } from '../../../utils/wsUtils';
import { RecordForm } from './RecordForm';
import './UpdateRecord.scss';
import { validateRecordFromNetwork } from '../../../store/decoders';
import { LOGREV_TO_REV_RATE } from '../../../CONSTANTS';

interface UpdateRecordProps {
  records: { [key: string]: Record };
  transactions: { [id: string]: TransactionState };
  rchainInfos: { [chainId: string]: RChainInfos };
  namesBlockchainInfos: RChainInfos | undefined;
  namesBlockchain: Blockchain;
  accounts: { [accountName: string]: Account };
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}

const defaultState = {
  privatekey: '',
  box: undefined,
  publickey: '',
  phloLimit: 0,
  name: '',
  record: undefined,
  newRecord: undefined,
  loadRecordError: undefined,
  loadedRecord: undefined,
  loadedRecordPrice: undefined,
  loadingRecord: false,
};

export class UpdateRecord extends React.Component<UpdateRecordProps, {}> {
  constructor(props: UpdateRecordProps) {
    super(props);
    this.setTouched = undefined;
  }

  setTouched: undefined | (() => void);

  state: {
    privatekey: string;
    box: undefined | string;
    publickey: string;
    phloLimit: number;
    name: string;
    record: PartialRecord | undefined;
    newRecord: PartialRecord | undefined;
    loadRecordError: undefined | string;
    loadedRecord: undefined | Record;
    loadedRecordPrice: undefined | number;
    loadingRecord: boolean;
  } = defaultState;

  transactionId = '';
  exists: Record | undefined = undefined;

  onFilledTransactionData = (t: { privatekey: string; publickey: string; phloLimit: number }) => {
    this.setState(t);
    if (this.setTouched) this.setTouched();
  };

  onLookup = async () => {
    this.setState({
      loadingRecord: true,
      loadedRecord: undefined,
    });

    const indexes = this.props.namesBlockchain.nodes.map(getNodeIndex);

    // todo only ask for names that are not in this.state.availables
    let multiCallResult;
    try {
      multiCallResult = await multiCall(
        {
          type: 'get-x-records',
          body: {
            names: [this.state.name],
          },
        },
        {
          chainId: this.props.namesBlockchain.chainId,
          urls: indexes,
          resolverMode: 'absolute',
          resolverAccuracy: 100,
          resolverAbsolute: indexes.length,
          multiCallId: fromBlockchain.GET_X_RECORDS,
        }
      );
    } catch (err) {
      console.log(err);
      this.setState({
        loadedRecord: undefined,
        loadingRecord: false,
        loadRecordError: err.error.error,
      });
      return;
    }

    try {
      const dataFromBlockchain = (multiCallResult as MultiCallResult).result.data;
      const dataFromBlockchainParsed: { data: { results: { data: string }[] } } = JSON.parse(dataFromBlockchain);
      const record = dataFromBlockchainParsed.records[0];

      if (record) {
        if (record && record.servers) {
          const servers = JSON.parse(`{ "value": ${record.servers}}`).value;
          record.servers = servers;
        }
        if (record.badges) {
          record.badges = JSON.parse(record.badges);
        }
        if (typeof record.price === "string" && record.price.length) {
          record.price = parseInt(record.price, 10);
        }
        await validateRecordFromNetwork(record);
        this.setState({
          loadingRecord: false,
          loadedRecord: record,
          loadedRecordPrice: record.price,
          loadRecordError: undefined,
        });
      } else {
        this.setState({
          loadingRecord: false,
          loadedRecord: undefined,
          loadRecordError: 'Name not found',
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({
        loadingRecord: false,
        loadedRecord: undefined,
        loadRecordError: 'Error when parsing result',
      });
    }
  };

  setName = (name: string) => {
    this.exists = undefined;
    if (this.props.records[name]) {
      this.exists = this.props.records[name];
    }

    this.setState({
      name: name,
    });
  };

  onSubmit = (term: string) => {
    if (!this.state.newRecord || !this.state.privatekey) {
      return;
    }

    const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
    this.transactionId = id;

    let validAfterBlockNumber = 0;
    if (this.props.namesBlockchainInfos) {
      validAfterBlockNumber = this.props.namesBlockchainInfos.info.lastFinalizedBlockNumber;
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
      origin: { origin: 'record', recordName: this.state.name },
      platform: 'rchain',
      blockchainId: (this.props.namesBlockchainInfos as RChainInfos).chainId,
      id: id,
      alert: false,
      sentAt: new Date().toISOString(),
    });
  };

  render() {
    if (!this.props.namesBlockchainInfos || !(this.props.namesBlockchainInfos as RChainInfos).info) {
      return (
        <Fragment>
          <h3 className="subtitle is-4">{t('update a name')}</h3>
          <p
            className="smaller-text"
            dangerouslySetInnerHTML={{
              __html: t('purchase a name 2'),
            }}></p>
        </Fragment>
      );
    }

    if (
      this.transactionId &&
      this.props.transactions[this.transactionId] &&
      this.props.transactions[this.transactionId]
    ) {
      return (
        <Fragment>
          <h3 className="subtitle is-4">{t('update a name')}</h3>
          <p className="smaller-text">
            {t('operation on name successful')}
            {t('warning wait for update')}
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


    const BoxAndPublicKeyError = () => {
      return (
        <>
          { !this.state.privatekey &&
            <p className="text-danger">{t('input your password')}</p>
          }
          {this.state.loadedRecord &&
            this.state.box &&
            this.state.box !== this.state.loadedRecord.box.replace('rho:id:', '') && (
              <p className="text-danger">{t('name box address and box address different')}</p>
            )}
        </>
      )
    }
  
    return (
      <Fragment>
        <h3 className="subtitle is-4">{t('update a name')}</h3>
        <p className="smaller-text">{t('update name paragraph 2')}</p>
        <br />
        <p className="smaller-text">{t('warning wait for update')}</p>
        <br />
        <TransactionForm
          chooseBox={true}
          accounts={this.props.accounts}
          filledTransactionData={this.onFilledTransactionData}
        />
        {this.state.privatekey && !this.state.box && <p className="text-danger pt10">{t('you need box')}</p>}
        <br />
        <div className="update-record-properties-form">
          <div className="field is-horizontal">
            <label className="label">{t('name')}*</label>
            <div className="control inline-control">
              <input
                disabled={this.state.loadingRecord}
                className="input"
                onChange={(e) => this.setState({ name: e.target.value })}></input>
              {this.state.loadedRecord ? undefined : (
                <button
                  onClick={this.onLookup}
                  type="button"
                  className="button is-link"
                  disabled={!this.state.name || !!this.state.loadedRecord || this.state.loadingRecord}>
                  {this.state.loadingRecord && <i className="fa fa-before fa-redo rotating"></i>}
                  {t('lookup name')}
                </button>
              )}
              {this.state.loadedRecord ? (
                <button
                  onClick={() => {
                    this.setState({
                      loadedRecord: undefined,
                    });
                  }}
                  type="button"
                  className="button is-light">
                  {t('reset')}
                </button>
              ) : undefined}
              {this.state.loadedRecord ? (
                <button
                  onClick={() => {
                    if (this.props.records[this.state.name]) {
                      this.setState({ record: undefined, loadedRecordPrice: (this.state.loadedRecord as Record).price, newRecord: undefined });
                    }
                  }}
                  type="button"
                  className="button is-light">
                  {t('cancel')}
                </button>
              ) : undefined}
            </div>
          </div>
          {this.state.loadRecordError && <p className="text-danger">{this.state.loadRecordError}</p>}
          {!!this.state.loadedRecord && (
            <>
              <h4 className="title is-4"><i className="fa fa-before fa-bars"></i> {t('update name properties')}</h4>
              <RecordForm
                nameDisabledAndForced={this.state.loadedRecord.name}
                records={{}}
                partialRecord={this.state.loadedRecord}
                filledRecord={(a) => this.setState({ newRecord: a })}></RecordForm>
            </>
          )}
          { this.state.loadedRecord && <BoxAndPublicKeyError /> }
          <form>
            <div className="field is-horizontal is-grouped pt20">
              <div className="control">
                <button
                  onClick={() => {
                    const payload = {
                      masterRegistryUri: (this.props.namesBlockchainInfos as RChainInfos).info.rchainNamesMasterRegistryUri,
                      contractId: (this.props.namesBlockchainInfos as RChainInfos).info.rchainNamesContractId,
                      purseId: this.state.name,
                      boxId: this.state.box,
                      data: Buffer.from(
                        JSON.stringify({
                          address: (this.state.newRecord as PartialRecord).address,
                          badges: (this.state.newRecord as PartialRecord).badges || {},
                          servers: (this.state.newRecord as PartialRecord).servers || [],
                        }),
                        'utf8'
                      ).toString('hex'),
                    };
                    const term = updatePurseDataTerm(payload);
                    this.onSubmit(term)
                  }}
                  className="button is-link"
                  disabled={!this.state.newRecord || !this.state.privatekey || !this.state.box}>
                  {t('update name properties')}
                </button>
              </div>
            </div>
          </form>
          {
            this.state.loadedRecord ?
            <>
              <h4 className="title is-4">
                <i className="fa fa-before fa-money-bill-wave"></i>
                {t('update name price')}</h4>
              <div className="field is-horizontal">
                <div className="control">
                  <input
                    className="radio is-checkradio is-link is-inverted"
                    onChange={() => {}}
                    type="radio"
                    checked={this.state.loadedRecordPrice === undefined}
                    name=""></input>
                  <label
                    onClick={() => {
                      this.setState({ loadedRecordPrice: undefined })
                    }}>
                    {t('name not for sale')}
                  </label>
                  <input
                    className="radio is-checkradio is-link is-inverted"
                    onChange={() => {}}
                    type="radio"
                    checked={typeof this.state.loadedRecordPrice === 'number'}
                    name=""></input>
                  <label
                    onClick={() => {
                      this.setState({ loadedRecordPrice: 100000000 })
                    }}>
                    {t('name for sale')}
                  </label>
                </div>
              </div>
              {
                typeof this.state.loadedRecordPrice === 'number' &&
                <div className="field is-horizontal">
                  <label className="label"></label>
                  <div className="control">
                    <input
                      onChange={e => {
                        const n = parseInt(e.currentTarget.value, 10)
                        this.setState({
                          loadedRecordPrice: typeof n === 'number' ? n : undefined
                        })
                      }}
                      step={1}
                      className="input"
                      type="number"
                      name="price"
                      value={this.state.loadedRecordPrice}
                      placeholder={t('name price (dust)')}
                    />
                    <span className="dust-price">{formatAmountNoDecimal(this.state.loadedRecordPrice)} dust</span>
                    <span className="rev-price">{formatAmount(this.state.loadedRecordPrice / LOGREV_TO_REV_RATE)} REV</span>
                  </div>
                </div>
              }
              <BoxAndPublicKeyError />
              <form>
                <div className="field is-horizontal is-grouped pt20">
                  <div className="control">
                    <button
                      onClick={() => {
                        const payload = {
                          masterRegistryUri: (this.props.namesBlockchainInfos as RChainInfos).info.rchainNamesMasterRegistryUri,
                          contractId: (this.props.namesBlockchainInfos as RChainInfos).info.rchainNamesContractId,
                          purseId: (this.state.loadedRecord as Record).name,
                          boxId: this.state.box,
                          price: this.state.loadedRecordPrice,
                        };
                        const term = updatePursePriceTerm(payload);
                        this.onSubmit(term)
                      }}
                      className="button is-link"
                      disabled={this.state.loadedRecordPrice === this.state.loadedRecord.price || !this.state.privatekey || !this.state.box}>
                      {t('update name price')}
                    </button>
                  </div>
                </div>
              </form>
            </>
            : undefined
          }
        </div>
      </Fragment>
    );
  }
}
