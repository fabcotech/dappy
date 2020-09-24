import * as React from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import xs from 'xstream';

import './Resolver.scss';
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
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            this.props.updateDevMode(values.devMode);
            xs.periodic(500)
              .endWhen(xs.periodic(600).take(1))
              .subscribe({
                complete: () => setSubmitting(false),
              });
          }}
          render={({ setFieldValue, values, handleSubmit, isSubmitting }) => {
            return (
              <form onSubmit={handleSubmit}>
                <h3 className="subtitle is-4">{t('development')}</h3>
                <p className="smaller-text">
                  {t('settings development paragraph')}
                  <br />
                  <br />
                </p>
                <br />
                <CheckBoxComponent setFieldValue={setFieldValue} values={values} name="devMode"></CheckBoxComponent>

                <div className="field is-horizontal is-grouped pt20">
                  <div className="control">
                    <button type="submit" className="button is-link" disabled={isSubmitting}>
                      {!isSubmitting && t('submit')}
                      {isSubmitting && t('submitting')}
                      {isSubmitting && <i className="fa fa-spin fa-spinner fa-after" />}
                    </button>
                  </div>
                </div>
              </form>
            );
          }}
        />
      </div>
    );
  }
}

export const Development = connect(
  state => {
    return {
      settings: fromSettings.getSettings(state),
    };
  },
  dispatch => ({
    updateDevMode: (flag: boolean) => dispatch(fromSettings.updateDevModeAction({ flag: flag })),
  })
)(DevelopmentComponent);
