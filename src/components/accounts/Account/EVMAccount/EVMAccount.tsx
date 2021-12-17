import React from 'react';
import { connect } from 'react-redux';

import { Account as AccountModel } from '/models';
import { openModalAction, closeModalAction } from '/store/main';
import { copyToClipboard } from '/interProcess';

import { WalletAddress } from '/components/utils/WalletAddress';

import './EVMAccount.scss';

interface EVMAccountProps {
  account: AccountModel;
  showAccountModal: (a: AccountModel) => void;
  deleteAccount: (a: AccountModel) => void;
}

export const EVMAccountComponent = ({ account, showAccountModal, deleteAccount }: EVMAccountProps) => {
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
          <a onClick={() => showAccountModal(account)} className="underlined-link">
            <i className="fa fa-before fa-eye"></i>
            {t('check account')}
          </a>
        </div>
      </div>
      <div className="body">
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
      </div>
      <div className="footer">
        <a
          title="Remove the account forever"
          onClick={() => deleteAccount(account)}
          className="remove-account underlined-link red">
          {t('remove account')}
        </a>
      </div>
    </div>
  );
};

export const EVMAccount = connect(undefined, (dispatch) => ({
  showAccountModal: (account: AccountModel) =>
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
  deleteAccount: (account: AccountModel) =>
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