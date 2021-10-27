import * as React from 'react';
import { Formik, Field } from 'formik';
import { connect } from 'react-redux';
import xs from 'xstream';

import './Resolver.scss';
import * as fromSettings from '../../../store/settings';

const AUTO_RESOLVER_ABSOLUTE = 3;

interface ResolverProps {
  settings: fromSettings.Settings;
  updateResolverSettingsAction: (a: fromSettings.Settings) => void;
}

const FormResolverComponent = (props: any) => (
  <div className="field is-horizontal">
    <label className="label">Resolver</label>
    <div className="control">
      <input
        className="is-checkradio is-link"
        type="radio"
        checked={props.values.resolver === 'auto'}
        onChange={() => {}}
      />
      <label
        onClick={() => {
          props.setFieldValue('resolver', 'auto');
        }}>
        Auto
      </label>
      <input
        className="is-checkradio is-link"
        type="radio"
        checked={props.values.resolver === 'custom'}
        onChange={() => {}}
      />
      <label
        onClick={() => {
          props.setFieldValue('resolver', 'custom');
        }}>
        Custom
      </label>
    </div>
  </div>
);

const ResolverAutoComponent = () => (
  <div>
    <div className="field is-horizontal">
      <label className="label">{t('number of nodes')}</label>
      <div className="control">
        <Field className="input" disabled value={AUTO_RESOLVER_ABSOLUTE} type="number" />
      </div>
    </div>
    <div className="field is-horizontal with-addons">
      <label className="label">{t('accuracy')}</label>
      <div className="control">
        <Field className="input" disabled type="number" name="resolverAccuracy" placeholder="Accuracy" />
      </div>
      <p className="control">
        <a className="button is-static">%</a>
      </p>
    </div>
  </div>
);

const ResolveAbsoluteComponent = (a: any) => (
  <div>
    <div className="field is-horizontal">
      <label className="label">{t('number of nodes')}</label>
      <div className="control">
        <Field
          className={`input ${a.touched.resolverAbsolute && a.errors.resolverAbsolute && 'is-danger'}`}
          type="number"
          name="resolverAbsolute"
          placeholder={t('number of nodes')}
          min={0}
          max={10}
        />
      </div>
    </div>
    {a.touched.resolverAccuracy && a.errors.resolverAccuracy && (
      <p className="text-danger">{a.errors.resolverAccuracy}</p>
    )}
    <div className="field is-horizontal with-addons">
      <label className="label">{t('accuracy')}</label>
      <div className="control">
        <Field
          className={`input ${a.touched.resolverAccuracy && a.errors.resolverAccuracy && 'is-danger'}`}
          type="number"
          name="resolverAccuracy"
          placeholder={t('accuracy')}
          min={51}
          max={100}
        />
      </div>
      <p className="control">
        <a className="button is-static">%</a>
      </p>
    </div>
    {a.touched.resolverAccuracy && a.errors.resolverAccuracy && (
      <p className="text-danger">{a.errors.resolverAccuracy}</p>
    )}
  </div>
);

export class ResolverComponent extends React.Component<ResolverProps, {}> {
  state = {};

  render() {
    return (
      <div className="settings-resolver">
        <Formik
          initialValues={this.props.settings}
          validate={(values) => {
            // same as above, but feel free to move this into a class method now.
            let errors: {
              resolver?: string;
              resolverMode?: string;
              resolverAccuracy?: string;
              resolverAbsolute?: string;
            } = {};
            if (values.resolver === 'auto') {
              return errors;
            }
            if (values.resolver === 'custom') {
              if (typeof values.resolverMode !== 'string') {
                errors.resolverMode = t('field required');
              }

              // absolute
              if (values.resolverMode === 'absolute') {
                if (typeof values.resolverAbsolute !== 'number') {
                  errors.resolverAbsolute = t('field required');
                } else if (values.resolverAbsolute < 1 || values.resolverAbsolute > 10) {
                  errors.resolverAbsolute = t('value must between 1 and 10');
                }

                if (typeof values.resolverAccuracy !== 'number') {
                  errors.resolverAccuracy = t('field required');
                } else if (values.resolverAccuracy < 51 || values.resolverAccuracy > 100) {
                  errors.resolverAccuracy = t('value must between 51 and 100');
                }

                return errors;
              }
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            if (values.resolver === 'auto') {
              values.resolverAbsolute = AUTO_RESOLVER_ABSOLUTE;
              values.resolverAccuracy = 100;
            }
            this.props.updateResolverSettingsAction(values);
            xs.periodic(500)
              .endWhen(xs.periodic(600).take(1))
              .subscribe({
                complete: () => setSubmitting(false),
              });
          }}
          render={({ values, errors, touched, setFieldValue, handleSubmit, isSubmitting }) => (
            <form className="limited-width" onSubmit={handleSubmit}>
              <h3 className="subtitle is-4">{t('network')}</h3>
              <p className="limited-width" dangerouslySetInnerHTML={{ __html: t('settings network paragraph') }}></p>

              <br />
              <FormResolverComponent values={values} setFieldValue={setFieldValue} />

              {values.resolver === 'auto' && <ResolverAutoComponent />}

              {/*
            Resolver === 'custom'
          */}
              {values.resolver === 'custom' && values.resolverMode === 'absolute' && (
                <ResolveAbsoluteComponent touched={touched} errors={errors} />
              )}

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
          )}
        />
      </div>
    );
  }
}

export const Resolver = connect(
  (state) => {
    return {
      settings: fromSettings.getSettings(state),
    };
  },
  (dispatch) => ({
    updateResolverSettingsAction: (settings: fromSettings.Settings) =>
      dispatch(fromSettings.updateResolverSettingsAction(settings)),
  })
)(ResolverComponent);
