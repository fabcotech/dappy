import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
  Record as RChainRecord,
  RecordFromNetwork,
  RChainContractConfig,
  TransactionState,
  RChainInfos,
  Account,
  Blockchain,
} from '/models';
import * as fromBlockchain from '/store/blockchain';
import * as fromSettings from '/store/settings';
import { getContractConfig } from '/api/rchain-token';

import { PurchaseRecord } from './PurchaseRecord';
import { UpdateRecord } from './UpdateRecord';
import { Records } from './Records';

import './Records.scss';

interface RecordsRootProps {
  namesBlockchain: Blockchain | undefined;
  records: Record<string, RChainRecord>;
  recordNamesInAlphaOrder: string[];
  transactions: { [id: string]: TransactionState };
  rchainInfos: { [chainId: string]: RChainInfos };
  namesBlockchainInfos: RChainInfos | undefined;
  accounts: { [accountName: string]: Account };
  addRecord: (a: RecordFromNetwork) => void;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}

export function RootComponent(props: RecordsRootProps) {
  const [tab, setTab] = useState('purchase-name');
  const [contractConfigs, setContractConfigs] = useState<Record<string, RChainContractConfig>>({});

  const queryAndCacheContractConfig = async (contractId: string) => {
    if (contractConfigs[contractId]) {
      return;
    }
    
    try {
      if (props.namesBlockchainInfos?.info.rchainNamesMasterRegistryUri && props.namesBlockchain) {
        const [req] = await getContractConfig({
          masterRegistryUri: props.namesBlockchainInfos?.info.rchainNamesMasterRegistryUri,
          blockchain: props.namesBlockchain,
          contractId,
        });
  
        if (req.validationErrors.length === 0) {
          setContractConfigs({
            ...contractConfigs,
            [req.result.contractId]: req.result,
          });
        }
      }
    } catch (err) {
      console.log(err)
      console.error("could not get contract config")
    }
  };

  if (
    !props.namesBlockchainInfos ||
    !(props.namesBlockchainInfos as RChainInfos).info ||
    !(props.namesBlockchainInfos as RChainInfos).info.rchainNamesMasterRegistryUri ||
    !(props.namesBlockchainInfos as RChainInfos).info.rchainNamesContractId ||
    !props.namesBlockchain
  ) {
    return (
      <div className="settings-names p20">
        <h3 className="subtitle is-4">{t('purchase a name')}</h3>
        <p
          className="limited-width"
          dangerouslySetInnerHTML={{
            __html: t('name system not available'),
          }}></p>
      </div>
    );
  }

  return (
    <div className="settings-names p20">
      <h3 className="subtitle is-3">{t('name system')}</h3>
      <div className="tabs">
        <ul>
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
        </ul>
      </div>
      {tab === 'purchase-name' ? (
        <PurchaseRecord
          transactions={props.transactions}
          namesBlockchainInfos={props.namesBlockchainInfos}
          accounts={props.accounts}
          sendRChainTransaction={props.sendRChainTransaction}
          namesBlockchain={props.namesBlockchain}
          contractConfigs={contractConfigs}
          defaultContractId={props.namesBlockchainInfos.info.rchainNamesContractId}
          queryAndCacheContractConfig={queryAndCacheContractConfig}
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
      accounts: fromSettings.getRChainAccounts(state),
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
