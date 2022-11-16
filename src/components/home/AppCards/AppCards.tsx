import React, { useContext } from 'react';
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
      style={{
        padding: '1rem',
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '2rem',
        placeContent: 'flex-start',
        overflow: 'auto',
      }}
    >
      {groupBy(api.getPages()).map((app) => (
        <AppCard app={app} key={app.name} />
      ))}
    </div>
  );
};
