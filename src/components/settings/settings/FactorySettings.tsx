import * as React from 'react';
import { connect } from 'react-redux';

import * as fromSettings from '../../../store/settings';

interface FactorySettingsProps {
  settings: fromSettings.Settings;
  updateDevMode: (a: boolean) => void;
}

export class FactorySettingsComponent extends React.Component<FactorySettingsProps, {}> {
  state = {};

  render() {
    return <div></div>;
  }
}

export const FactorySettings = connect(
  (state) => {
    return {
      settings: fromSettings.getSettings(state),
    };
  },
  (dispatch) => ({
    updateDevMode: (flag: boolean) => dispatch(fromSettings.updateDevModeAction({ flag: flag })),
  })
)(FactorySettingsComponent);
