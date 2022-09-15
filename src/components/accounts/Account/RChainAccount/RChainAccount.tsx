import React from 'react';
import { connect } from 'react-redux';

import { Account as AccountModel, Blockchain } from '/models';
import * as fromSettings from '/store/settings';
import * as fromMain from '/store/main';
import * as fromCommon from '/common';
import { State } from '/store';
import { getIsBalancesHidden } from '/store/ui';
import { LOGREV_TO_REV_RATE, FAKE_BALANCE } from '/CONSTANTS';
import { formatAmount } from '/utils/formatAmount';
import { copyToClipboard } from '/interProcess';
import { GlossaryHint } from '/components/utils/Hint';

import './RChainAccount.scss';
import { WalletAddress } from '/components/utils/WalletAddress';

interface AccountComponentProps {
  account: AccountModel;
  isBalancesHidden: boolean;
  namesBlockchain: Blockchain | undefined;
  showAccountModal: (a: AccountModel) => void;
  setAccountAsMain: (a: AccountModel) => void;
  sendRChainPayment: (a: AccountModel, chainId: string) => void;
  deleteAccount: (a: AccountModel) => void;
}

export const RChainAccountComponent = ({
  account,
  isBalancesHidden,
  namesBlockchain,
  showAccountModal,
  setAccountAsMain,
  sendRChainPayment,
  deleteAccount,
}: AccountComponentProps) => {
  return (
    <div className="rchain-account box">
      <div className="header">
        <b className="name" onClick={() => showAccountModal(account)}>
          {account.name}
          {account.main ? <span className="tag is-light">{t('main')}</span> : undefined}
        </b>
        <div className="actions">
          {account.main ? undefined : (
            <button
              title={t('set as main account')}
              onClick={() => setAccountAsMain(account)}
              className="button is-light is-small">
              {t('set as main account')}
            </button>
          )}
          {!!namesBlockchain ? (
            <a
              title={t('send revs')}
              className="underlined-link"
              onClick={() => sendRChainPayment(account, (namesBlockchain as Blockchain).chainId)}>
              <i className="fa fa-before fa-money-bill-wave"></i>
              {t('send revs')}
            </a>
          ) : (
            <p className="text-danger">{t('no network cannot send revs')}</p>
          )}
          <a onClick={() => showAccountModal(account)} className="underlined-link">
            <i className="fa fa-before fa-eye"></i>
            {t('check account')}
          </a>
        </div>
      </div>
      <div className="balance">
        <div>
          <div className="address has-text-weight-bold ">
            {t('address')}
            <a className="ml-3 underlined-link" onClick={() => copyToClipboard(account.address)}>
              <i className="fa fa-copy fa-before"></i>
              {t('copy')}
            </a>
          </div>
          <WalletAddress address={account.address} />
        </div>
        <span title={account.balance.toString()} className={`num ${isBalancesHidden ? 'blur' : ''}`}>
          {formatAmount(isBalancesHidden ? FAKE_BALANCE : account.balance)}
        </span>
        <span className="unit">{t('rev', true)}</span>
        <GlossaryHint term="what is rev ?" />
        {!isBalancesHidden && (
          <span className="dust">{account.balance * LOGREV_TO_REV_RATE}</span>
        )}
      </div>
      <a
        title="Remove the account forever"
        onClick={() => deleteAccount(account)}
        className="remove-account underlined-link red">
        {t('remove account')}
      </a>
    </div>
  );
};

export const RChainAccount = connect(
  (state: State) => ({
    blockchains: fromSettings.getOkBlockchains(state),
    namesBlockchain: fromSettings.getNamesBlockchain(state),
    executingAccountsCronJobs: fromSettings.getExecutingAccountsCronJobs(state),
    isBalancesHidden: getIsBalancesHidden(state),
  }),
  (dispatch) => ({
    setAccountAsMain: (a: AccountModel) =>
      dispatch(
        fromSettings.updateAccountAction({
          account: {
            ...a,
            main: true,
          },
        })
      ),
    showAccountModal: (a: AccountModel) =>
      dispatch(
        fromMain.openModalAction({
          title: 'ACCOUNT_MODAL',
          text: '',
          parameters: { account: a },
          buttons: [
            {
              text: 'Cancel',
              classNames: 'is-light',
              action: [fromMain.closeModalAction()],
            },
          ],
        })
      ),
    sendRChainPayment: (a: AccountModel, chainId: string) => {
      const parameters: fromCommon.RChainPaymentRequestParameters = {
        from: a.address,
        to: undefined,
        amount: undefined,
      };
      dispatch(
        fromMain.openModalAction({
          title: 'PAYMENT_REQUEST_MODAL',
          text: '',
          parameters: {
            parameters: parameters,
            chainId: chainId,
          },
          buttons: [],
        })
      );
    },
    openModal: (t: fromMain.OpenModalPayload) => {
      dispatch(fromMain.openModalAction(t));
    },
    deleteAccount: (a: AccountModel) =>
      dispatch(
        fromMain.openModalAction({
          title: 'REMOVE_ACCOUNT_MODAL',
          text: '',
          parameters: {
            account: a,
          },
          buttons: [],
        })
      ),
  })
)(RChainAccountComponent);
