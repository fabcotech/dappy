import React from 'react';

import { NavigationUrl } from '/models';
import './TopBar.scss';

import { TabsList2 } from '.';

interface TopBarComponentProps {
  isNavigationInDapps: boolean;
  navigate: (navigationUrl: NavigationUrl) => void;
}

function TopBarComponent({ isNavigationInDapps, navigate }: TopBarComponentProps) {
  return (
    <div
      style={{
        paddingLeft: '5px',
        display: 'flex',
        height: '38px',
        gridColumn: 'span 2',
      }}
    >
      <button
        type="button"
        className="tb-button"
        onClick={() => {
          if (isNavigationInDapps) {
            navigate('/settings');
          } else {
            navigate('/');
          }
        }}
      >
        {isNavigationInDapps ? (
          <i className="fas fa-wrench fa-lg" title="settings" />
        ) : (
          <i className="fas fa-caret-square-left fa-lg" title="back to navigation" />
        )}
      </button>
      {isNavigationInDapps && (
        <>
          <button className="tb-button">
            <i className="fas fa-home fa-lg" title="go to home" />
          </button>
          <TabsList2 />
        </>
      )}
    </div>
  );
}

export const TopBar = TopBarComponent;
