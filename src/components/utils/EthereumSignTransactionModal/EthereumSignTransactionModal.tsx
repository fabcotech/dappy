import React, { useState } from 'react';
import { connect } from 'react-redux';
import { fromWei } from 'web3-utils';

import { AccountSelect } from '../AccountSelect';
import { copyToClipboard } from '/interProcess';
import { Modal, closeDappModalAction } from '/store/main';
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
import { getUniqueTransactionId } from '/utils';
import { EvmNetwork } from '../EvmNetwork';

import './EthereumSignTransactionModal.scss';

const labels: { [a: string]: string } = {
  chainId: 'Chain ID',
  from: 'From',
  to: 'To',
  gasLimit: 'Gas limit',
  gasPrice: 'Gas price',
  value: 'Value',
  data: 'Data',
};

const StaticField = (props: {
  label: string;
  value: number | string;
  copy?: boolean;
  bold?: boolean;
}) => (
  <div className="field is-horizontal">
    <div className="field-label is-normal">
      <label className="label">{labels[props.label] || props.label}</label>
    </div>
    <div className="field-body">
      <div className="field">
        <p className="control">
          {props.bold ? (
            <b className="pr-2">{props.value}</b>
          ) : (
            <span className="pr-2">{props.value}</span>
          )}

          {props.value !== 'none' && props.copy && (
            <a className="underlined-link" onClick={() => copyToClipboard(props.value.toString())}>
              <i className="fas fa-copy mr-1"></i>
              {t('copy')}
            </a>
          )}
        </p>
      </div>
    </div>
  </div>
);

export const isHexaString = (hexaString: string) =>
  hexaString && hexaString.length && /^0x[\da-f]+$/i.test(hexaString);

export const toGwei = (hexaString: string) => {
  return isHexaString(hexaString) ? `${fromWei(hexaString, 'gwei')} gwei` : t('none');
};

export const toNumber = (hexaString: string) => {
  return isHexaString(hexaString) ? Number(hexaString) : 'none';
};

export const toHumanReadableEthUnit = (hexaString: string) => {
  if (!isHexaString(hexaString)) {
    return 'none';
  }
  const n = Number(hexaString);

  if (n < 10 ** 6) {
    return `${n} wei`;
  }
  if (n >= 10 ** 6 && n < 10 ** 6) {
    return `${fromWei(hexaString, 'gwei')} gwei`;
  }
  return `${fromWei(hexaString, 'ether')} ether`;
};

interface EthereumSignTransactionModalProps {
  modal: Modal;
  close: (
    chainId: number,
    signedTx: EthereumTransaction,
    origin: TransactionOriginDapp,
    tabId: string
  ) => void;
  accounts: Record<string, Account>;
  returnSignedTransaction: (
    chainId: number,
    signedTx: EthereumSignedTransaction,
    origin: TransactionOriginDapp,
    tabId: string
  ) => void;
}

export const EthereumSignTransactionModalComponent = ({
  modal,
  close,
  accounts,
  returnSignedTransaction,
}: EthereumSignTransactionModalProps) => {
  const [privateKey, setPrivateKey] = useState<string>();
  const [address, setAddress] = useState<string>();
  const txData: EthereumTransaction = modal.parameters.parameters;
  const origin: TransactionOriginDapp = modal.parameters.origin;

  let transactionType = 'Regular (transfer)';
  if (!txData.to) {
    transactionType = 'Contract deployment';
  } else if (txData.data) {
    transactionType = 'Contract execution / calling';
  }
  return (
    <div className="modal fc est">
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{t('signing ethereum transaction')}</p>
          <i
            onClick={() => close(txData.chainId, txData, origin, modal.tabId!)}
            className="fas fa-times"
          />
        </header>
        <section className="modal-card-body modal-card-body-sign-ethereum-modal">
          <div className="transaction-body">
            <EvmNetwork chainId={modal.parameters.parameters.chainId} />
            <StaticField label="type" bold value={transactionType} />
            {modal.parameters.parameters.from ? (
              <StaticField copy label="from" value={modal.parameters.parameters.from} />
            ) : undefined}
            <StaticField copy label="to" value={modal.parameters.parameters.to || 'none'} />
            <StaticField label="nonce" value={toNumber(modal.parameters.parameters.nonce)} />
            <StaticField label="gasLimit" value={toNumber(modal.parameters.parameters.gasLimit)} />
            <StaticField label="gasPrice" value={toGwei(modal.parameters.parameters.gasPrice)} />
            <StaticField
              label="value"
              value={toHumanReadableEthUnit(modal.parameters.parameters.value)}
            />
            <StaticField copy label="data" value={modal.parameters.parameters.data || 'none'} />
          </div>
          <AccountSelect
            chooseBox={false}
            updatePrivateKey={(a) => {
              setAddress(a.address);
              setPrivateKey(a.privatekey);
            }}
            accounts={accounts}
          />
          {address &&
            modal.parameters.parameters.from &&
            address !== modal.parameters.parameters.from && (
              <span className="text-warning same-as-label">
                Address of the account does not match .from property
              </span>
            )}
        </section>
        <footer className="modal-card-foot is-justify-content-end">
          <button
            type="button"
            className="button is-outlined"
            onClick={() => close(txData.chainId, txData, origin, modal.tabId!)}
          >
            {t('discard transaction')}
          </button>

          <button
            type="button"
            className="button is-link"
            disabled={!privateKey}
            onClick={() => {
              const signedTx = evmWallet.signTransaction(txData, privateKey!);
              returnSignedTransaction(txData.chainId, signedTx, origin, modal.tabId!);
            }}
          >
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
    close: (
      chainId: number,
      tx: EthereumTransaction,
      origin: TransactionOriginDapp,
      tabId: string
    ) => {
      dispatch(
        saveEthereumTransactionStateAction({
          sentAt: new Date().toISOString(),
          platform: 'evm',
          id: getUniqueTransactionId(),
          origin,
          transaction: tx,
          blockchainId: chainId.toString(),
          status: TransactionStatus.Failed,
        })
      );
      dispatch(
        closeDappModalAction({
          tabId,
        })
      );
    },
    returnSignedTransaction: (
      chainId: number,
      signedTx: EthereumSignedTransaction,
      origin: TransactionOriginDapp,
      tabId: string
    ) => {
      dispatch(
        saveEthereumTransactionStateAction({
          sentAt: new Date().toISOString(),
          platform: 'evm',
          id: getUniqueTransactionId(),
          origin,
          transaction: signedTx,
          blockchainId: chainId.toString(),
          status: TransactionStatus.Signed,
        })
      );

      dispatch(closeDappModalAction({ tabId }));
    },
  })
)(EthereumSignTransactionModalComponent);
