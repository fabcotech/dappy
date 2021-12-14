import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
  it.skip('should display glossary hint', () => {
    render(<GlossaryHint term="what is rev ?" />);
    expect(screen.queryByTitle('token box')).toBeDefined();
  });
});
