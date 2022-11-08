import React, { ReactChild } from 'react';

interface ChipProps {
  bgColor: string;
  children: ReactChild;
}

export const Chip = ({ bgColor, children }: ChipProps) => (
  <div
    style={{
      padding: '2px 4px',
      marginRight: '4px',
      borderRadius: '8px',
      color: '#FFF',
      backgroundColor: bgColor,
      display: 'flex',
    }}
  >
    {children}
  </div>
);
