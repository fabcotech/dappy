import React from 'react';

import './BadgeAppreciation.scss';

export const BadgeAppreciation = (props: { appreciation: string }) => {
  let text = props.appreciation;
  let Icon = () => <i className="fas fa-check"></i>;
  if (props.appreciation.startsWith('BS')) {
    text = text.slice(2);
  } else if (props.appreciation.startsWith('BW')) {
    Icon = () => <i className="fas fa-exclamation-triangle"></i>;
    text = text.slice(2);
  } else if (props.appreciation.startsWith('BD')) {
    Icon = () => <i className="fas fa-times"></i>;
    text = text.slice(2);
  }
  return (
    <span className="badge-appreciation">
      <Icon />
      <span>{text}</span>
    </span>
  );
};
