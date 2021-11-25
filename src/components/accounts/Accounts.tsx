import React, { useState } from 'react';
import { connect } from 'react-redux';

import { Account } from './Account';
import { Account as AccountModel, Blockchain, RChainInfos } from '/models';
import * as fromSettings from '/store/settings';
import * as fromBlockchain from '/store/blockchain';
import { State } from '/store';
import { getIsBalancesHidden, toggleBalanceVisibility } from '/store/ui';
import { AddAccount } from './AddAccount';
import { ViewBox } from './ViewBox';

export const UpdateBalancesButton = ({ updating, updateBalances }: { updating: boolean; updateBalances: () => void }) =>
  updating ? (
    <a title={t('update balances')} className="disabled underlined-link">
      <i className="fa fa-before fa-redo rotating"></i>
      {t('update balances')}
    </a>
  ) : (
    <a title={t('update balances')} className="underlined-link" onClick={() => updateBalances()}>
      <i className="fa fa-before fa-redo"></i>
      {t('update balances')}
    </a>
  );

export const HideBalancesButton = ({
  isBalancesHidden,
  toggleBalancesVisibility,
}: {
  isBalancesHidden: boolean;
  toggleBalancesVisibility: () => void;
}) => (
  <a
    title={t(`${isBalancesHidden ? 'show' : 'hide'} balances`)}
    className="underlined-link ml-2"
    onClick={toggleBalancesVisibility}>
    <i data-testid="hbb-icon" className={`fa fa-before fa-eye${isBalancesHidden ? '' : '-slash'}`}></i>
    {t(`${isBalancesHidden ? 'show' : 'hide'} balances`)}
  </a>
);

interface AccountsProps {
  accounts: { [name: string]: AccountModel };
  rchainInfos: { [chainId: string]: RChainInfos };
  namesBlockchain: Blockchain | undefined;
  executingAccountsCronJobs: boolean;
  isBalancesHidden: boolean;
  updateBalances: () => void;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
  toggleBalancesVisibility: () => void;
}

export function AccountsComponent(props: AccountsProps) {
  const [tab, setTab] = useState('accounts');
  const [viewBox, setViewBox] = useState<undefined | { boxId: string; account: AccountModel }>(undefined);

  if (typeof viewBox !== 'undefined') {
    // todo make sure rchaininfo exists
    return (
      <ViewBox
        back={() => setViewBox(undefined)}
        namesBlockchain={props.namesBlockchain}
        rchainInfos={props.rchainInfos[(props.namesBlockchain as Blockchain).chainId] as RChainInfos}
        boxId={viewBox.boxId}
        account={viewBox.account}
        sendRChainTransaction={props.sendRChainTransaction}></ViewBox>
    );
  }

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
          <p className="limited-width mw42rem" dangerouslySetInnerHTML={{ __html: t('add account paragraph') }}></p>
          <div className="my-3">
            <UpdateBalancesButton updating={props.executingAccountsCronJobs} updateBalances={props.updateBalances} />
            <HideBalancesButton
              isBalancesHidden={props.isBalancesHidden}
              toggleBalancesVisibility={props.toggleBalancesVisibility}
            />
          </div>
          <div>
            {Object.keys(props.accounts).length === 0 ? (
              <button onClick={() => setTab('add-account')} className="button is-link">
                {t('add account')}
                <i className="fa fa-plus fa-after"></i>
              </button>
            ) : undefined}
            {Object.values(props.accounts).map((account) => (
              <Account key={account.name} account={account} setViewBox={setViewBox} />
            ))}
          </div>
        </div>
      ) : undefined}
      {tab === 'add-account' ? <AddAccount setTab={(a: string) => setTab(a)} /> : undefined}
    </div>
  );
}

export const Accounts = connect(
  (state: State) => ({
    accounts: fromSettings.getAccounts(state),
    rchainInfos: fromBlockchain.getRChainInfos(state),
    namesBlockchain: fromSettings.getNamesBlockchain(state),
    executingAccountsCronJobs: fromSettings.getExecutingAccountsCronJobs(state),
    isBalancesHidden: getIsBalancesHidden(state),
  }),
  (dispatch) => ({
    updateBalances: () => dispatch(fromSettings.executeAccountsCronJobsAction()),
    sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => {
      dispatch(fromBlockchain.sendRChainTransactionAction(t));
    },
    toggleBalancesVisibility: () => dispatch(toggleBalanceVisibility()),
  })
)(AccountsComponent);
