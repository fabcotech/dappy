import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderWithStore } from '/testUtils';
import userEvent from '@testing-library/user-event';
import { State } from '/store';
import { initialState as SettingsInitialState } from '/store/settings';

import { makeHintComponent, GlossaryHint } from './';

describe('Hint', () => {
  const helpPage = 'https://fabco.gitbook.io/dappy-spec/specs-and-web-standards/name-system';
  it('should display link with title', () => {
    const Hint = makeHintComponent(jest.fn());
    render(<Hint link={helpPage} title={t('name system')} />);
    expect(screen.queryByTitle('name system')).toBeDefined();
  });
  it('should open link on click', () => {
    const open = jest.fn();
    const Hint = makeHintComponent(open);
    render(<Hint link={helpPage} title={t('name system')} />);
    userEvent.click(screen.getByTitle('name system'));
    expect(open).toHaveBeenCalledWith(helpPage);
  });
  it('should display glossary hint', () => {
    const state: Partial<State> = {
      settings: {
        ...SettingsInitialState,
      },
    };

    renderWithStore(<GlossaryHint term="what is rev ?" />, state);
    expect(screen.queryByTitle('token box')).toBeDefined();
  });
});
