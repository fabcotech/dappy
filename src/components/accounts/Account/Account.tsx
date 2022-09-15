import React from 'react';

import { Account as AccountModel } from '/models';

import { RChainAccount } from './RChainAccount';

import { EVMAccount } from './EVMAccount';
interface AccountProps {
  account: AccountModel;
}

export const Account = ({ account }: AccountProps) => {
  switch (account.platform) {
    case 'rchain':
      return <RChainAccount account={account} />;
    case 'evm':
      return <EVMAccount account={account} />;
  }
};
