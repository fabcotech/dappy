import * as React from 'react';
import { connect } from 'react-redux';
import { Deploy } from './';

import * as fromSettings from '../../../store/settings';
import * as fromBlockchain from '../../../store/blockchain';
import * as fromMain from '../../../store/main';
import * as fromUi from '../../../store/ui';
import { Blockchain, TransactionState, Account, RChainInfos } from '../../../models';
import './SettingsDapps.scss';

interface SettingsDappsProps {
  namesBlockchain: undefined | Blockchain;
  transactions: { [id: string]: TransactionState };
  rchainInfos: { [chainId: string]: RChainInfos };
  accounts: { [accountName: string]: Account };
  sendRChainTransactionWithFile: (t: fromBlockchain.SendRChainTransactionWithFilePayload) => void;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
  openModal: (t: fromMain.OpenModalPayload) => void;
  navigate: (t: fromUi.NavigatePayload) => void;
}

export function SettingsDappsComponent(props: SettingsDappsProps) {
  return (
    <div className="pb20 settings-dapps">
      <Deploy
        accounts={props.accounts}
        sendRChainTransactionWithFile={props.sendRChainTransactionWithFile}
        sendRChainTransaction={props.sendRChainTransaction}
        transactions={props.transactions}
        rchainInfos={props.rchainInfos}
        namesBlockchain={props.namesBlockchain}
        openModal={props.openModal}
        navigate={props.navigate}
      />
    </div>
  );
}

export const SettingsDapps = connect(
  (state) => {
    return {
      namesBlockchain: fromSettings.getNamesBlockchain(state),
      transactions: fromBlockchain.getTransactions(state),
      rchainInfos: fromBlockchain.getRChainInfos(state),
      accounts: fromSettings.getAccounts(state),
    };
  },
  (dispatch) => ({
    sendRChainTransactionWithFile: (t: fromBlockchain.SendRChainTransactionWithFilePayload) => {
      dispatch(
        fromBlockchain.sendRChainTransactionWithFileAction({
          ...t,
          alert: false,
        })
      );
    },
    sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => {
      dispatch(fromBlockchain.sendRChainTransactionAction(t));
    },
    openModal: (t: fromMain.OpenModalPayload) => {
      dispatch(fromMain.openModalAction(t));
    },
    navigate: (t: fromUi.NavigatePayload) => {
      dispatch(fromUi.navigateAction(t));
    },
  })
)(SettingsDappsComponent);
