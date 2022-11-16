import {
  initialState,
  updateShowAccountCreationAtStartupReducer,
  showAccountCreationAtStartup,
  State,
  toggleBalanceVisibilityReducer,
} from './reducer';
import { updateShowAccountCreationAtStartup, toggleBalanceVisibility } from './actions';

import { getIsBalancesHidden } from '.';

describe('reducer ui', () => {
  it('should update show account creation form', () => {
    const state: State = JSON.parse(JSON.stringify(initialState));
    const newState = updateShowAccountCreationAtStartupReducer(
      updateShowAccountCreationAtStartup({ show: true }),
      state
    );
    expect(
      showAccountCreationAtStartup({
        ui: newState,
      })
    ).toBeTruthy();
  });

  it('should toggle balance visibility', () => {
    const state: State = JSON.parse(JSON.stringify(initialState));
    const newState = toggleBalanceVisibilityReducer(state);
    expect(
      getIsBalancesHidden({
        ui: newState,
      })
    ).toBeTruthy();
  });
});
