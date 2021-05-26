import * as React from 'react';
import xs, { Stream } from 'xstream';
import debounce from 'xstream/extra/debounce';
import { connect } from 'react-redux';
import * as rchainToolkit from 'rchain-toolkit';

import * as fromMain from '../../store/main';
import * as fromUi from '../../store/ui';
import * as fromSettings from '../../store/settings';
import * as fromBlockchain from '../../store/blockchain';
import * as fromCommon from '../../common';
import { TransactionForm } from '.';
import { blockchain as blockchainUtils } from '../../utils/blockchain';
import { LOGREV_TO_REV_RATE, DEFAULT_PHLO_LIMIT } from '../../CONSTANTS';

import './TransactionModal.scss';
import { TransactionState, Account, RChainInfos, Record, TransactionOrigin } from '../../models';
import { REV_TRANSFER_PHLO_LIMIT } from '../../CONSTANTS';

interface PaymentRequestModalComponentProps {
  modal: undefined | fromMain.Modal;
  isMobile: boolean;
  isTablet: boolean;
  transactions: { [id: string]: TransactionState };
  rchainInfos: { [chainId: string]: RChainInfos };
  accounts: { [accountName: string]: Account };
  records: { [name: string]: Record };
  recordsBlockchain: RChainInfos | undefined;
  closeDappModal: (a: { dappId: string }) => void;
  closeModal: () => void;
  sendRChainTransaction: (a: fromBlockchain.SendRChainTransactionPayload) => void;
  saveFailedRChainTransaction: (a: fromBlockchain.SaveFailedRChainTransactionPayload) => void;
}

export class PaymentRequestModalComponent extends React.Component<PaymentRequestModalComponentProps, {}> {
  state: {
    privatekey: string;
    publickey: string;
    phloLimit: number;
    to: string;
    amount: number;
    seeCode: boolean;
    foundRecord: Record | undefined;
    foundRecordError: string;
  } = {
    privatekey: '',
    publickey: '',
    to: '',
    amount: 0,
    phloLimit: DEFAULT_PHLO_LIMIT,
    seeCode: false,
    foundRecord: undefined,
    foundRecordError: '',
  };

  toStream: Stream<{ to: string }> | undefined = undefined;

  componentDidMount() {
    this.toStream = xs.create();
    this.toStream.compose(debounce(500)).subscribe({
      next: (a: { to: string }) => {
        if (!this.props.modal) {
          return;
        }
        if (a.to) {
          if ([53, 54].includes(a.to.length)) {
            this.setState({
              foundRecord: undefined,
              to: a.to,
              foundRecordError: '',
            });
          } else {
            if (!this.props.recordsBlockchain) {
              this.setState({
                foundRecord: undefined,
                to: undefined,
                foundRecordError: `Network for names has not been found, cannot use the name system for transactions`,
              });
              return;
            }
            if (this.props.recordsBlockchain.chainId !== this.props.modal.parameters.chainId) {
              this.setState({
                foundRecord: undefined,
                to: undefined,
                foundRecordError: `Network ID "${this.props.modal.parameters.chainId}" does not match with network ID used for names "${this.props.recordsBlockchain.chainId}", cannot use the name system for transactions`,
              });
              return;
            }
            if (this.props.records[a.to]) {
              this.setState({
                foundRecord: this.props.records[a.to],
                // todo box -> publicKey
                to: rchainToolkit.utils.revAddressFromPublicKey(this.props.records[a.to].publicKey),
                foundRecordError: '',
              });
            } else {
              this.setState({
                foundRecord: undefined,
                to: undefined,
                foundRecordError: `Name "${a.to}" has not been found`,
              });
            }
          }
        } else {
          this.setState({
            foundRecord: undefined,
            to: undefined,
            foundRecordError: '',
          });
        }
      },
    });
  }

  onCloseModal = () => {
    const payload: fromCommon.SendRChainTransactionFromMiddlewarePayload = (this.props.modal as any).parameters;
    /*
      This modal can be openned from a dapp (third party),
      or from the tipping button (user action). In both cases
      there will be payload.dappId
    */
    if (payload.dappId) {
      /*
        If there is origin.dappId, we must save the failed transaction
        so the dapp will be notified of the discard
      */
      if (payload.origin.dappId) {
        this.props.saveFailedRChainTransaction({
          blockchainId: payload.chainId,
          platform: 'rchain',
          origin: {
            origin: 'dapp',
            dappId: payload.origin.dappId,
            dappTitle: payload.origin.dappTitle,
            callId: payload.origin.callId,
          },
          value: { message: 'Discarded by user' },
          sentAt: new Date().toISOString(),
          id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
        });
      }
      this.props.closeDappModal({
        dappId: (this.props.modal as fromMain.Modal).dappId as string,
      });
    } else {
      this.props.saveFailedRChainTransaction({
        blockchainId: payload.chainId,
        platform: 'rchain',
        origin: {
          origin: 'transfer',
        },
        value: { message: 'Discarded by user' },
        sentAt: new Date().toISOString(),
        id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
      });
      this.props.closeModal();
    }
  };

  onFilledTransactionData = (t: { privatekey: string; publickey: string; phloLimit: number }) => {
    this.setState(t);
  };

  onSendTransaction = () => {
    const payload: fromCommon.SendRChainPaymentRequestFromMiddlewarePayload = (this.props.modal as any).parameters;

    const fromAddress = rchainToolkit.utils.revAddressFromPublicKey(this.state.publickey);

    let validAfterBlockNumber = 0;
    if (this.props.rchainInfos && this.props.rchainInfos[payload.chainId]) {
      validAfterBlockNumber = this.props.rchainInfos[payload.chainId].info.lastFinalizedBlockNumber;
    }

    const deployOptions = blockchainUtils.rchain.getDeployOptions(
      new Date().valueOf(),
      blockchainUtils.transferFundsTerm(
        fromAddress,
        payload.parameters.to || this.state.to,
        LOGREV_TO_REV_RATE * (payload.parameters.amount || this.state.amount)
      ),
      this.state.privatekey,
      this.state.publickey,
      1,
      this.state.phloLimit,
      validAfterBlockNumber
    );

    /*
      This modal can be openned from a dapp (third party),
      or from the tipping button (user action). In both cases
      there will be payload.dappId
    */
    if (payload.dappId) {
      let origin: TransactionOrigin = { origin: 'transfer' };
      if (payload.origin.dappId) {
        origin = {
          origin: 'dapp',
          dappId: payload.origin.dappId,
          dappTitle: payload.origin.dappTitle,
          callId: payload.origin.callId,
        };
      }

      /*
        if origin is "dapp", there should already be an id
        if not, create one
      */
      let id: string | undefined = payload.id;
      if (!id) {
        id = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();
      }
      this.props.sendRChainTransaction({
        transaction: deployOptions,
        origin: origin,
        platform: 'rchain',
        blockchainId: payload.chainId,
        id: id,
        alert: false,
        sentAt: new Date().toISOString(),
      });
      this.props.closeDappModal({
        dappId: (this.props.modal as fromMain.Modal).dappId as string,
      });
    } else {
      this.props.sendRChainTransaction({
        transaction: deployOptions,
        origin: {
          origin: 'transfer',
        },
        platform: 'rchain',
        blockchainId: payload.chainId,
        id: new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString(),
        alert: true,
        sentAt: new Date().toISOString(),
      });
      this.props.closeModal();
    }
  };

  onToggleSeeCode = () => {
    this.setState({
      seeCode: !this.state.seeCode,
    });
  };

  onChangeTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.toStream) {
      this.toStream.shamefullySendNext({ to: e.target.value });
    }
  };

  render() {
    if (!this.props.modal) {
      return undefined;
    }

    let klasses = '';
    if (this.props.isMobile) {
      klasses += 'is-mobile';
    } else if (this.props.isTablet) {
      klasses += 'is-tablet';
    }

    if (this.props.modal.text.startsWith('tip')) {
      klasses += ' tip-modal'
    }

    if (!this.props.modal.parameters) {
      console.log('Error : there should be parameters in TransactionModal');
    }

    const payload: fromCommon.SendRChainPaymentRequestFromMiddlewarePayload = this.props.modal.parameters;

    let foundAccountName: string | undefined = undefined;
    let accounts = this.props.accounts;
    if (payload.parameters.from) {
      const foundKey = Object.keys(this.props.accounts).find(
        (k) => this.props.accounts[k].address === payload.parameters.from
      );
      if (foundKey) {
        foundAccountName = this.props.accounts[foundKey].name;
        accounts = { [foundKey]: this.props.accounts[foundKey] };
      }
    }

    let Title = () => <span>{t('transfer revs')}</span>;
    if (payload.parameters && payload.dappId && payload.origin && payload.origin.origin === 'dapp') {
      Title = () => <span>{t('dapp requests payment')}</span>;
    } else if (this.props.modal.text && this.props.modal.text.startsWith('tip')) {
      const t = this.props.modal.text;
      Title = () => <span><i className="fa fa-before fa-money-bill-wave"></i>{t}</span>;
    }

    return (
      <div className={`modal transaction-modal fc ${klasses}`}>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">
              <Title />
            </p>
            <i onClick={this.onCloseModal} className="fa fa-times" />
          </header>
          <section className="modal-card-body">
            <TransactionForm
              address={payload.parameters.from}
              accounts={accounts}
              phloLimit={REV_TRANSFER_PHLO_LIMIT}
              filledTransactionData={this.onFilledTransactionData}
            />
            <div className="to-and-amount-form">
              {!payload.parameters.to ? (
                <React.Fragment>
                  <div className="field is-horizontal form-to">
                    <label className="label">{t('to (rev address)')}*</label>
                    <div className="control">
                      <input onChange={this.onChangeTo} className="input" type="string" name="to" placeholder="To" />
                    </div>
                  </div>
                  {this.state.foundRecordError && <p className="text-danger">{this.state.foundRecordError}</p>}
                  {this.state.foundRecord && (
                    <div className="found-record">
                      <span>
                        Found record <b>{this.state.foundRecord.name}</b>
                      </span>
                      <br />
                      <span>Origin: {this.state.foundRecord.origin}</span>
                      <br />
                      <span>REV Address : {this.state.to}</span>
                    </div>
                  )}
                </React.Fragment>
              ) : undefined}
              {!payload.parameters.amount ? (
                <React.Fragment>
                  <div className="field is-horizontal">
                    <label className="label">{t('amount')}*</label>
                    <div className="control">
                      <input
                        onChange={(e) => {
                          this.setState({ amount: e.target.value });
                        }}
                        className="input"
                        type="number"
                        name="amount"
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                </React.Fragment>
              ) : undefined}
            </div>
            <br />
            <div className="payment">
              <div>
                <span className="label">{t('amount')}</span>
                <b>
                  {payload.parameters.amount || this.state.amount} {t('rev')}
                </b>
              </div>
              {payload.parameters.from ? (
                <div>
                  <span className="label">{t('from')}</span>
                  <span>
                    {payload.parameters.from} {foundAccountName ? `(${foundAccountName})` : undefined}
                  </span>
                </div>
              ) : undefined}

              <div>
                <span className="label">{t('to')}</span>
                <span>{payload.parameters.to || this.state.to}</span>
              </div>
            </div>
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

export const PaymentRequestModal = connect(
  (state) => ({
    isMobile: fromUi.getIsMobile(state),
    isTablet: fromUi.getIsTablet(state),
    transactions: fromBlockchain.getTransactions(state),
    rchainInfos: fromBlockchain.getRChainInfos(state),
    accounts: fromSettings.getAccounts(state),
    records: fromBlockchain.getRecords(state),
    recordsBlockchain: fromBlockchain.getNamesBlockchainInfos(state),
  }),
  (dispatch) => ({
    closeDappModal: (a: { dappId: string }) => {
      dispatch(fromMain.closeDappModalAction(a));
    },
    closeModal: () => {
      dispatch(fromMain.closeModalAction());
    },
    sendRChainTransaction: (a: fromBlockchain.SendRChainTransactionPayload) =>
      dispatch(fromBlockchain.sendRChainTransactionAction(a)),
    saveFailedRChainTransaction: (a: fromBlockchain.SaveFailedRChainTransactionPayload) =>
      dispatch(fromBlockchain.saveFailedRChainTransactionAction(a)),
  })
)(PaymentRequestModalComponent);
