import React, { Fragment } from 'react';
import { updatePurseDataTerm } from 'rchain-token';

import { Record, TransactionState, RChainInfos, Account, PartialRecord } from '../../../models';
import { blockchain as blockchainUtils } from '../../../utils';
import * as fromBlockchain from '../../../store/blockchain';
import { getNodeIndex } from '../../../utils/getNodeIndex';
import { TransactionForm } from '../../utils';
import { multiCall } from '../../../utils/wsUtils';
import { RecordForm } from './RecordForm';
import './UpdateRecord.scss';
import { validateRecordFromNetwork } from '../../../store/decoders';

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
        await validateRecordFromNetwork(record);
        this.setState({
          loadingRecord: false,
          loadedRecord: record,
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

  onSubmit = () => {
    if (!this.state.newRecord || !this.state.privatekey) {
      return;
    }

    const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
    this.transactionId = id;

    const payload = {
      fromBoxRegistryUri: this.state.box,
      purseId: this.state.name,
      data: Buffer.from(
        JSON.stringify({
          address: this.state.newRecord.address,
          badges: this.state.newRecord.badges || {},
          servers: this.state.newRecord.servers || [],
        }),
        'utf8'
      ).toString('hex'),
    };

    const term1 = updatePurseDataTerm(
      (this.props.namesBlockchainInfos as RChainInfos).info.rchainNamesRegistryUri,
      payload
    );

    let validAfterBlockNumber = 0;
    if (this.props.namesBlockchainInfos) {
      validAfterBlockNumber = this.props.namesBlockchainInfos.info.lastFinalizedBlockNumber;
    }

    const deployOptions = blockchainUtils.rchain.getDeployOptions(
      new Date().valueOf(),
      term1,
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
              __html: t('purchase name paragraph'),
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
            ✓ Transaction was successfully sent to the blockchain. Your name should update in ten or twenty minutes
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

    return (
      <Fragment>
        <h3 className="subtitle is-4">{t('update a name')}</h3>
        <p className="smaller-text">{t('update name paragraph')}</p>
        <br />
        <p className="smaller-text">
          You can't update the same name many times in a short period of time, wait for each update to appear before
          making new updates.
        </p>
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
        <div className="update-record-form">
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
                      this.setState({ record: undefined, newRecord: undefined });
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
            <RecordForm
              nameDisabledAndForced={this.state.loadedRecord.name}
              records={{}}
              partialRecord={this.state.loadedRecord}
              filledRecord={(a) => this.setState({ newRecord: a })}></RecordForm>
          )}
          {this.state.loadedRecord &&
            this.state.publickey &&
            this.state.publickey !== this.state.loadedRecord.publicKey && (
              <p className="text-danger">{t('name public key and box public key different')}</p>
            )}
          {this.state.loadedRecord && this.state.box && this.state.box !== this.state.loadedRecord.box && (
            <p className="text-danger">{t('name box address and box address different')}</p>
          )}
          <form>
            <div className="field is-horizontal is-grouped pt20">
              <div className="control">
                <button
                  onClick={this.onSubmit}
                  className="button is-link"
                  disabled={!this.state.newRecord || !this.state.privatekey || !this.state.box}>
                  {t('update name')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}
