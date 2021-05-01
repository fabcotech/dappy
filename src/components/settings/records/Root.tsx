import React, { useState } from 'react';
import { connect } from 'react-redux';

import './Records.scss';
import { Record, RecordFromNetwork, TransactionState, RChainInfos, Account, Blockchain } from '../../../models';
import * as fromBlockchain from '../../../store/blockchain';
import * as fromSettings from '../../../store/settings';
import { AddRecord } from './AddRecord';
import { PurchaseRecord } from './PurchaseRecord';
import { UpdateRecord } from './UpdateRecord';
import { Requests } from './Requests';
import { Records } from './Records';

interface RecordsRootProps {
  records: { [name: string]: Record };
  recordNamesInAlphaOrder: string[];
  transactions: { [id: string]: TransactionState };
  rchainInfos: { [chainId: string]: RChainInfos };
  namesBlockchain: Blockchain;
  namesBlockchainInfos: RChainInfos | undefined;
  accounts: { [accountName: string]: Account };
  addRecord: (a: RecordFromNetwork) => void;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}

export function RootComponent(props: RecordsRootProps) {
  const [tab, setTab] = useState('names');

  return (
    <div className="settings-names pb20">
      <div className="tabs is-small">
        <ul>
          <li className={tab === 'names' ? 'is-active' : ''}>
            <a onClick={() => setTab('names')}>{t('name', true)}</a>
          </li>
          <li className={tab === 'add-name' ? 'is-active' : ''}>
            <a onClick={() => setTab('add-name')}>
              {t('add local name dev')} <i className="fa fa-plus fa-after" />
            </a>
          </li>
          <li className={tab === 'purchase-name' ? 'is-active' : ''}>
            <a onClick={() => setTab('purchase-name')}>
              {t('purchase name')} <i className="fa fa-plus fa-after" />
            </a>
          </li>
          <li className={tab === 'update-name' ? 'is-active' : ''}>
            <a onClick={() => setTab('update-name')}>
              {t('update name')} <i className="fa fa-pen fa-after" />
            </a>
          </li>
          <li className={tab === 'requests' ? 'is-active' : ''}>
            <a onClick={() => setTab('requests')}>{t('request', true)}</a>
          </li>
        </ul>
      </div>
      {tab === 'add-name' ? <AddRecord records={props.records} addRecord={props.addRecord} /> : undefined}
      {tab === 'purchase-name' ? (
        <PurchaseRecord
          transactions={props.transactions}
          records={props.records}
          rchainInfos={props.rchainInfos}
          namesBlockchainInfos={props.namesBlockchainInfos}
          accounts={props.accounts}
          sendRChainTransaction={props.sendRChainTransaction}
          namesBlockchain={props.namesBlockchain}
        />
      ) : undefined}
      {tab === 'update-name' ? (
        <UpdateRecord
          transactions={props.transactions}
          records={props.records}
          rchainInfos={props.rchainInfos}
          accounts={props.accounts}
          namesBlockchain={props.namesBlockchain}
          namesBlockchainInfos={props.namesBlockchainInfos}
          sendRChainTransaction={props.sendRChainTransaction}
        />
      ) : undefined}
      {tab === 'requests' ? <Requests /> : undefined}
      {tab === 'names' ? (
        <Records
          setTab={setTab}
          accounts={props.accounts}
          records={props.records}
          recordNamesInAlphaOrder={props.recordNamesInAlphaOrder}
        />
      ) : undefined}
    </div>
  );
}

export const Root = connect(
  (state) => {
    return {
      namesBlockchain: fromSettings.getNamesBlockchain(state),
      records: fromBlockchain.getRecords(state),
      recordNamesInAlphaOrder: fromBlockchain.getRecordNamesInAlphaOrder(state),
      transactions: fromBlockchain.getTransactions(state),
      rchainInfos: fromBlockchain.getRChainInfos(state),
      namesBlockchainInfos: fromBlockchain.getNamesBlockchainInfos(state),
      accounts: fromSettings.getAccounts(state),
    };
  },
  (dispatch) => ({
    addRecord: (record: RecordFromNetwork) =>
      dispatch(
        fromBlockchain.addRecordAction({
          record: {
            ...record,
            loadedAt: new Date().toString(),
            origin: 'user',
          },
        })
      ),
    sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => {
      dispatch(fromBlockchain.sendRChainTransactionAction(t));
    },
  })
)(RootComponent);
