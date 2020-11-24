import React, { useState } from 'react';
import { connect } from 'react-redux';

import './Accounts.scss';
import { Account, Blockchain } from '../../models';
import * as fromSettings from '../../store/settings';
import * as fromMain from '../../store/main';
import * as fromCommon from '../../common';
import { AddAccount } from './AddAccount';
import { LOGREV_TO_REV_RATE } from '../../CONSTANTS';

interface AccountsProps {
  accounts: { [name: string]: Account };
  namesBlockchain: Blockchain | undefined;
  executingAccountsCronJobs: boolean;
  updateBalances: () => void;
  deleteAccount: (a: Account) => void;
  setAccountAsMain: (a: Account) => void;
  showAccountModal: (a: Account) => void;
  sendRChainPayment: (a: Account, chainId: string) => void;
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function AccountsComponent(props: AccountsProps) {
  const [tab, setTab] = useState('accounts');

  return (
    <div className="settings-accounts pb20">
      <div className="tabs is-small">
        <ul>
          <li className={tab === 'accounts' ? 'is-active' : ''}>
            <a onClick={() => setTab('accounts')}>{t('account', true)}</a>
          </li>
          <li className={tab === 'add-account' ? 'is-active' : ''}>
            <a onClick={() => setTab('add-account')}>
              {t('add account')} <i className="fa fa-plus fa-after" />
            </a>
          </li>
        </ul>
      </div>
      {tab === 'accounts' ? (
        <div>
          <h3 className="subtitle is-4"></h3>
          <p className="smaller-text" dangerouslySetInnerHTML={{ __html: t('add account paragraph') }}></p>
          <br />
          { props.executingAccountsCronJobs ?
            <button
              title={t('update balances')}
              disabled
              className="disabled button is-info is-small"
            >
              <i className="fa fa-before fa-redo rotating"></i>
              {t('update balances')}
            </button> :
            <button
              title={t('update balances')}
              className="disabled button is-info is-small"
              onClick={() => props.updateBalances()}
            >
              <i className="fa fa-before fa-redo"></i>
              {t('update balances')}
            </button>
          }
          <br />
          <br />
          <div>
            {Object.keys(props.accounts).length === 0 ? (
              <button onClick={() => setTab('add-account')} className="button is-small is-link">
                {t('add account')}
              </button>
            ) : undefined}
            {Object.keys(props.accounts).map((k) => {
              const a = props.accounts[k];
              return (
                <div key={a.name} className="account box">
                  <div className="left">
                    <b className="name" onClick={() => props.showAccountModal(a)}>
                      {a.name} {a.main ? <span className="tag is-light">{t('main')}</span> : undefined}
                      <i className="fa fa-eye" />
                    </b>
                    <span className="encrypted">{a.encrypted.slice(0, 18) + '...'}</span>
                  </div>
                  <div className="balance">
                    <span title={a.balance.toString()} className="num">
                      {formatter.format(a.balance).substr(1)}
                    </span>
                    <span className="unit">{t('rev', true)}</span>
                    <div>
                      <b className="phlo">{a.balance * LOGREV_TO_REV_RATE}</b>
                    </div>
                  </div>
                  <div className="actions">
                    {a.main ? undefined : (
                      <button
                        title="Set this account as the main account"
                        onClick={() => props.setAccountAsMain(a)}
                        className="button is-light is-small">
                        {t('set as main account')}
                      </button>
                    )}
                    {!!props.namesBlockchain ? (
                      <button
                        title="Send REVs"
                        onClick={() => props.sendRChainPayment(a, (props.namesBlockchain as Blockchain).chainId)}
                        className="button is-info is-small">
                        <i title="Tipping unavailable" className="fa fa-before fa-money-bill-wave"></i>
                        {t('send revs')}
                      </button>
                    ) : (
                      <p className="text-danger">No network found, cannot send REVs</p>
                    )}
                  </div>
                  <div className="remove">
                    <button
                      title="Remove the account forever"
                      onClick={() => props.deleteAccount(a)}
                      className="button is-danger is-small">
                      {t('remove account')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : undefined}
      {tab === 'add-account' ? <AddAccount setTab={(a: string) => setTab(a)} /> : undefined}
    </div>
  );
}

export const Accounts = connect(
  (state) => {
    return {
      accounts: fromSettings.getAccounts(state),
      namesBlockchain: fromSettings.getNamesBlockchain(state),
      executingAccountsCronJobs: fromSettings.getExecutingAccountsCronJobs(state)
    };
  },
  (dispatch) => ({
    setAccountAsMain: (a: Account) =>
      dispatch(
        fromSettings.updateAccountAction({
          account: {
            ...a,
            main: true,
          },
        })
      ),
    showAccountModal: (a: Account) =>
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
    sendRChainPayment: (a: Account, chainId: string) => {
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
    updateBalances: () => dispatch(
      fromSettings.executeAccountsCronJobsAction()
    ),
    deleteAccount: (a: Account) =>
      dispatch(
        fromMain.openModalAction({
          title: 'Remove account',
          text:
            'Are you sure you want to remove the account ' +
            a.name +
            ' ? ' +
            'The corresponding private key will not be recoverable, make sure you have saved the corresponding private key in a safe place .',
          buttons: [
            {
              text: 'Cancel',
              classNames: 'is-light',
              action: [fromMain.closeModalAction()],
            },
            {
              text: `Yes I want to delete the account ${a.name} forever`,
              classNames: 'is-link',
              action: [
                fromSettings.deleteAccountAction({
                  account: a,
                }),
                fromMain.closeModalAction(),
              ],
            },
          ],
        })
      ),
  })
)(AccountsComponent);
