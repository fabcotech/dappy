import React, { Fragment } from 'react';
import { Formik, Field } from 'formik';

import { Variables, Variable } from '/models';

interface VariablesFormProps {
  back?: () => void;
  variables: Variables;
  filledVariablesData: (variablesWithValues: Variables) => void;
}

const ERRORS: { [key: string]: string } = {
  REQUIRED: 'This field is required',
};

export class VariablesForm extends React.Component<VariablesFormProps, {}> {
  constructor(props: VariablesFormProps) {
    super(props);
  }

  render() {
    const initialValues: { [key: string]: string } = {};
    this.props.variables.js.forEach(v => {
      initialValues[`js-${v.name}`] = v.value || v.default;
    });
    this.props.variables.css.forEach(v => {
      initialValues[`cs-${v.name}`] = v.value || v.default;
    });
    this.props.variables.html.forEach(v => {
      initialValues[`ht-${v.name}`] = v.value || v.default;
    });
    return (
      <Formik
        initialValues={initialValues}
        validate={values => {
          let errors: {} = {};

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          let variablesWithValues: Variables = { js: [], css: [], html: [] };
          Object.keys(values).forEach(key => {
            let lang = key.slice(0, 2);
            if (lang === 'cs') {
              lang = 'css';
            } else if (lang === 'ht') {
              lang = 'html';
            }
            const name = key.slice(3);

            if (lang === 'js') {
              variablesWithValues.js.push({
                ...(this.props.variables.js.find((va: Variable) => {
                  return va.name === name;
                }) as Variable),
                value: values[key],
              });
            } else if (lang === 'css') {
              variablesWithValues.css.push({
                ...(this.props.variables.css.find((va: Variable) => {
                  return va.name === name;
                }) as Variable),
                value: values[key],
              });
            } else {
              variablesWithValues.html.push({
                ...(this.props.variables.html.find((va: Variable) => {
                  return va.name === name;
                }) as Variable),
                value: values[key],
              });
            }

            setSubmitting(false);
            this.props.filledVariablesData(variablesWithValues);
          });
        }}
        render={({ values, errors, touched, resetForm, handleSubmit, isSubmitting }) => {
          return (
            <form className="transaction-form" onSubmit={handleSubmit}>
              <p>
                The dapp developer has left some assets variables to be filled, please carefully fill assets variables.
              </p>
              {this.props.variables.js.length ? (
                <Fragment>
                  <br />
                  <h5 className="is-6 title">Javascript variables</h5>
                  {this.props.variables.js.map((v, i) => {
                    return (
                      <Fragment key={v.name + i}>
                        <div className="field is-horizontal">
                          <label className="label">{v.name}</label>
                          <div className="control">
                            <Field className="input" type="text" name={`js-${v.name}`} placeholder={v.default} />
                          </div>
                        </div>
                        {touched[`js-${v.name}`] && errors[`js-${v.name}`] && (
                          <p className="text-danger">{ERRORS[(errors as any)[`js-${v.name}`]]}</p>
                        )}
                      </Fragment>
                    );
                  })}
                </Fragment>
              ) : (
                undefined
              )}
              {this.props.variables.css.length ? (
                <Fragment>
                  <br />
                  <h5 className="is-6 title">CSS variables</h5>
                  {this.props.variables.css.map((v, i) => {
                    return (
                      <Fragment key={v.name + i}>
                        <div className="field is-horizontal">
                          <label className="label">{v.name}</label>
                          <div className="control">
                            <Field className="input" type="text" name={`cs-${v.name}`} placeholder={v.default} />
                          </div>
                        </div>
                        {touched[`cs-${v.name}`] && errors[`cs-${v.name}`] && (
                          <p className="text-danger">{ERRORS[(errors as any)[`cs-${v.name}`]]}</p>
                        )}
                      </Fragment>
                    );
                  })}
                </Fragment>
              ) : (
                undefined
              )}
              {this.props.variables.html.length ? (
                <Fragment>
                  <br />
                  <h5 className="is-6 title">HTML variables</h5>
                  {this.props.variables.html.map((v, i) => {
                    return (
                      <Fragment key={v.name + i}>
                        <div className="field is-horizontal">
                          <label className="label">{v.name}</label>
                          <div className="control">
                            <Field className="input" type="text" name={`ht-${v.name}`} placeholder={v.default} />
                          </div>
                        </div>
                        {touched[`ht-${v.name}`] && errors[`ht-${v.name}`] && (
                          <p className="text-danger">{ERRORS[(errors as any)[`ht-${v.name}`]]}</p>
                        )}
                      </Fragment>
                    );
                  })}
                </Fragment>
              ) : (
                undefined
              )}
              <div className="field is-horizontal is-grouped pt20">
                <div className="control">
                  {this.props.back ? (
                    <button type="button" className="button is-light" onClick={this.props.back}>
                      Back
                    </button>
                  ) : (
                    undefined
                  )}{' '}
                  <button
                    type="submit"
                    className="button is-link"
                    disabled={isSubmitting || Object.keys(errors).length > 0}>
                    Next
                  </button>
                </div>
              </div>
            </form>
          );
        }}
      />
    );
  }
}
