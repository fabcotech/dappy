import * as React from 'react';
import { connect } from 'react-redux';
import { blake2b } from 'blakejs';

import * as fromMain from '../../store/main';
import * as fromUi from '../../store/ui';
import * as fromSettings from '../../store/settings';
import * as fromBlockchain from '../../store/blockchain';
import * as fromCommon from '../../common';
import { TransactionForm } from '.';
import { blockchain as blockchainUtils } from '../../utils/blockchain';
import { signSecp256k1 } from '../../utils/signSecp256k1';
import { generateNonce } from '../../utils/generateNonce';

import './TransactionModal.scss';
import { TransactionState, TransactionStatus, Account, RChainInfos } from '../../models';

interface TransactionModalComponentProps {
  modal: undefined | fromMain.Modal;
  isMobile: boolean;
  isTablet: boolean;
  transactions: { [id: string]: TransactionState };
  rchainInfos: { [chainId: string]: RChainInfos };
  accounts: { [accountName: string]: Account };
  closeDappModal: (a: { dappId: string }) => void;
  sendRChainTransaction: (a: fromBlockchain.SendRChainTransactionPayload) => void;
  saveFailedRChainTransaction: (a: fromBlockchain.SaveFailedRChainTransactionPayload) => void;
}

export class TransactionModalComponent extends React.Component<TransactionModalComponentProps, {}> {
  state: {
    privatekey: string;
    box: undefined | string;
    publickey: string;
    phloLimit: number;
    seeCode: boolean;
    seeSignatures: boolean;
  } = {
    privatekey: '',
    box: undefined,
    publickey: '',
    phloLimit: 1600,
    seeCode: false,
    seeSignatures: false,
  };

  onJustCloseModal = () => {
    this.props.closeDappModal({
      dappId: (this.props.modal as fromMain.Modal).dappId as string,
    });
  };

  onCloseModal = () => {
    const payload: fromCommon.SendRChainTransactionFromMiddlewarePayload = (this.props.modal as any).parameters;
    this.props.saveFailedRChainTransaction({
      blockchainId: payload.chainId,
      platform: 'rchain',
      origin: {
        origin: 'dapp',
        dappId: payload.origin.dappId,
        dappTitle: payload.origin.dappTitle,
        callId: payload.origin.callId,
      },
      value: { message: `Discarded by user` },
      sentAt: new Date().toISOString(),
      id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
    });
    this.props.closeDappModal({
      dappId: (this.props.modal as fromMain.Modal).dappId as string,
    });
  };

  onFilledTransactionData = (t: {
    privatekey: string;
    publickey: string;
    phloLimit: number;
    box: undefined | string;
  }) => {
    this.setState(t);
  };

  onSendTransaction = () => {
    const payload: fromCommon.SendRChainTransactionFromMiddlewarePayload = (this.props.modal as any).parameters;

    let validAfterBlockNumber = 0;
    if (this.props.rchainInfos && this.props.rchainInfos[payload.chainId]) {
      validAfterBlockNumber = this.props.rchainInfos[payload.chainId].info.lastFinalizedBlockNumber;
    }

    let term = payload.parameters.term;

    if (term) {
      while (term.indexOf('NONCE') !== -1) {
        const nonce = generateNonce();
        term = term.replace('NONCE', nonce);
      }
      while (term.indexOf('TO_BOX_REGISTRY_URI') !== -1) {
        term = term.replace('TO_BOX_REGISTRY_URI', this.state.box || '');
      }
      while (term.indexOf('FROM_BOX_REGISTRY_URI') !== -1) {
        term = term.replace('FROM_BOX_REGISTRY_URI', this.state.box || '');
      }
      term = term.replace(new RegExp('PUBLIC_KEY', 'g'), this.state.publickey);
    }

    if (payload.parameters.signatures) {
      Object.keys(payload.parameters.signatures).forEach((k) => {
        // should never happen
        if (!payload.parameters.signatures || !payload.parameters.signatures[k]) {
          return;
        }
        const uInt8Array = new Uint8Array(payload.parameters.signatures[k].split(','));
        const blake2bHash = blake2b(uInt8Array, 0, 32);
        const signature = signSecp256k1(blake2bHash, this.state.privatekey);
        const signatureHex = Buffer.from(signature).toString('hex');
        term = (term || '').replace(new RegExp(k, 'g'), signatureHex);
      });
    }

    const deployOptions = blockchainUtils.rchain.getDeployOptions(
      new Date().valueOf(),
      term as string,
      this.state.privatekey,
      this.state.publickey,
      1,
      this.state.phloLimit,
      validAfterBlockNumber
    );

    this.props.sendRChainTransaction({
      transaction: deployOptions,
      origin: {
        origin: 'dapp',
        dappId: payload.origin.dappId,
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
      [TransactionStatus.Aired, TransactionStatus.Failed].includes(this.props.transactions[transactionId].status)
    ) {
      this.onJustCloseModal();
    }

    const payload: fromCommon.SendRChainTransactionFromMiddlewarePayload = this.props.modal.parameters;
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
            <p className="modal-card-title">Dapp wishes to send a transaction</p>
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
            <button type="button" className={`button is-light`} onClick={this.onCloseModal}>
              {t('discard transaction')}
            </button>
            <button
              type="button"
              disabled={!this.state.privatekey}
              className={`button is-link`}
              onClick={this.onSendTransaction}>
              {t('send transaction')}
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

export const TransactionModal = connect(
  (state) => ({
    isMobile: fromUi.getIsMobile(state),
    isTablet: fromUi.getIsTablet(state),
    transactions: fromBlockchain.getTransactions(state),
    rchainInfos: fromBlockchain.getRChainInfos(state),
    accounts: fromSettings.getAccounts(state),
  }),
  (dispatch) => ({
    closeDappModal: (a: { dappId: string }) => {
      dispatch(fromMain.closeDappModalAction(a));
    },
    sendRChainTransaction: (a: fromBlockchain.SendRChainTransactionPayload) =>
      dispatch(fromBlockchain.sendRChainTransactionAction(a)),
    saveFailedRChainTransaction: (a: fromBlockchain.SaveFailedRChainTransactionPayload) =>
      dispatch(fromBlockchain.saveFailedRChainTransactionAction(a)),
  })
)(TransactionModalComponent);
