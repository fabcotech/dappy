import React, { ReactNode } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { State } from './store';

export const renderWithStore = (ui: ReactNode, reduxState: Partial<State> = {}) => {
  const store = createStore((s: any) => s, reduxState);
  return render(<Provider store={store}>{ui}</Provider>);
};
