import * as React from 'react';

import './Root.scss';
import { TransactionsList } from './';

interface RootProps {}

export class RootComponent extends React.Component<RootProps, {}> {
  state = {};

  render() {
    return (
      <div className="p20 transactions">
        <h3 className="subtitle is-3">{t('transaction', true)}</h3>
        <TransactionsList />
      </div>
    );
  }
}

export const Root = RootComponent;
