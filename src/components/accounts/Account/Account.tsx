import React from 'react';

import { Account as AccountModel } from '/models';

import { RChainAccount } from './RChainAccount';
import { EVMAccount } from './EVMAccount';
import { CertificateAccount } from './CertificateAccount';

interface AccountProps {
  account: AccountModel;
}

export const Account = ({ account }: AccountProps) => {
  switch (account.platform) {
    case 'rchain':
      return <RChainAccount account={account} />;
    case 'evm':
      return <EVMAccount account={account} />;
    case 'certificate':
      return <CertificateAccount account={account} />;
    default:
      return null;
  }
};
