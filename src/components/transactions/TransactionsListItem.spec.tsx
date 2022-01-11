import React from 'react';
import { render, screen } from '@testing-library/react';

import { TransactionsListItem } from './TransactionsListItem';
import { getFakeTransactionState } from '/fakeData';

describe('TransactionsListItem', () => {
  it('should works', () => {
    const state = getFakeTransactionState();
    render(
      <table>
        <tbody>
          <TransactionsListItem transactionState={state} blockchains={{}} />
        </tbody>
      </table>
    );
    expect(screen.queryByText(state.id)).toBeTruthy();
  });
});
