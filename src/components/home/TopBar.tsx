import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import './TopBar.scss';

import { NavigationUrl } from '/models';
import { unfocusAllTabsAction } from '/store/dapps';
import { TabsList2 } from '.';

const connector = connect(undefined, {
  unfocusAllTabs: unfocusAllTabsAction,
});

type TopBarComponentProps = {
  isNavigationInDapps: boolean;
  navigate: (navigationUrl: NavigationUrl) => void;
} & ConnectedProps<typeof connector>;

function TopBarComponent({ isNavigationInDapps, unfocusAllTabs, navigate }: TopBarComponentProps) {
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
          <button className="tb-button" onClick={unfocusAllTabs}>
            <i className="fas fa-home fa-lg" title="go to home" />
          </button>
          <TabsList2 />
        </>
      )}
    </div>
  );
}

export const TopBar = connector(TopBarComponent);
