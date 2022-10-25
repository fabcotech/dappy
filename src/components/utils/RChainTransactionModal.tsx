import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blake2b } from 'blakejs';

import { State as StoreState } from '/store';
import * as fromMain from '/store/main';
import * as fromUi from '/store/ui';
import * as fromSettings from '/store/settings';
import * as fromBlockchain from '/store/blockchain';
import * as fromCommon from '/common';
import { TransactionForm } from '.';
import { rchainWallet } from '/utils/wallets';
import { signSecp256k1 } from '/utils/signSecp256k1';

import './RChainTransactionModal.scss';
import { TransactionState, TransactionStatus, RChainInfos, BlockchainAccount } from '/models';

interface RChainTransactionModalComponentProps {
  modal: undefined | fromMain.Modal;
  isMobile: boolean;
  isTablet: boolean;
  transactions: { [id: string]: TransactionState };
  rchainInfos: { [chainId: string]: RChainInfos };
  accounts: { [accountName: string]: BlockchainAccount };
  closeDappModal: (a: fromMain.CloseDappModalPayload) => void;
  sendRChainTransaction: (a: fromBlockchain.SendRChainTransactionPayload) => void;
  saveFailedRChainTransaction: (a: fromBlockchain.SaveFailedRChainTransactionPayload) => void;
}

export class RChainTransactionModalComponent extends Component<RChainTransactionModalComponentProps> {
  state: {
    privatekey: string;
    box: undefined | string;
    accountName: undefined | string;
    publickey: string;
    phloLimit: number;
    seeCode: boolean;
    seeSignatures: boolean;
  } = {
    privatekey: '',
    box: undefined,
    accountName: undefined,
    publickey: '',
    phloLimit: 1600,
    seeCode: false,
    seeSignatures: false,
  };

  onJustCloseModal = () => {
    this.props.closeDappModal({
      tabId: (this.props.modal as fromMain.Modal).tabId as string,
    });
  };

  onCloseModal = () => {
    const payload: fromCommon.SendRChainTransactionFromMiddlewarePayload = (this.props.modal as any)
      .parameters;
    this.props.saveFailedRChainTransaction({
      blockchainId: payload.chainId,
      platform: 'rchain',
      origin: {
        origin: 'dapp',
        accountName: '',
        tabId: payload.origin.tabId,
        dappTitle: payload.origin.dappTitle,
        callId: payload.origin.callId,
      },
      value: { message: 'Discarded by user' },
      sentAt: new Date().toISOString(),
      id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
    });
    this.props.closeDappModal({
      tabId: (this.props.modal as fromMain.Modal).tabId as string,
    });
  };

  onFilledTransactionData = (t: {
    privatekey: string;
    publickey: string;
    phloLimit: number;
    box: undefined | string;
    accountName: undefined | string;
  }) => {
    this.setState(t);
  };

  onSendTransaction = () => {
    const payload: fromCommon.SendRChainTransactionFromMiddlewarePayload = (this.props.modal as any)
      .parameters;

    let validAfterBlockNumber = 0;
    let shardId = 'dev';
    if (this.props.rchainInfos && this.props.rchainInfos[payload.chainId]) {
      validAfterBlockNumber = this.props.rchainInfos[payload.chainId].info.lastFinalizedBlockNumber;
      shardId = this.props.rchainInfos[payload.chainId].info.rchainShardId;
    }

    let term = payload.parameters.term;

    if (term) {
      term = term.replace(/BOX_ID/g, this.state.box || '');
      term = term.replace(/PUBLIC_KEY/g, this.state.publickey);
    }

    if (payload.parameters.signatures) {
      Object.keys(payload.parameters.signatures).forEach((k) => {
        // should never happen
        if (!payload.parameters.signatures || !payload.parameters.signatures[k]) {
          return;
        }
        const uInt8Array = new Uint8Array(
          payload.parameters.signatures[k].split(',').map((v) => parseInt(v, 10))
        );
        const blake2bHash = blake2b(uInt8Array, 0, 32);
        const signature = signSecp256k1(blake2bHash, this.state.privatekey);
        const signatureHex = Buffer.from(signature).toString('hex');
        term = (term || '').replace(new RegExp(k, 'g'), signatureHex);
      });
    }

    const deployOptions = rchainWallet.signTransaction(
      {
        term: term as string,
        timestamp: new Date().valueOf(),
        phloPrice: 1,
        shardId,
        phloLimit: this.state.phloLimit,
        validAfterBlockNumber,
      },
      this.state.privatekey
    );

    this.props.sendRChainTransaction({
      transaction: deployOptions,
      origin: {
        origin: 'dapp',
        accountName: this.state.accountName as string,
        tabId: payload.origin.tabId,
        dappTitle: payload.origin.dappTitle,
        callId: payload.origin.callId,
      },
      platform: 'rchain',
      blockchainId: payload.chainId,
      id: payload.id,
      alert: false,
      sentAt: new Date().toISOString(),
    });
  };

  onToggleSeeCode = () => {
    this.setState({
      seeCode: !this.state.seeCode,
    });
  };

  onToggleSeeSignatures = () => {
    this.setState({
      seeSignatures: !this.state.seeSignatures,
    });
  };

  render() {
    if (!this.props.modal) {
      return undefined;
    }

    if (!this.props.modal.parameters) {
      console.log('Error : there should be parameters in TransactionModal');
    }

    const transactionId = ((this.props.modal as any).parameters as any).id;

    if (
      transactionId &&
      this.props.transactions[transactionId] &&
      [TransactionStatus.Aired, TransactionStatus.Failed].includes(
        this.props.transactions[transactionId].status
      )
    ) {
      this.onJustCloseModal();
    }

    const payload: fromCommon.SendRChainTransactionFromMiddlewarePayload =
      this.props.modal.parameters;
    const signatures = payload.parameters.signatures;
    let klasses = '';
    if (this.props.isMobile) {
      klasses += 'is-mobile';
    } else if (this.props.isTablet) {
      klasses += 'is-tablet';
    }

    return (
      <div className={`modal transaction-modal fc ${klasses}`}>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{t('signing rchain transaction')}</p>
            <i onClick={this.onCloseModal} className="fa fa-times" />
          </header>
          <section className="modal-card-body">
            <TransactionForm
              chooseBox={true}
              accounts={this.props.accounts}
              filledTransactionData={this.onFilledTransactionData}
            />
            <br />
            {signatures && Object.keys(signatures).length ? (
              <React.Fragment>
                <h5 className="is-6 title">{t('signatures')}</h5>
                <p>
                  {Object.keys(signatures).length} {t('n signature(s) will be generated')}
                </p>
                {this.state.seeSignatures ? (
                  <ul className="signatures" onClick={this.onToggleSeeSignatures}>
                    {Object.keys(signatures).map((k) => (
                      <li key={k}>
                        {k}: {signatures[k]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <pre className="toggle-see-signatures" onClick={this.onToggleSeeSignatures}>
                    <code>{t('see required signature(s)')}</code>
                  </pre>
                )}
                <br />
              </React.Fragment>
            ) : undefined}
            <h5 className="is-6 title">{t('code')}</h5>
            {this.state.seeCode ? (
              <pre onClick={this.onToggleSeeCode}>
                <code>{payload.parameters.term}</code>
              </pre>
            ) : (
              <pre className="toggle-see-code" onClick={this.onToggleSeeCode}>
                <code>{t('see code')}</code>
              </pre>
            )}
          </section>
          <footer className="modal-card-foot">
            <button type="button" className="button is-light" onClick={this.onCloseModal}>
              {t('discard transaction')}
            </button>
            <button
              type="button"
              disabled={!this.state.privatekey}
              className="button is-link"
              onClick={this.onSendTransaction}
            >
              {t('send transaction')}
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

export const RChainTransactionModal = connect(
  (state: StoreState) => ({
    isMobile: fromUi.getIsMobile(state),
    isTablet: fromUi.getIsTablet(state),
    transactions: fromBlockchain.getTransactions(state),
    rchainInfos: fromBlockchain.getRChainInfos(state),
    accounts: fromSettings.getRChainAccounts(state),
  }),
  (dispatch) => ({
    closeDappModal: (a: fromMain.CloseDappModalPayload) => {
      dispatch(fromMain.closeDappModalAction(a));
    },
    sendRChainTransaction: (a: fromBlockchain.SendRChainTransactionPayload) =>
      dispatch(fromBlockchain.sendRChainTransactionAction(a)),
    saveFailedRChainTransaction: (a: fromBlockchain.SaveFailedRChainTransactionPayload) =>
      dispatch(fromBlockchain.saveFailedRChainTransactionAction(a)),
  })
)(RChainTransactionModalComponent);
