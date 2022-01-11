import * as React from 'react';

import * as fromBlockchain from '/store/blockchain';
import * as fromSettings from '/store/settings';
import { TransactionState, Blockchain } from '/models';
import './Transactions.scss';
import { connect } from 'react-redux';
import { TransactionsListItem } from '.';

interface RootProps {
  transactionStates: { [transactionId: string]: TransactionState };
  blockchains: {
    [chainId: string]: Blockchain;
  };
}

export class TransactionsListComponent extends React.Component<RootProps, {}> {
  state = {};

  render() {
    return (
      <div className="transactions-list">
        <table className="table is-fullwidth is-striped is-bordered is-hoverable">
          <thead>
            <tr>
              <th>{t('sent at')}</th>
              <th>{t('id (local)')}</th>
              <th>{t('network')}</th>
              <th>{t('origin')}</th>
              <th>{t('result')}</th>
              <th>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {/* todo cleaner way to display transactions in order */}
            {Object.keys(this.props.transactionStates)
              .reverse()
              .map((id) => (
                <TransactionsListItem
                  key={id}
                  blockchains={this.props.blockchains}
                  transactionState={this.props.transactionStates[id]}
                />
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export const TransactionsList = connect((state) => {
  return {
    transactionStates: fromBlockchain.getTransactions(state),
    blockchains: fromSettings.getBlockchains(state),
  };
}, undefined)(TransactionsListComponent);
