import React, { useState } from 'react';
import { connect } from 'react-redux';

import { Account } from './Account';
import { Account as AccountModel, Blockchain, CertificateAccount } from '/models';
import * as fromSettings from '/store/settings';
import { State } from '/store';
import { getIsBalancesHidden, toggleBalanceVisibility } from '/store/ui';
import { AddAccount } from './AddAccount';

import image_rchain from '/images/rchain40.png';

import './Accounts.scss';
import { AccountWhitelist } from './AccountWhitelist';

export const UpdateBalancesButton = ({
  updating,
  updateBalances,
  disabled,
}: {
  updating: boolean;
  disabled: boolean;
  updateBalances: () => void;
}) => {
  if (updating) {
    return (
      <a title={t('update balances')} className="disabled underlined-link">
        <i className="fas fa-redo rotating mr-1"></i>
        {t('update balances')}
      </a>
    );
  }

  return (
    <a
      title={t('update balances')}
      className={`${disabled ? 'disabled' : ''} underlined-link`}
      onClick={() => {
        if (!disabled) {
          updateBalances();
        }
      }}
    >
      <i className="fas fa-redo mr-1"></i>
      {t('update balances')}
    </a>
  );
};

export const HideBalancesButton = ({
  isBalancesHidden,
  toggleBalancesVisibility,
}: {
  isBalancesHidden: boolean;
  toggleBalancesVisibility: () => void;
}) => {
  return (
    <a
      title={t(`${isBalancesHidden ? 'show' : 'hide'} balances`)}
      className="underlined-link ml-2"
      onClick={toggleBalancesVisibility}
    >
      <i
        data-testid="hbb-icon"
        className={`mr-1 fas fa-eye${isBalancesHidden ? '' : '-slash'}`}
      ></i>
      {isBalancesHidden ? t('show balances') : t('hide balances')}
    </a>
  );
};

interface RChainAccountsProps {
  accounts: Record<string, AccountModel>;
  updateWhitelist: (accountName: string) => void;
}

export const RChainAccounts = ({ accounts, updateWhitelist }: RChainAccountsProps) => {
  if (!Object.values(accounts).filter((a) => a.platform === 'rchain').length) return null;
  return (
    <div className="mb-4">
      <div className="block">
        <h4 className="is-size-4 mb-2">RChain</h4>
        <div className="logos mb-4">
          <img src={image_rchain} title="rchain" />
        </div>
        <div className="account-cards">
          {Object.values(accounts)
            .filter((a) => a.platform === 'rchain')
            .map((account) => (
              <Account key={account.name} account={account} updateWhitelist={updateWhitelist} />
            ))}
        </div>
      </div>
    </div>
  );
};

interface EVMAccountsProps {
  accounts: Record<string, AccountModel>;
  updateWhitelist: (accountName: string) => void;
}

export const EVMAccounts = ({ accounts, updateWhitelist }: EVMAccountsProps) => {
  if (!Object.values(accounts).filter((a) => a.platform === 'evm').length) return null;
  return (
    <div className="block">
      <h4 className="is-size-4 mb-2">Ethereum / EVM</h4>
      <div className="account-cards">
        {Object.values(accounts)
          .filter((a) => a.platform === 'evm')
          .map((account) => (
            <Account key={account.name} account={account} updateWhitelist={updateWhitelist} />
          ))}
      </div>
    </div>
  );
};

interface CertificateAccountsProps {
  accounts: Record<string, CertificateAccount>;
  updateWhitelist: (accountName: string) => void;
}

export const CertificateAccounts = ({ accounts, updateWhitelist }: CertificateAccountsProps) => {
  if (Object.values(accounts).length === 0) return null;
  return (
    <div className="block">
      <h4 className="is-size-4 mb-2">Certificates</h4>
      <div className="account-cards">
        {Object.values(accounts).map((account) => (
          <Account key={account.name} account={account} updateWhitelist={updateWhitelist} />
        ))}
      </div>
    </div>
  );
};

interface AccountsProps {
  accounts: { [name: string]: AccountModel };
  certificateAccounts: Record<string, CertificateAccount>;
  namesBlockchain: Blockchain | undefined;
  executingAccountsCronJobs: boolean;
  isBalancesHidden: boolean;
  updateBalances: () => void;
  toggleBalancesVisibility: () => void;
}

export function AccountsComponent(props: AccountsProps) {
  const [tab, setTab] = useState('accounts');
  const [accountName, setAccountName] = useState<string | undefined>(undefined);

  return (
    <div className="settings-accounts pb20 accounts">
      <div className="tabs is-small">
        <ul>
          <li className={tab === 'accounts' ? 'is-active' : ''}>
            <a onClick={() => setTab('accounts')}>{t('account', true)}</a>
          </li>
          <li className={tab === 'add-account' ? 'is-active' : ''}>
            <a onClick={() => setTab('add-account')}>
              {t('add account')} <i className="ml-2 fas fa-plus" />
            </a>
          </li>
        </ul>
      </div>
      {tab === 'whitelist' ? (
        <AccountWhitelist
          account={props.accounts[accountName as string]}
          back={() => {
            setAccountName(undefined);
            setTab('accounts');
          }}
        ></AccountWhitelist>
      ) : null}
      {tab === 'accounts' ? (
        <div>
          <h3 className="subtitle is-4"></h3>
          <p
            className="limited-width text-mid"
            dangerouslySetInnerHTML={{ __html: t('add account paragraph') }}
          ></p>

          <div className="mt-3">
            <CertificateAccounts
              accounts={props.certificateAccounts}
              updateWhitelist={(an: string) => {
                console.log('an', an);
                setAccountName(an);
                setTab('whitelist');
              }}
            />
          </div>
          <div className="my-3">
            <UpdateBalancesButton
              disabled={Object.keys(props.accounts).length === 0}
              updating={props.executingAccountsCronJobs}
              updateBalances={props.updateBalances}
            />
            <HideBalancesButton
              isBalancesHidden={props.isBalancesHidden}
              toggleBalancesVisibility={props.toggleBalancesVisibility}
            />
          </div>
          <RChainAccounts
            accounts={props.accounts}
            updateWhitelist={(an: string) => {
              setAccountName(an);
              setTab('whitelist');
            }}
          />
          <EVMAccounts
            accounts={props.accounts}
            updateWhitelist={(an: string) => {
              console.log(an);
              setAccountName(an);
              setTab('whitelist');
            }}
          />
        </div>
      ) : undefined}
      {tab === 'add-account' ? <AddAccount setTab={(a: string) => setTab(a)} /> : undefined}
    </div>
  );
}

export const Accounts = connect(
  (state: State) => ({
    accounts: fromSettings.getAccounts(state),
    certificateAccounts: fromSettings.getCertificateAccounts(state),
    namesBlockchain: fromSettings.getNamesBlockchain(state),
    executingAccountsCronJobs: fromSettings.getExecutingAccountsCronJobs(state),
    isBalancesHidden: getIsBalancesHidden(state),
  }),
  (dispatch) => ({
    updateBalances: () => null,
    toggleBalancesVisibility: () => dispatch(toggleBalanceVisibility()),
  })
)(AccountsComponent);
