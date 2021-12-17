import React from 'react';

import './WalletAddress.scss';

interface WalletAddress {
  address: string;
}

export const WalletAddress = ({ address }: WalletAddress) => (
  <div className="wallet-address">
    <span>{address.substring(0, 10)}</span>
    <span>{Array(6).fill('.').join('')}</span>
    <span>{address.substring(address.length - 10)}</span>
  </div>
);
