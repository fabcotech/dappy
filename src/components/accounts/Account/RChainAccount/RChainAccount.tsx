import React, { Fragment, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { deployBoxTerm } from 'rchain-token';

import { Account as AccountModel, Blockchain, RChainInfos } from '/models';
import * as fromSettings from '/store/settings';
import * as fromBlockchain from '/store/blockchain';
import * as fromMain from '/store/main';
import * as fromCommon from '/common';
import { State } from '/store';
import { getIsBalancesHidden } from '/store/ui';
import { LOGREV_TO_REV_RATE, RCHAIN_TOKEN_OPERATION_PHLO_LIMIT, FAKE_BALANCE } from '/CONSTANTS';
import { AccountPassword } from '/components/utils/AccountPassword';
import { RChainAccountBox } from './RChainAccountBox';
import { formatAmount } from '/utils/formatAmount';
import { copyToClipboard } from '/interProcess';
import { GlossaryHint } from '/components/utils/Hint';
import { rchainWallet } from '/utils/wallets';

import './RChainAccount.scss';
import { WalletAddress } from '/components/utils/WalletAddress';

interface AccountComponentProps {
  account: AccountModel;
  isBalancesHidden: boolean;
  blockchains: {
    [chainId: string]: Blockchain;
  };
  rchainInfos: { [chainId: string]: RChainInfos };
  namesBlockchain: Blockchain | undefined;
  showAccountModal: (a: AccountModel) => void;
  removeAccountTokenBox: (p: fromSettings.SaveAccountTokenBoxPayload) => void;
  saveAccountTokenBox: (p: fromSettings.SaveAccountTokenBoxPayload) => void;
  setViewBox: (box: { boxId: string; account: AccountModel }) => void;
  openModal: (t: fromMain.OpenModalPayload) => void;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
  setAccountAsMain: (a: AccountModel) => void;
  sendRChainPayment: (a: AccountModel, chainId: string) => void;
  deleteAccount: (a: AccountModel) => void;
}

export const RChainAccountComponent = ({
  account,
  isBalancesHidden,
  blockchains,
  rchainInfos,
  namesBlockchain,
  showAccountModal,
  removeAccountTokenBox,
  saveAccountTokenBox,
  setViewBox,
  openModal,
  sendRChainTransaction,
  setAccountAsMain,
  sendRChainPayment,
  deleteAccount,
}: AccountComponentProps) => {
  const [askPasswordForBox, setAskPasswordForBox] = useState<{ [key: string]: boolean }>({});
  const [askBoxregistryUri, setAskBoxregistryUri] = useState<{ [key: string]: boolean }>({});

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
      <div className="boxes">
        {account.boxes.length ? (
          <span>
            <b className="token-boxes">{t('token box', true)}</b>
            <GlossaryHint term={'what is a box ?'} />
          </span>
        ) : undefined}
        {account.boxes.map((b) => {
          return (
            <Fragment key={b}>
              <button
                onClick={() => {
                  setViewBox({ boxId: b, account });
                }}
                key={b}
                type="button"
                className="check-box button is-dark is-small">
                <div className="text">
                  <i className="fa fa-before fa-box"></i>
                  {b}
                </div>
              </button>
              <a className="underlined-link" onClick={() => copyToClipboard(b)}>
                <i className="fa fa-copy fa-before"></i>
                {t('copy box id')}
              </a>
              <a
                type="button"
                className="underlined-link red"
                onClick={() =>
                  removeAccountTokenBox({
                    accountName: account.name,
                    boxId: b,
                  })
                }>
                {t('remove box')}
              </a>
            </Fragment>
          );
        })}
        {account.boxes.length === 0 ? (
          <>
            {askBoxregistryUri[account.name] ? (
              <RChainAccountBox
                saveBoxId={(boxId: string) => {
                  saveAccountTokenBox({
                    accountName: account.name,
                    boxId: boxId,
                  });
                  setAskBoxregistryUri({ ...askBoxregistryUri, [account.name]: false });
                }}></RChainAccountBox>
            ) : (
              <a
                className="underlined-link"
                onClick={() => setAskBoxregistryUri({ ...askPasswordForBox, [account.name]: true })}
                type="button">
                <i className="fa fa-plus fa-before"></i>
                {t('add existing token box')}
              </a>
            )}
            {askPasswordForBox[account.name] ? (
              <div className="account-password-field field is-horizontal">
                <div className="control">
                  <AccountPassword
                    encrypted={account.encrypted}
                    decryptedPrivateKey={(privateKey) => {
                      if (!privateKey) {
                        return;
                      }
                      setAskPasswordForBox({ ...askPasswordForBox, [account.name]: false });
                      const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
                      const timestamp = new Date().valueOf();

                      const chainId = Object.keys(blockchains)[0];
                      if (!chainId) {
                        openModal({
                          title: t('failed to deploy box'),
                          text: t('at least one node network'),
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
                      if (rchainInfos && rchainInfos[chainId]) {
                        validAfterBlockNumber = rchainInfos[chainId].info.lastFinalizedBlockNumber;
                      }
                      const term = deployBoxTerm({
                        boxId: 'box' + new Date().getTime().toString().slice(7),
                        masterRegistryUri: rchainInfos[chainId].info.rchainNamesMasterRegistryUri,
                        publicKey: account.publicKey,
                      });
                      const deployOptions = rchainWallet.signTransaction(
                        {
                          term: term,
                          timestamp: timestamp,
                          phloPrice: 1,
                          phloLimit: RCHAIN_TOKEN_OPERATION_PHLO_LIMIT,
                          validAfterBlockNumber: validAfterBlockNumber,
                        },
                        privateKey
                      );
                      sendRChainTransaction({
                        transaction: deployOptions,
                        origin: { origin: 'rchain-token', operation: 'deploy-box', accountName: account.name },
                        platform: 'rchain',
                        blockchainId: chainId,
                        id: id,
                        alert: true,
                        sentAt: new Date().toISOString(),
                      });
                    }}
                  />
                </div>
              </div>
            ) : (
              <a
                className="underlined-link"
                onClick={() => setAskPasswordForBox({ ...askPasswordForBox, [account.name]: true })}
                type="button">
                <i className="fa fa-box-open fa-before"></i>
                {t('deploy a new token box')}
              </a>
            )}
          </>
        ) : undefined}
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
    rchainInfos: fromBlockchain.getRChainInfos(state),
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
