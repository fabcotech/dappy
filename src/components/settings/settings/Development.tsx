import * as React from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';

import * as fromSettings from '../../../store/settings';

interface DevelopmentProps {
  settings: fromSettings.Settings;
  updateDevMode: (a: boolean) => void;
}

const CheckBoxComponent = (props: any) => {
  return (
    <div className="field is-horizontal">
      <div className="control">
        <input
          className="is-checkradio is-link is-inverted"
          id="exampleCheckbox"
          type="checkbox"
          onChange={() => {}}
          checked={props.values[props.name]}
        />
        <label onClick={() => props.setFieldValue(props.name, !props.values[props.name])}>
          {t('development mode')}
        </label>
      </div>
    </div>
  );
};

export class DevelopmentComponent extends React.Component<DevelopmentProps, {}> {
  state = {};

  render() {
    return (
      <div className="pb20 settings-resolver">
        <Formik
          initialValues={{ devMode: this.props.settings.devMode }}
          onSubmit={(values) => {}}
          render={({ setFieldValue, values }) => {
            return (
              <form className="limited-width">
                <h3 className="subtitle is-4">{t('development')}</h3>
                <p className="text-mid limited-width">
                  {t('settings development paragraph')}
                  <br />
                  <br />
                </p>
                <br />
                <CheckBoxComponent
                  setFieldValue={(key: string, value: boolean) => {
                    setFieldValue(key, value);
                    this.props.updateDevMode(value);
                  }}
                  values={values}
                  name="devMode"></CheckBoxComponent>
              </form>
            );
          }}
        />
      </div>
    );
  }
}

export const Development = connect(
  (state) => {
    return {
      settings: fromSettings.getSettings(state),
    };
  },
  (dispatch) => ({
    updateDevMode: (flag: boolean) => dispatch(fromSettings.updateDevModeAction({ flag: flag })),
  })
)(DevelopmentComponent);
