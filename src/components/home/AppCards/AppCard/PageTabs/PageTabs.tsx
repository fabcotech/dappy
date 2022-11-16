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
      className="ac-pageTabs"
      style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '5px',
      }}
    >
      {pages.map(({ active, url }, pageIndex) => (
        <div
          className={`ac-tab ${active ? 'ac-active' : ''} ${
            currentIndex === pageIndex ? 'ac-selected' : ''
          }`}
          style={{
            width: '2rem',
            height: '1.5rem',
            zIndex: currentIndex === pageIndex ? 1 : undefined,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          key={url + pageIndex}
          onMouseEnter={() => onMouseOver(pageIndex)}
        ></div>
      ))}
    </div>
  );
};
