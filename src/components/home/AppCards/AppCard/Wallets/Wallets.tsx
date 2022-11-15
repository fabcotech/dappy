import React, { useContext } from 'react';

import { Chip } from '../Chip';
import { ApiContext } from '../../Api';
import { Wallet } from '../../model';

import metamaskImage from './metamask.png';
import ledgerImage from './ledger.png';
import ethImage from './eth.svg';

const LedgerChip = () => (
  <Chip bgColor="#FFF">
    <img alt="metamask" width="16" src={ledgerImage} />
  </Chip>
);

const MetamaskChip = () => (
  <Chip bgColor="#333">
    <img alt="metamask" width="16" src={metamaskImage} />
  </Chip>
);

const ClientCertificateChip = () => (
  <Chip
    bgColor="#333"
    style={{
      alignSelf: 'center',
    }}
  >
    <i className="fas fa-certificate" />
  </Chip>
);

const EVMChip = () => (
  <Chip
    style={{
      alignSelf: 'center',
    }}
  >
    <img alt="evm" width="16" src={ethImage} />
  </Chip>
);

interface WalletChipProps {
  platform: Wallet['platform'];
}

const WalletChip = ({ platform }: WalletChipProps) => {
  switch (platform) {
    case 'metamask':
      return <MetamaskChip />;
    case 'ledger':
      return <LedgerChip />;
    case 'evm':
      return <EVMChip />;
    case 'certificate':
      return <ClientCertificateChip />;
    default:
      return null;
  }
};

interface WalletsProps {
  domain: string;
}

export const Wallets = ({ domain }: WalletsProps) => {
  const { getWallets } = useContext(ApiContext);
  const wallets = getWallets().filter(({ whitelist }) =>
    whitelist.find(({ host }) => (domain || '').includes(host))
  );

  if (!wallets.length) {
    return null;
  }

  return (
    <div
      className="ac-wallets"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <div className="ac-label">
        <i className="fas fa-lock fa-xl"></i>
      </div>
      <div
        className="ac-value"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        {wallets.map(({ name, platform }) => (
          <div
            key={name}
            style={{
              display: 'flex',
              alignItems: 'end',
              gap: '0.5rem',
            }}
          >
            <WalletChip platform={platform} />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};
