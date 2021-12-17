import React, { useState } from 'react';
import { connect } from 'react-redux';

import { Account } from '/models';
import * as fromSettings from '/store/settings';
import { AccountForm } from '../utils/AccountForm';

interface AddAccountsProps {
  accounts: { [name: string]: Account };
  createAccount: (a: Account) => void;
  setTab: (a: string) => void;
}

export function AddAccountsComponent(props: AddAccountsProps) {
  const [account, setAccount] = useState<Account | undefined>(undefined);

  if (account && props.accounts[account.name]) {
    props.setTab('accounts');
  }

  return (
    <div>
      <h3 className="subtitle is-4">{t('add account')}</h3>
      <div className="message is-warning">
        <div className="message-body">{t('forgot password warning')}</div>
      </div>
      <AccountForm names={Object.keys(props.accounts)} fillAccount={setAccount} />
      <div className="field is-horizontal is-grouped pt20">
        <div className="control">
          <button
            type="submit"
            className="button is-link"
            disabled={!account}
            onClick={() => (account ? props.createAccount(account) : undefined)}>
            {t('submit')}
          </button>
        </div>
      </div>
    </div>
  );
}

export const AddAccount = connect(
  (state) => {
    return {
      accounts: fromSettings.getAccounts(state),
    };
  },
  (dispatch) => ({
    createAccount: (a: Account) => dispatch(fromSettings.createAccountAction({ account: a })),
  })
)(AddAccountsComponent);
