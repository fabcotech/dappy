import React from 'react';

import './Root.scss';
import { TransactionsList } from '.';

export function Root() {
  return (
    <div className="p20 transactions">
      <h3 className="subtitle is-3">{t('transaction', true)}</h3>
      <TransactionsList />
    </div>
  );
}
