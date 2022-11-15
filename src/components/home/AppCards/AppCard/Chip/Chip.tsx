import React, { CSSProperties, ReactChild } from 'react';

interface ChipProps {
  bgColor: string | undefined;
  children: ReactChild;
  style: CSSProperties;
}

export const Chip = ({ bgColor, children, style }: ChipProps) => (
  <div
    style={{
      padding: '2px 4px',
      marginRight: '4px',
      borderRadius: '8px',
      color: '#FFF',
      backgroundColor: bgColor,
      display: 'flex',
      ...style,
    }}
  >
    {children}
  </div>
);

Chip.defaultProps = {
  style: {},
  bgColor: undefined,
};
