import React, { useContext } from 'react';

import { Account as AccountModel } from '/models';

import { RChainAccount } from './RChainAccount';
import { AccountsContext } from '../AccountsContext';

import { EVMAccount } from './EVMAccount';
interface AccountProps {
  account: AccountModel;
}

export const Account = ({ account }: AccountProps) => {
  switch (account.platform) {
    case 'rchain':
      const { setViewBox } = useContext(AccountsContext);
      return <RChainAccount account={account} setViewBox={setViewBox} />;
    case 'evm':
      return <EVMAccount account={account} />;
  }
};
