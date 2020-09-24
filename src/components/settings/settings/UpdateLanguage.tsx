import * as React from 'react';
import { Formik, Field } from 'formik';
import { connect } from 'react-redux';
import xs from 'xstream';

import './Resolver.scss';
import * as fromUi from '../../../store/ui';
import { Language } from '../../../models';

interface UpdateLanguageProps {
  language: Language;
  updateLanguage: (a: Language) => void;
}

export class UpdateLanguageComponent extends React.Component<UpdateLanguageProps, {}> {
  state = {};

  render() {
    return (
      <div className="pb20 settings-resolver">
        <Formik
          initialValues={{ language: this.props.language }}
          onSubmit={(values, { setSubmitting }) => {
            this.props.updateLanguage(values.language);
            xs.periodic(500)
              .endWhen(xs.periodic(600).take(1))
              .subscribe({
                complete: () => setSubmitting(false),
              });
          }}
          render={({ handleSubmit, isSubmitting }) => {
            return (
              <form onSubmit={handleSubmit}>
                <h3 className="subtitle is-4">{t('language')}</h3>
                <br />
                <div className="field is-horizontal">
                  <label>{t('language')}</label>
                  <div className="select">
                    <Field component="select" name="language">
                      <option value="en">{t('english')}</option>
                      <option value="cn">{t('chinese')}</option>
                    </Field>
                  </div>
                </div>
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

export const UpdateLanguage = connect(
  state => {
    return {
      language: fromUi.getLanguage(state),
    };
  },
  dispatch => ({
    updateLanguage: (language: Language) => dispatch(fromUi.updateLanguageAction({ language: language })),
  })
)(UpdateLanguageComponent);
