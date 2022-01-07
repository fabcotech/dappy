import React, { useState } from 'react';
import { connect } from 'react-redux';

import { AccountSelect } from '../AccountSelect';
import { Modal, closeDappModalAction, CloseDappModalPayload } from '/store/main';
import { getEVMAccounts } from '/store/settings';
import { Account } from '/models';

import { evmWallet } from '/utils/wallets';

import './EthereumSignTransactionModal.scss';
import { TxData } from '@ethereumjs/tx';
import { EthereumTransaction } from '/common';

interface EthereumSignTransactionModalProps {
  modal: Modal;
  close: (a: CloseDappModalPayload) => void;
  accounts: Record<string, Account>;
  returnSignedTransaction: (chainId: string, txData: TxData, resourceId: string) => void;
}

export const EthereumSignTransactionModalComponent = ({
  modal,
  close,
  accounts,
  returnSignedTransaction,
}: EthereumSignTransactionModalProps) => {
  const [privateKey, setPrivateKey] = useState<string>();
  const txData: EthereumTransaction = modal.parameters.parameters;

  return (
    <div className="modal fc est">
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{t('Signing Ethereum transaction')}</p>
          <i onClick={() => close({ resourceId: modal.resourceId! })} className="fa fa-times" />
        </header>
        <section className="modal-card-body">
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <div className="label">{t('transaction body')}</div>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <pre>{JSON.stringify(modal.parameters.parameters, null, 2)}</pre>
                </div>
              </div>
            </div>
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
          <button type="button" className="button is-outlined" onClick={() => close({ resourceId: modal.resourceId! })}>
            {t('cancel signing')}
          </button>

          <button
            type="button"
            className="button is-link"
            disabled={!privateKey}
            onClick={() => {
              const signedTx = evmWallet.signTransaction(txData, privateKey!);
              returnSignedTransaction(txData.chainId, signedTx, modal.resourceId!);
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
    close: (a: CloseDappModalPayload) => dispatch(closeDappModalAction(a)),
    returnSignedTransaction: (chainId: string, txData: TxData, resourceId: string) => {
      // dispatch(saveEthereumSignedTransactionAction({
      // blockchainId: chainId.toString(),
      // transaction: txData,
      // }))

      dispatch(closeDappModalAction({ resourceId }));
    },
  })
)(EthereumSignTransactionModalComponent);
