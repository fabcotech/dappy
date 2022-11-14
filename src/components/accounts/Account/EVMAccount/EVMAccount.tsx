import React from 'react';
import { connect } from 'react-redux';

import { BlockchainAccount } from '/models';
import { openModalAction, closeModalAction } from '/store/main';
import { updateAccountAction } from '/store/settings';
import { copyToClipboard } from '/interProcess';

import { WalletAddress } from '/components/utils/WalletAddress';

import './EVMAccount.scss';

interface EVMAccountProps {
  account: BlockchainAccount;
  showAccountModal: (a: BlockchainAccount) => void;
  setAccountAsMain: (a: BlockchainAccount) => void;
  deleteAccount: (a: BlockchainAccount) => void;
}

export const EVMAccountComponent = ({
  account,
  showAccountModal,
  deleteAccount,
  setAccountAsMain,
}: EVMAccountProps) => {
  return (
    <div className="evm-account box">
      <div className="header">
        <div>
          <b className="name">
            <a className="has-text-black" onClick={() => showAccountModal(account)}>
              {account.name}
            </a>
          </b>
        </div>

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

export const EVMAccount = connect(undefined, (dispatch) => ({
  setAccountAsMain: (a: BlockchainAccount) =>
    dispatch(
      updateAccountAction({
        account: {
          ...a,
          main: true,
        },
      })
    ),
  showAccountModal: (account: BlockchainAccount) =>
    dispatch(
      openModalAction({
        title: 'ACCOUNT_MODAL',
        text: '',
        parameters: { account },
        buttons: [
          {
            text: 'Cancel',
            classNames: 'is-light',
            action: [closeModalAction()],
          },
        ],
      })
    ),
  deleteAccount: (account: BlockchainAccount) =>
    dispatch(
      openModalAction({
        title: 'REMOVE_ACCOUNT_MODAL',
        text: '',
        parameters: {
          account,
        },
        buttons: [],
      })
    ),
}))(EVMAccountComponent);
