import React, { useContext } from 'react';

import { Chip } from '../Chip';
import metamaskImage from './metamask.png';
import ledgerImage from './ledger.png';
import { ApiContext } from '../../Api';
import { Wallet } from '../../model';

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

interface WalletChipProps {
  platform: Wallet['platform'];
}

const WalletChip = ({ platform }: WalletChipProps) => {
  switch (platform) {
    case 'metamask':
      return <MetamaskChip />;
    case 'ledger':
      return <LedgerChip />;
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
      className="wallets"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <div className="label">
        <i className="fa-solid fa-lock fa-xl"></i>
      </div>
      <div
        className="value"
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
