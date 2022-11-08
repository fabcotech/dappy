import React, { useContext } from 'react';
// import '../styles.css';
// import '../theme.css';
import { App, Page } from './model';
import { AppCard } from './AppCard';
import { Api, ApiContext } from './Api';

interface AppCardsProps {
  groupBy: (pages: Page[]) => App[];
}

export const AppCards = ({ groupBy }: AppCardsProps) => {
  const api = useContext<Api>(ApiContext);

  return (
    <div
      className="theme-black"
      style={{
        padding: '1rem',
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '2rem',
        placeContent: 'flex-start',
      }}
    >
      {groupBy(api.getPages()).map((app) => (
        <AppCard app={app} key={app.name} />
      ))}
    </div>
  );
};
