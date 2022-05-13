import React, { Fragment } from 'react';
import { updatePurseDataTerm } from '@fabcotech/rchain-token';

import {
  Record,
  TransactionState,
  RChainInfos,
  Account,
  PartialRecord,
  Blockchain,
  MultiRequestResult,
  IPServer,
} from '/models';
import { validateRecordFromNetwork } from '/store/decoders';
import * as fromBlockchain from '/store/blockchain';
import { getNodeIndex } from '/utils/getNodeIndex';
import { multiRequest } from '/interProcess';
import { rchainWallet } from '/utils/wallets';

import { TransactionForm } from '../utils';
import { RecordForm } from './RecordForm';
import './UpdateRecord.scss';

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
  accountName: undefined,
  publickey: '',
  phloLimit: 0,
  name: '',
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
    accountName: undefined | string;
    publickey: string;
    phloLimit: number;
    name: string;
    newRecord: PartialRecord | undefined;
    loadRecordError: undefined | string;
    loadedRecord: undefined | PartialRecord;
    loadedRecordPrice: undefined | number;
    loadingRecord: boolean;
  } = defaultState;

  transactionId = '';
  exists: Record | undefined = undefined;

  onFilledTransactionData = (t: {
    privatekey: string;
    publickey: string;
    phloLimit: number;
    box: undefined | string;
    accountName: undefined | string;
  }) => {
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
    let multiRequestResult;
    try {
      multiRequestResult = await multiRequest(
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
    } catch (err: any) {
      console.log(err);
      this.setState({
        loadedRecord: undefined,
        loadingRecord: false,
        loadRecordError: err.error.error,
      });
      return;
    }

    try {
      const dataFromBlockchain = (multiRequestResult as MultiRequestResult).result;
      const dataFromBlockchainParsed: { records: any } = JSON.parse(dataFromBlockchain);
      const record = dataFromBlockchainParsed.records[0];

      if (record) {
        if (record.data) {
          record.data = JSON.parse(record.data);
        }

        await validateRecordFromNetwork(record);

        if (record.data.servers) {
          record.data.servers = record.data.servers.map((s: IPServer) => ({
            ...s,
            cert: s.cert ? decodeURI(s.cert) : '',
          }));
        }

        this.setState({
          loadingRecord: false,
          loadedRecord: {
            id: record.id,
            boxId: record.boxId,
            servers: record.data.servers,
            badges: record.data.badges,
            address: record.data.address,
            email: record.data.email,
            csp: record.data.csp,
          } as PartialRecord,
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

    const deployOptions = rchainWallet.signTransaction(
      {
        term: term,
        timestamp: new Date().valueOf(),
        phloPrice: 1,
        phloLimit: this.state.phloLimit,
        validAfterBlockNumber: validAfterBlockNumber,
      },
      this.state.privatekey
    );

    this.props.sendRChainTransaction({
      transaction: deployOptions,
      origin: { origin: 'record', recordName: this.state.name, accountName: this.state.accountName as string },
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
            className="limited-width"
            dangerouslySetInnerHTML={{
              __html: t('purchase a name 2'),
            }}></p>
        </Fragment>
      );
    }

    const info = (this.props.namesBlockchainInfos as RChainInfos).info;

    if (
      this.transactionId &&
      this.props.transactions[this.transactionId] &&
      this.props.transactions[this.transactionId]
    ) {
      return (
        <Fragment>
          <h3 className="subtitle is-4">{t('update a name')}</h3>
          <p className="limited-width text-mid">
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
          {!this.state.privatekey && <p className="text-danger">{t('input your password')}</p>}
          {this.state.loadedRecord &&
            this.state.box &&
            this.state.box !== this.state.loadedRecord.boxId.replace('rho:id:', '') && (
              <p className="text-danger">{t('name box address and box address different')}</p>
            )}
        </>
      );
    };

    return (
      <Fragment>
        <h3 className="subtitle is-4">{t('update a name')}</h3>
        <p className="limited-width text-mid">{t('update name paragraph 2')}</p>
        <br />
        <p className="limited-width text-mid">{t('warning wait for update')}</p>
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
            <label className="label">contract ID</label>
            <div className="control inline-control">
              <input disabled={true} defaultValue={info.rchainNamesContractId} className="input"></input>
            </div>
          </div>
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
                      this.setState({
                        loadedRecord: undefined,
                        loadedRecordPrice: (this.state.loadedRecord as Record).price,
                        newRecord: undefined,
                      });
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
              <h4 className="title is-4">
                <i className="fa fa-before fa-bars"></i> {t('update name properties')}
              </h4>
              <RecordForm
                nameDisabledAndForced={this.state.loadedRecord.id}
                partialRecord={this.state.loadedRecord}
                filledRecord={(a) => this.setState({ newRecord: a })}
                validateName={undefined}
              />
            </>
          )}
          {this.state.loadedRecord && <BoxAndPublicKeyError />}
          <form>
            <div className="field is-horizontal is-grouped pt20">
              <div className="control">
                <button
                  onClick={(e) => {
                    e.preventDefault();

                    const data: { [key: string]: any } = {
                      csp: (this.state.newRecord as PartialRecord).csp,
                      email: (this.state.newRecord as PartialRecord).email,
                      badges: (this.state.newRecord as PartialRecord).badges || {},
                      servers: (this.state.newRecord as PartialRecord).servers || [],
                    };
                    if ((this.state.newRecord as PartialRecord).address) {
                      data.address = (this.state.newRecord as PartialRecord).address;
                    }
                    const payload = {
                      masterRegistryUri: info.rchainNamesMasterRegistryUri,
                      contractId: info.rchainNamesContractId,
                      purseId: this.state.name,
                      boxId: this.state.box,
                      data: Buffer.from(JSON.stringify(data), 'utf8').toString('hex'),
                    };
                    const term = updatePurseDataTerm(payload);
                    this.onSubmit(term);
                  }}
                  className="button is-link"
                  disabled={!this.state.newRecord || !this.state.privatekey || !this.state.box}>
                  {t('update name properties')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}
