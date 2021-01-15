import React, { Fragment } from 'react';
import { purchaseTokensTerm } from 'rchain-token-files';

import './RecordsForm.scss';
import {
  Record,
  TransactionState,
  RChainInfos,
  Account,
  PartialRecord,
  TransactionStatus,
  Blockchain,
} from '../../../models';
import { blockchain as blockchainUtils } from '../../../utils';
import * as fromBlockchain from '../../../store/blockchain';
import { TransactionForm } from '../../utils';
import { RecordForm } from '.';
import { generateNonce } from '../../../utils/generateNonce';

interface PurchaseRecordProps {
  records: { [key: string]: Record };
  transactions: { [id: string]: TransactionState };
  rchainInfos: { [chainId: string]: RChainInfos };
  namesBlockchainInfos: RChainInfos | undefined;
  accounts: { [accountName: string]: Account };
  namesBlockchain: Blockchain;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}

const defaultState = {
  privatekey: '',
  publickey: '',
  phloLimit: 0,
  settingUpIpServers: false,
  partialRecord: undefined,
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
    phloLimit: number;
    settingUpIpServers: boolean;
    partialRecord: PartialRecord | undefined;
  } = defaultState;

  transactionId = '';

  onFilledTransactionData = (t: { privatekey: string; publickey: string; phloLimit: number }) => {
    this.setState(t);
    if (this.setTouched) this.setTouched();
  };

  onFilledRecords = (t: PartialRecord | undefined) => {
    this.setState({ partialRecord: t });
  };

  onSubmit = () => {
    const partialRecord = this.state.partialRecord as PartialRecord;

    const id = blockchainUtils.getUniqueTransactionId();
    this.transactionId = id;

    const term = purchaseTokensTerm((this.props.namesBlockchainInfos as RChainInfos).info.rchainNamesRegistryUri, {
      publicKey: this.state.publickey,
      newBagId: partialRecord.name,
      bagId: '0',
      quantity: 1,
      price: (this.props.namesBlockchainInfos as RChainInfos).info.namePrice,
      bagNonce: generateNonce(),
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
    if (!this.props.namesBlockchainInfos || !(this.props.namesBlockchainInfos as RChainInfos).info) {
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

    return (
      <Fragment>
        <h3 className="subtitle is-4">{t('purchase a name')}</h3>
        <p className="smaller-text">{t('purchase name paragraph short')} </p>
        <br />
        <TransactionForm accounts={this.props.accounts} filledTransactionData={this.onFilledTransactionData} />
        <br />
        <div className="message is-danger">
          <div className="message-body">{t('dappy beta warning')}</div>
        </div>
        <RecordForm
          special={(this.props.namesBlockchainInfos as RChainInfos).info.special}
          validateName
          nameDisabled={false}
          filledRecord={this.onFilledRecords}
          partialRecord={this.state.partialRecord}
          records={this.props.records}
          namesBlockchain={this.props.namesBlockchain}
        />
        <form>
          <div className="field is-horizontal is-grouped pt20">
            <div className="control">
              <button
                type="button"
                className="button is-link"
                disabled={!this.state.partialRecord || !this.state.privatekey}
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
