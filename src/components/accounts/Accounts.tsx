import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { boxTerm } from 'rchain-token';

import './Accounts.scss';
import { Account, Blockchain, RChainInfos } from '../../models';
import * as fromSettings from '../../store/settings';
import * as fromBlockchain from '../../store/blockchain';
import * as fromMain from '../../store/main';
import * as fromCommon from '../../common';
import { blockchain as blockchainUtils } from '../../utils/blockchain';
import { AddAccount } from './AddAccount';
import { LOGREV_TO_REV_RATE, RCHAIN_TOKEN_OPERATION_PHLO_LIMIT } from '../../CONSTANTS';
import { AccountPassword } from './AccountPassword';
import { AccountBox } from './AccountBox';
import { ViewBox } from './ViewBox';

interface AccountsProps {
  accounts: { [name: string]: Account };
  blockchains: {
    [chainId: string]: Blockchain;
  };
  rchainInfos: { [chainId: string]: RChainInfos };
  namesBlockchain: Blockchain | undefined;
  executingAccountsCronJobs: boolean;
  updateBalances: () => void;
  deleteAccount: (a: Account) => void;
  saveAccountTokenBox: (p: fromSettings.SaveAccountTokenBoxPayload) => void;
  removeAccountTokenBox: (p: fromSettings.SaveAccountTokenBoxPayload) => void;
  setAccountAsMain: (a: Account) => void;
  showAccountModal: (a: Account) => void;
  sendRChainPayment: (a: Account, chainId: string) => void;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
  openModal: (t: fromMain.OpenModalPayload) => void;
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function AccountsComponent(props: AccountsProps) {
  const [tab, setTab] = useState('accounts');
  const [viewBox, setViewBox] = useState<undefined | string>(undefined);
  const [transactionAired, setTransactionAired] = useState<boolean>(false);
  const [askPasswordForBox, setAskPasswordForBox] = useState<{ [key: string]: boolean }>({});
  const [askBoxregistryUri, setAskBoxregistryUri] = useState<{ [key: string]: boolean }>({});

  if (typeof viewBox === 'string') {
    return (
      <ViewBox
        back={() => setViewBox(undefined)}
        namesBlockchain={props.namesBlockchain}
        boxRegistryUri={viewBox}></ViewBox>
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
          <p className="smaller-text" dangerouslySetInnerHTML={{ __html: t('add account paragraph') }}></p>
          <br />
          {props.executingAccountsCronJobs ? (
            <button title={t('update balances')} disabled className="disabled button is-info is-small">
              <i className="fa fa-before fa-redo rotating"></i>
              {t('update balances')}
            </button>
          ) : (
            <button
              title={t('update balances')}
              className="disabled button is-info is-small"
              onClick={() => props.updateBalances()}>
              <i className="fa fa-before fa-redo"></i>
              {t('update balances')}
            </button>
          )}
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
                <div key={k} className="account box">
                  <div className="left">
                    <b className="name" onClick={() => props.showAccountModal(a)}>
                      {a.name} {a.main ? <span className="tag is-light">{t('main')}</span> : undefined}
                      <i className="fa fa-eye" />
                    </b>
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
                  <div className="boxes">
                    {a.boxes.length ? <b className="token-boxes">Token boxes</b> : undefined}
                    {a.boxes.map((b) => {
                      return (
                        <Fragment key={b}>
                          <button
                            onClick={() => {
                              setViewBox(b);
                            }}
                            key={b}
                            type="button"
                            className="check-box button is-white is-small">
                            <div className="text">
                              <i className="fa fa-before fa-box"></i>
                              {b}
                            </div>
                          </button>
                          <a
                            type="button"
                            className="button is-white is-small"
                            onClick={() => window.copyToClipboard(b)}>
                            copy box address
                            <i className="fa fa-copy fa-after"></i>
                          </a>
                          <a
                            type="button"
                            className="button is-danger is-small"
                            onClick={() =>
                              props.removeAccountTokenBox({
                                accountName: k,
                                registryUri: b,
                              })
                            }>
                            remove box
                          </a>
                        </Fragment>
                      );
                    })}
                    {a.boxes.length === 0 ? (
                      <>
                        {askBoxregistryUri[a.name] ? (
                          <AccountBox
                            saveBoxRegistryUri={(registryUri) => {
                              props.saveAccountTokenBox({
                                accountName: k,
                                registryUri: registryUri,
                              });
                              setAskBoxregistryUri({ ...askBoxregistryUri, [a.name]: false });
                            }}></AccountBox>
                        ) : (
                          <button
                            onClick={() => setAskBoxregistryUri({ ...askPasswordForBox, [a.name]: true })}
                            type="button"
                            className="button is-light is-small">
                            <i className="fa fa-plus fa-before"></i>
                            Add an existing token box
                          </button>
                        )}
                        {askPasswordForBox[a.name] ? (
                          <AccountPassword
                            encrypted={a.encrypted}
                            decryptedPrivateKey={(privateKey) => {
                              setAskPasswordForBox({ ...askPasswordForBox, [a.name]: false });
                              const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
                              const timestamp = new Date().valueOf();

                              const chainId = Object.keys(props.blockchains)[0];
                              if (!chainId) {
                                props.openModal({
                                  title: 'Failed to deploy box',
                                  text: `You need to be connected to a blockchain with at least one endpoint available`,
                                  buttons: [
                                    {
                                      classNames: 'is-link',
                                      text: 'Ok',
                                      action: fromMain.closeModalAction(),
                                    },
                                  ],
                                });
                                return;
                              }

                              let validAfterBlockNumber = 0;
                              if (props.rchainInfos && props.rchainInfos[chainId]) {
                                validAfterBlockNumber = props.rchainInfos[chainId].info.lastFinalizedBlockNumber;
                              }
                              const term = boxTerm({ publicKey: a.publicKey });
                              const deployOptions = blockchainUtils.rchain.getDeployOptions(
                                timestamp,
                                term,
                                privateKey,
                                a.publicKey,
                                1,
                                RCHAIN_TOKEN_OPERATION_PHLO_LIMIT,
                                validAfterBlockNumber
                              );
                              props.sendRChainTransaction({
                                transaction: deployOptions,
                                origin: { origin: 'rchain-token', operation: 'deploy-box', accountName: a.name },
                                platform: 'rchain',
                                blockchainId: chainId,
                                id: id,
                                alert: true,
                                sentAt: new Date().toISOString(),
                              });
                            }}
                          />
                        ) : (
                          <button
                            onClick={() => setAskPasswordForBox({ ...askPasswordForBox, [a.name]: true })}
                            type="button"
                            className="button is-light is-small">
                            <i className="fa fa-box-open fa-before"></i>
                            Deploy a new token box
                          </button>
                        )}
                      </>
                    ) : undefined}
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
                  <button
                    title="Remove the account forever"
                    onClick={() => props.deleteAccount(a)}
                    className="remove-account button is-danger is-small">
                    {t('remove account')}
                  </button>
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
      blockchains: fromSettings.getOkBlockchains(state),
      rchainInfos: fromBlockchain.getRChainInfos(state),
      accounts: fromSettings.getAccounts(state),
      namesBlockchain: fromSettings.getNamesBlockchain(state),
      executingAccountsCronJobs: fromSettings.getExecutingAccountsCronJobs(state),
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
    updateBalances: () => dispatch(fromSettings.executeAccountsCronJobsAction()),
    saveAccountTokenBox: (p: fromSettings.SaveAccountTokenBoxPayload) => {
      dispatch(fromSettings.saveAccountTokenBoxAction(p));
    },
    removeAccountTokenBox: (p: fromSettings.SaveAccountTokenBoxPayload) => {
      dispatch(fromSettings.removeAccountTokenBoxAction(p));
    },
    openModal: (t: fromMain.OpenModalPayload) => {
      dispatch(fromMain.openModalAction(t));
    },
    sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => {
      dispatch(fromBlockchain.sendRChainTransactionAction(t));
    },
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
