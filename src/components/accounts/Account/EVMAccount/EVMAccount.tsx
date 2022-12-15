import React, { useState } from 'react';
import { connect } from 'react-redux';

import { BlockchainAccount, EvmNetworks, evmNetworks } from '/models';
import { openModalAction, closeModalAction } from '/store/main';
import { updateAccountAction } from '/store/settings';
import { copyToClipboard } from '/interProcess';
import { ChangeLinkedChainId } from './ChangeLinkedChainId';
import { WalletAddress } from '/components/utils/WalletAddress';

import './EVMAccount.scss';

interface EVMAccountProps {
  account: BlockchainAccount;
  showAccountModal: (a: BlockchainAccount) => void;
  setAccountAsMain: (a: BlockchainAccount) => void;
  setAccountChainId: (a: BlockchainAccount) => void;
  deleteAccount: (a: BlockchainAccount) => void;
}

export const EVMAccountComponent = ({
  account,
  showAccountModal,
  deleteAccount,
  setAccountChainId,
}: EVMAccountProps) => {
  const [changeChainIdMode, setChangeChainIdMode] = useState(false);

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
            <i className="fas fa-eye mr-1"></i>
            {t('check account')}
          </a>
        </div>
      </div>
      <div className="body"></div>
      <div className="footer">
        <div className="address-block">
          <div className="address has-text-weight-bold ">
            {t('address')}
            <a className="ml-3 underlined-link" onClick={() => copyToClipboard(account.address)}>
              <i className="mr-1 fas fa-copy"></i>
              {t('copy')}
            </a>
          </div>
          <WalletAddress address={account.address} />
        </div>
        <div className="bottom-actions">
          <a
            title="Remove the account forever"
            onClick={() => deleteAccount(account)}
            className="remove-account underlined-link red"
          >
            {t('remove account')}
          </a>
        </div>
      </div>
      <div className="link-network">
        {changeChainIdMode && (
          <ChangeLinkedChainId
            setChainId={(chainId: keyof EvmNetworks | undefined) => {
              setChangeChainIdMode(false);
              setAccountChainId({
                ...account,
                chainId,
              });
            }}
          ></ChangeLinkedChainId>
        )}

        {!changeChainIdMode && account.chainId && (
          <div className="linked-network">
            <a
              onClick={(e) => {
                e.preventDefault();
                setChangeChainIdMode(true);
              }}
              href="#"
            >
              <img className="mr-1" src={evmNetworks[account.chainId][1]}></img>
              {evmNetworks[account.chainId][0]}
            </a>
          </div>
        )}
        {!changeChainIdMode && !account.chainId && (
          <a
            onClick={(e) => {
              e.preventDefault();
              setChangeChainIdMode(true);
            }}
            href="#"
          >
            No network linked
          </a>
        )}
      </div>
    </div>
  );
};

export const EVMAccount = connect(undefined, (dispatch) => ({
  setAccountChainId: (a: BlockchainAccount) =>
    dispatch(
      updateAccountAction({
        account: {
          ...a,
        },
      })
    ),
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
