import * as React from 'react';
import { Formik, Field } from 'formik';
import { connect } from 'react-redux';

import './Resolver.scss';
import { State } from '/store';
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
          }}
          render={({ handleSubmit, values }) => {
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
                    <button disabled={values.language === this.props.language} type="submit" className="button is-link">
                      {t('submit')}
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
  (state: State) => {
    return {
      language: fromUi.getLanguage(state),
    };
  },
  (dispatch) => ({
    updateLanguage: (language: Language) => dispatch(fromUi.updateLanguageAction({ language: language })),
  })
)(UpdateLanguageComponent);
