import React, { Fragment } from 'react';
import { blake2b } from 'blakejs';
import rchainNames from 'rchain-names';
import * as rchainToolkit from 'rchain-toolkit';

import { generateNonce } from '../../../utils/generateNonce';
import { Record, TransactionState, RChainInfos, Account, PartialRecord, TransactionStatus } from '../../../models';
import { blockchain as blockchainUtils } from '../../../utils';
import * as fromBlockchain from '../../../store/blockchain';
import { TransactionForm } from '../../utils';
import { RecordForm } from './RecordForm';
import './UpdateRecord.scss';

interface UpdateRecordProps {
  records: { [key: string]: Record };
  transactions: { [id: string]: TransactionState };
  rchainInfos: { [chainId: string]: RChainInfos };
  namesBlockchainInfos: RChainInfos | undefined;
  accounts: { [accountName: string]: Account };
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}

const defaultState = {
  privatekey: '',
  publickey: '',
  phloLimit: 0,
  name: '',
  record: undefined,
  newRecord: undefined,
};

export class UpdateRecord extends React.Component<UpdateRecordProps, {}> {
  constructor(props: UpdateRecordProps) {
    super(props);
    this.setTouched = undefined;
  }

  setTouched: undefined | (() => void);

  state: {
    privatekey: string;
    publickey: string;
    phloLimit: number;
    name: string;
    record: PartialRecord | undefined;
    newRecord: PartialRecord | undefined;
  } = defaultState;

  transactionId = '';
  exists: Record | undefined = undefined;

  onFilledTransactionData = (t: { privatekey: string; publickey: string; phloLimit: number }) => {
    this.setState(t);
    if (this.setTouched) this.setTouched();
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

    const bufferToSign = Buffer.from((this.exists as Record).nonce, 'utf8');
    const uInt8Array = new Uint8Array(bufferToSign);

    const blake2bHash = blake2b(uInt8Array, 0, 32);
    const signature = rchainToolkit.utils.signSecp256k1(blake2bHash, this.state.privatekey);

    const signatureHex = Buffer.from(signature).toString('hex');

    const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
    this.transactionId = id;

    let serversAsString = '[]';
    if (this.state.newRecord.servers) {
      serversAsString = JSON.stringify({ servers: this.state.newRecord.servers });
      serversAsString = serversAsString.substr(11, serversAsString.length - 12);
    }

    const term1 = rchainNames.updateNameTerm(
      (this.props.namesBlockchainInfos as RChainInfos).info.rchainNamesRegistryUri,
      generateNonce(),
      this.state.name,
      this.state.publickey,
      serversAsString,
      JSON.stringify(this.state.newRecord.badges || {}),
      this.state.newRecord.address,
      signatureHex
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

    if (this.transactionId && this.props.transactions[this.transactionId] && this.props.transactions[this.transactionId]) {
      return (
        <Fragment>
          <h3 className="subtitle is-4">{t('update a name')}</h3>
          <p className="smaller-text">
            ✓ Transaction was successfully sent to the blockchain. Your name should update in ten or twenty minutes
            after the transaction is processed, and the new name indexed by network members.
          </p>
          <br />
          <br />
          <button type="button" className="button is-light" onClick={() => {
            this.transactionId = '';
            this.setState(defaultState);
          }}>
            {t('ok go back')}
          </button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <h3 className="subtitle is-4">{t('update a name')}</h3>
        <p className="smaller-text">{t('update name paragraph')}</p>
        <br />
        <p className="smaller-text">
          You can't update the same name many times in a short period of time,
          wait for each update to appear before making new updates.
        </p>
        <br />
        <TransactionForm accounts={this.props.accounts} filledTransactionData={this.onFilledTransactionData} />
        <br />
        <div className="update-record-form">
          <div className="field is-horizontal">
            <label className="label">{t('name')}*</label>
            <div className="control inline-control">
              <input className="input" onChange={(e) => this.setName(e.target.value)}></input>
              {this.state.record ? undefined : (
                <button
                  onClick={() => {
                    if (this.props.records[this.state.name]) {
                      this.setState({ record: this.props.records[this.state.name] });
                    }
                  }}
                  type="button"
                  className="button is-link"
                  disabled={!this.state.name || !this.props.records[this.state.name]}>
                  Load
                </button>
              )}
              {this.state.record ? (
                <button
                  onClick={() => {
                    if (this.props.records[this.state.name]) {
                      this.setState({ record: undefined, newRecord: undefined });
                      setTimeout(() => {
                        this.setState({ record: this.props.records[this.state.name] });
                      }, 100);
                    }
                  }}
                  type="button"
                  className="button is-light">
                  Reset
                </button>
              ) : undefined}
              {this.state.record ? (
                <button
                  onClick={() => {
                    if (this.props.records[this.state.name]) {
                      this.setState({ record: undefined, newRecord: undefined });
                    }
                  }}
                  type="button"
                  className="button is-light">
                  Cancel
                </button>
              ) : undefined}
            </div>
          </div>
          {!!this.state.record && (
            <RecordForm
              nameDisabled={true}
              records={{}}
              partialRecord={this.state.record}
              filledRecord={(a) => this.setState({ newRecord: a })}></RecordForm>
          )}
          <form>
            <div className="field is-horizontal is-grouped pt20">
              <div className="control">
                <button
                  onClick={this.onSubmit}
                  className="button is-link"
                  disabled={!this.state.newRecord || !this.state.privatekey}>
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
