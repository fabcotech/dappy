import React, { Fragment } from 'react';
import rchainNames from 'rchain-names';

import './RecordsForm.scss';
import { Record, TransactionState, RChainInfos, Account, IPServer, PartialRecord } from '../../../models';
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
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}

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
  } = {
    privatekey: '',
    publickey: '',
    phloLimit: 0,
    settingUpIpServers: false,
    partialRecord: undefined,
  };

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

    const payload = blockchainUtils.rchain.buildNameTermPayload(
      this.state.publickey,
      partialRecord.name,
      partialRecord.address ? partialRecord.address : undefined,
      partialRecord.servers ? partialRecord.servers : [],
      generateNonce()
    );

    let serversAsString = '[]';
    if (partialRecord.servers) {
      serversAsString = JSON.stringify({ servers: partialRecord.servers });
      serversAsString = serversAsString.substr(11, serversAsString.length - 12);
    }

    const term = rchainNames.createNameTerm(
      (this.props.namesBlockchainInfos as RChainInfos).info.rchainNamesRegistryUri,
      generateNonce(),
      partialRecord.name,
      this.state.publickey,
      serversAsString,
      JSON.stringify(partialRecord.badges || {}),
      partialRecord.address ? partialRecord.address : undefined,
      1500000000
    );

    let validAfterBlockNumber = 0;
    if ((this.props.namesBlockchainInfos as RChainInfos).info) {
      validAfterBlockNumber = (this.props.namesBlockchainInfos as RChainInfos).info.lastFinalizedBlockNumber;
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
      alert: true,
      sentAt: new Date().toISOString(),
    });
  };

  transactionFilled = () => {
    return this.state.privatekey && this.state.publickey && this.state.phloLimit;
  };

  onToggleSetupIpServers = () => {
    this.setState({
      settingUpIpServers: !this.state.settingUpIpServers,
    });
  };

  onSetIpServers = (a: IPServer[]) => {
    this.setState({
      ipServers: a,
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
          validateName
          nameDisabled={false}
          filledRecord={this.onFilledRecords}
          partialRecord={this.state.partialRecord}
          records={this.props.records}
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
