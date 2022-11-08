import React from 'react';

import { Page } from '../../model';

interface PageBarProps {
  pages: Page[];
  currentIndex: number;
  onMouseOver: (index: number) => void;
}

export const PageTabs = ({ pages, onMouseOver, currentIndex }: PageBarProps) => {
  return (
    <div
      className="pageTabs"
      style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '-2px',
        marginLeft: '5px',
      }}
    >
      {pages.map(({ favorite, url }, pageIndex) => (
        <div
          className={`tab ${favorite ? 'favorite' : 'active'} ${
            currentIndex === pageIndex ? 'selected' : ''
          }`}
          style={{
            width: '2rem',
            height: '1.5rem',
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem',
            zIndex: currentIndex === pageIndex ? 1 : undefined,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          key={url}
          onMouseEnter={() => onMouseOver(pageIndex)}
        >
          {favorite && <i className="fa-solid fa-circle fa-2xs"></i>}
        </div>
      ))}
    </div>
  );
};
