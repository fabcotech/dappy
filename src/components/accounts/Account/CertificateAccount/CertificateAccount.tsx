import React from 'react';
import { connect } from 'react-redux';

import { CertificateAccount as CertificateAccountModel } from '/models';
import { openModalAction, closeModalAction } from '/store/main';
import { copyToClipboard } from '/interProcess';

import './CertificateAccount.scss';

interface CertificateAccountProps {
  account: CertificateAccountModel;
  showAccountModal: (a: CertificateAccountModel) => void;
  deleteAccount: (a: CertificateAccountModel) => void;
}

export const CertificateAccountComponent = ({
  account,
  showAccountModal,
  deleteAccount,
}: CertificateAccountProps) => {
  return (
    <div className="cert-account box">
      <div className="header">
        <div>
          <b className="name">
            <a className="has-text-black" onClick={() => showAccountModal(account)}>
              {account.name}
            </a>
          </b>
        </div>
      </div>
      <div className="body">
        <div className="address has-text-weight-bold ">
          {t('certificate')}
          <a className="ml-3 underlined-link" onClick={() => copyToClipboard(account.certificate)}>
            <i className="fa fa-copy fa-before"></i>
            {t('copy')}
          </a>
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

export const CertificateAccount = connect(undefined, (dispatch) => ({
  showAccountModal: (account: CertificateAccountModel) =>
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
  deleteAccount: (account: CertificateAccountModel) =>
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
}))(CertificateAccountComponent);
