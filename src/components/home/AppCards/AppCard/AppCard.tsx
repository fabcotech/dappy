import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';

import { PageCard } from './PageCard';
import { App } from '../model';
import { NameSystemChip } from './NameSystemChip';
import { ApiContext } from '../Api';
import { PageTabs } from './PageTabs';

interface AppHeaderProps {
  app: App;
  onClick: (e: SyntheticEvent) => void;
}

const AppHeader = ({ app, onClick }: AppHeaderProps) => {
  return (
    <div
      className="ac-header"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {app.image && (
        <div
          style={{
            background: `url(${app.image}) 50% 50% no-repeat`,
            width: '30px',
            height: 'auto',
            backgroundSize: 'cover',
            marginRight: '0.5rem',
          }}
        />
      )}
      <div
        style={{
          overflow: 'hidden',
          display: 'flex',
          flex: 1,
          alignItems: 'center',
        }}
      >
        {/* <NameSystemChip domain={app.name} /> */}
        <a
          href={app.name}
          target="_blank"
          onClick={onClick}
          style={{
            textDecoration: 'none',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          {app.name}
        </a>
      </div>
    </div>
  );
};

interface AppCardProps {
  app: App;
}

export const AppCard = ({ app }: AppCardProps) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(app.pages.length - 1);

  useEffect(() => {
    setCurrentPageIndex(app.pages.length - 1);
  }, [app.pages.length]);

  const { deletePage, createFav, openOrFocusPage } = useContext(ApiContext);

  const openPage = (e: SyntheticEvent) => {
    e.preventDefault();
    openOrFocusPage(app.pages[currentPageIndex]);
  };

  return (
    <div
      className="ac-appCard"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          marginBottom: '.5rem',
        }}
      >
        <AppHeader app={app} onClick={openPage} />
      </div>

      <PageTabs
        currentIndex={currentPageIndex}
        pages={app.pages}
        onMouseOver={(pageIndex) => {
          if (currentPageIndex !== pageIndex) {
            setCurrentPageIndex(pageIndex);
          }
        }}
      />

      {currentPageIndex < app.pages.length && (
        <PageCard
          key={app.pages[currentPageIndex].url}
          {...app.pages[currentPageIndex]}
          onClick={openPage}
          onClose={() => deletePage(app.pages[currentPageIndex])}
          onToggleFavorite={() => createFav(app.pages[currentPageIndex])}
        />
      )}
    </div>
  );
};
