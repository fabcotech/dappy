import React from 'react';
import { connect } from 'react-redux';

import { BlockchainAccount } from '/models';
import * as fromSettings from '/store/settings';
import * as fromMain from '/store/main';
import * as fromCommon from '/common';
import { State } from '/store';
import { getIsBalancesHidden } from '/store/ui';
import { copyToClipboard } from '/interProcess';

import { WalletAddress } from '/components/utils/WalletAddress';

interface AccountComponentProps {
  account: BlockchainAccount;
  isBalancesHidden: boolean;
  showAccountModal: (a: BlockchainAccount) => void;
  setAccountAsMain: (a: BlockchainAccount) => void;
  sendRChainPayment: (a: BlockchainAccount, chainId: string) => void;
  deleteAccount: (a: BlockchainAccount) => void;
}

export const RChainAccountComponent = ({
  account,
  showAccountModal,
  setAccountAsMain,
  deleteAccount,
}: AccountComponentProps) => {
  return (
    <div className="evm-account box">
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
              className="button is-light is-small"
            >
              {t('set as main account')}
            </button>
          )}
          <a onClick={() => showAccountModal(account)} className="underlined-link">
            <i className="fas fa-eye mr-1"></i>
            {t('check account')}
          </a>
        </div>
      </div>
      <div className="body">
        <div>
          <div className="address has-text-weight-bold ">
            {t('address')}
            <a className="ml-3 underlined-link" onClick={() => copyToClipboard(account.address)}>
              <i className="mr-1 fas fa-copy"></i>
              {t('copy')}
            </a>
          </div>
          <WalletAddress address={account.address} />
        </div>
      </div>
      <div className="footer">
        <a
          title="Remove the account forever"
          onClick={() => deleteAccount(account)}
          className="remove-account underlined-link red"
        >
          {t('remove account')}
        </a>
      </div>
    </div>
  );
};

export const RChainAccount = connect(
  (state: State) => ({
    blockchains: fromSettings.getOkBlockchains(state),
    executingAccountsCronJobs: fromSettings.getExecutingAccountsCronJobs(state),
    isBalancesHidden: getIsBalancesHidden(state),
  }),
  (dispatch) => ({
    setAccountAsMain: (a: BlockchainAccount) =>
      dispatch(
        fromSettings.updateAccountAction({
          account: {
            ...a,
            main: true,
          },
        })
      ),
    showAccountModal: (a: BlockchainAccount) =>
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
    sendRChainPayment: (a: BlockchainAccount, chainId: string) => {
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
            parameters,
            chainId,
          },
          buttons: [],
        })
      );
    },
    openModal: (t: fromMain.OpenModalPayload) => {
      dispatch(fromMain.openModalAction(t));
    },
    deleteAccount: (a: BlockchainAccount) =>
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
