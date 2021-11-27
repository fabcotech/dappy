import React from 'react';
import { render, screen } from '@testing-library/react';

import { UpdateBrowserLink } from './UpdateBrowserLink';
import { getFakeRChainInfos } from '/fakeData';

describe('UpdateBrowserLink', () => {
  it('should display update available warning', () => {
    const props = {
      clickWarning: () => {},
      light: false,
      version: '0.5.0',
      namesBlockchainInfos: getFakeRChainInfos(),
    };

    render(<UpdateBrowserLink {...props} />);

    expect(screen.queryByText('update available')).toBeTruthy();
  });

  it('should not display update available warning', () => {
    const props = {
      clickWarning: () => {},
      light: false,
      version: '0.5.1',
      namesBlockchainInfos: getFakeRChainInfos(),
    };

    render(<UpdateBrowserLink {...props} />);

    expect(screen.queryByText('update available')).toBeFalsy();
  });

  it('should display update available warning only icon', () => {
    const props = {
      clickWarning: () => {},
      light: true,
      version: '0.5.0',
      namesBlockchainInfos: getFakeRChainInfos(),
    };

    render(<UpdateBrowserLink {...props} />);

    expect(screen.queryByTitle('update available')).toBeTruthy();
  });
});
