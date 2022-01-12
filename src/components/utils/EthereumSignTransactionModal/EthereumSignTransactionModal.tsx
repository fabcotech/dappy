import React, { useState } from 'react';
import { connect } from 'react-redux';

import { AccountSelect } from '../AccountSelect';
import { copyToClipboard } from '/interProcess';
import { Modal, closeDappModalAction, CloseDappModalPayload } from '/store/main';
import { getEVMAccounts } from '/store/settings';
import {
  Account,
  EthereumSignedTransaction,
  EthereumTransaction,
  TransactionOriginDapp,
  TransactionStatus,
} from '/models';

import { evmWallet } from '/utils/wallets';

import { saveEthereumTransactionStateAction } from '/store/blockchain';

import './EthereumSignTransactionModal.scss';
import { blockchain } from '/utils';
import { EvmNetwork } from '../EvmNetwork';

interface EthereumSignTransactionModalProps {
  modal: Modal;
  close: (chainId: string, signedTx: EthereumTransaction, origin: TransactionOriginDapp, resourceId: string) => void;
  accounts: Record<string, Account>;
  returnSignedTransaction: (
    chainId: string,
    signedTx: EthereumSignedTransaction,
    origin: TransactionOriginDapp,
    resourceId: string
  ) => void;
}

const StaticField = (props: { label: string, value: number | string, copy?: boolean }) =>
  <div className="field is-horizontal">
    <div className="field-label is-normal">
      <label className="label">{props.label}</label>
    </div>
    <div className="field-body">
      <div className="field">
        <p className="control">
          <span>{props.value}&nbsp;&nbsp;</span>
          {
            props.value !== 'none' && props.copy &&
            <a className="underlined-link" onClick={() => copyToClipboard(props.value.toString())}>
              <i className="fa fa-copy fa-before"></i>
              {t('copy')}
            </a>
          }
        </p>
      </div>
    </div>
  </div>

export const EthereumSignTransactionModalComponent = ({
  modal,
  close,
  accounts,
  returnSignedTransaction,
}: EthereumSignTransactionModalProps) => {
  const [privateKey, setPrivateKey] = useState<string>();
  const txData: EthereumTransaction = modal.parameters.parameters;
  const origin: TransactionOriginDapp = modal.parameters.origin;

  return (
    <div className="modal fc est">
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{t('Signing Ethereum transaction')}</p>
          <i onClick={() => close(txData.chainId, txData, origin, modal.resourceId!)} className="fa fa-times" />
        </header>
        <section className="modal-card-body modal-card-body-sign-ethereum-modal">
          <div className="transaction-body">
            <EvmNetwork chainId={modal.parameters.parameters.chainId} />
            <StaticField copy label="from" value={modal.parameters.parameters.from || 'none' }/>
            <StaticField copy label="to" value={modal.parameters.parameters.to || 'none' }/>
            <StaticField label="nonce" value={modal.parameters.parameters.nonce || 'none' }/>
            <StaticField label="gasLimit" value={modal.parameters.parameters.gasLimit || 'none' }/>
            <StaticField label="gasPrice" value={modal.parameters.parameters.gasPrice || 'none' }/>
            <StaticField copy label="value" value={modal.parameters.parameters.value || 'none' }/>
            <StaticField copy label="data" value={modal.parameters.parameters.data || 'none' }/>
          </div>
          <AccountSelect
            chooseBox={false}
            updatePrivateKey={(a) => {
              setPrivateKey(a.privatekey);
            }}
            accounts={accounts}
          />
        </section>
        <footer className="modal-card-foot is-justify-content-end">
          <button
            type="button"
            className="button is-outlined"
            onClick={() => close(txData.chainId, txData, origin, modal.resourceId!)}>
            {t('cancel signing')}
          </button>

          <button
            type="button"
            className="button is-link"
            disabled={!privateKey}
            onClick={() => {
              const signedTx = evmWallet.signTransaction(txData, privateKey!);
              returnSignedTransaction(txData.chainId, signedTx, origin, modal.resourceId!);
            }}>
            {t('sign transaction')}
          </button>
        </footer>
      </div>
    </div>
  );
};

export const EthereumSignTransactionModal = connect(
  (state) => ({
    accounts: getEVMAccounts(state),
  }),
  (dispatch) => ({
    close: (chainId: string, tx: EthereumTransaction, origin: TransactionOriginDapp, resourceId: string) => {
      dispatch(
        saveEthereumTransactionStateAction({
          sentAt: new Date().toISOString(),
          platform: 'evm',
          id: blockchain.getUniqueTransactionId(),
          origin,
          transaction: tx,
          blockchainId: chainId.toString(),
          status: TransactionStatus.Failed,
        })
      );
      dispatch(
        closeDappModalAction({
          resourceId,
        })
      );
    },
    returnSignedTransaction: (
      chainId: string,
      signedTx: EthereumSignedTransaction,
      origin: TransactionOriginDapp,
      resourceId: string
    ) => {
      dispatch(
        saveEthereumTransactionStateAction({
          sentAt: new Date().toISOString(),
          platform: 'evm',
          id: blockchain.getUniqueTransactionId(),
          origin,
          transaction: signedTx,
          blockchainId: chainId.toString(),
          status: TransactionStatus.Signed,
        })
      );

      dispatch(closeDappModalAction({ resourceId }));
    },
  })
)(EthereumSignTransactionModalComponent);
