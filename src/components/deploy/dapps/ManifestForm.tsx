import * as React from 'react';
import { Formik, Field } from 'formik';

import { JsLibraries, CssLibraries, PredefinedDapp } from '../../../models';
import './Deploy.scss';
import { PREDEFINED_DAPPS } from '../../../DAPPS';
import { RESSOURCES } from '../../../RESSOURCES';
import { PartialManifest } from './Deploy';
import * as fromMain from '../../../store/main';

const ERRORS: { [key: string]: string } = {
  REQUIRED: 'This field is required',
};

interface ManifestFormState {
  predefinedDapps: undefined | { [dappName: string]: PredefinedDapp };
}

interface ManifestFormProps {
  back?: () => void;
  manifest?: undefined | PartialManifest;
  filledManifestData: (t: { js: string; css: string; html: string; publickey: string }) => void;
  openModal: (t: fromMain.OpenModalPayload) => void;
}

const onDrop = (
  e: React.DragEvent<HTMLTextAreaElement>,
  setValue: (b: string) => void,
  setError: (a: string[]) => void
) => {
  e.preventDefault();
  e.stopPropagation();

  var files = e.dataTransfer.files;
  if (!files[0]) {
    setError(['Please drop a valid manifest file (manifest.base64)']);
    return;
  }
  if (files[1]) {
    setError(['Please drop only one file']);
    return;
  }

  const file = files[0];
  const dpy = file.name.endsWith('.dpy');

  var r = new FileReader();

  r.onloadend = (e) => {
    try {
      if (!e || !e.target || typeof r.result !== 'string') {
        throw new Error();
      }
      let value = r.result;
      if (dpy) {
        const dpy = atob(value);
        const json = JSON.parse(dpy);
        const splitted = json.data.split(';');
        if (!splitted[0].length) {
          throw new Error();
        }
        const htmlBase64 = splitted[0];
        const htmlFile = atob(htmlBase64);
        value = htmlFile;
      }
      setValue(value);
    } catch (e) {
      setError(['Error parsing file']);
    }
  };

  r.readAsText(file);
};

const FormTextareaComponent = (props: any) => (
  <div className="field is-horizontal">
    <label className="label">
      {props.displayName}
      <span className="label-description">{props.description}</span>
    </label>
    <div className="control">
      <Field
        className="textarea"
        component="textarea"
        name={props.name}
        onDrop={(e: React.DragEvent<HTMLTextAreaElement>) => {
          return onDrop(
            e,
            (val) => {
              props.setFieldValue(props.name, val);
              props.setFieldTouched(props.name);
            },
            (err) => {
              props.openModal({
                title: 'Parsing failed',
                buttons: [
                  {
                    text: 'Ok',
                    classNames: 'is-link',
                    action: fromMain.closeModalAction(),
                  },
                ],
                text: 'Could not parse file, make sure it is a valid html or dpy file',
              });
            }
          );
        }}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          props.setFieldValue(props.name, e.target.value);
        }}
      />
      {props.touched[props.name] && props.errors[props.name] && (
        <p className="text-danger">{ERRORS[(props.errors as any)[props.name]]}</p>
      )}
    </div>
  </div>
);

const FormPredefinedManifestComponent = (props: any) => (
  <div className="field is-horizontal">
    <label className="label">{t('predefined dapps')}</label>
    <div className="control">
      <div className="predefined-dapps">
        {Object.keys(props.predefinedDapps).map((key) => {
          return (
            <div className="fc" key={key}>
              <div
                className={`predefined-dapp fc ${props.values.predefinedDapp === key ? 'selected' : ''}`}
                onClick={(a) => {
                  const dapp = props.predefinedDapps[key];
                  if (!dapp) {
                    props.setFieldValue('predefinedDapp', undefined);
                    props.setFieldValue('img', undefined);
                    props.setFieldValue('description', undefined);
                    return;
                  }
                  props.setFieldValue('predefinedDapp', key);
                  props.setFieldValue('img', dapp.img);
                  props.setFieldValue('description', dapp.description);
                  props.setFieldValue('manifest', dapp);
                  props.setFieldValue('cssLibraries', dapp.cssLibraries);
                  props.setFieldValue('css', dapp.css);
                  props.setFieldValue('jsLibraries', dapp.jsLibraries);
                  props.setFieldValue('js', dapp.js);
                  props.setFieldValue('html', dapp.html);
                  props.setFieldTouched('html');
                }}>
                <div className={`dapp-img dapp-${PREDEFINED_DAPPS[key].img}`} />
                <span className="name">{key}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export class ManifestForm extends React.Component<ManifestFormProps, {}> {
  state: ManifestFormState = {
    predefinedDapps: undefined,
  };

  componentDidMount() {
    window.getDapps().then((response: string) => {
      let predefinedDapps: { [dappName: string]: PredefinedDapp } = JSON.parse(response);

      Object.keys(predefinedDapps).forEach((dappName: string) => {
        predefinedDapps[dappName] = {
          ...PREDEFINED_DAPPS[dappName],
          js: decodeURI(predefinedDapps[dappName].js),
          css: decodeURI(predefinedDapps[dappName].css),
          html: decodeURI(predefinedDapps[dappName].html),
        };
      });
      this.setState({
        predefinedDapps: predefinedDapps,
      });
    });
  }

  render() {
    let initialValues: {
      publickey: string;
      jsLibraries: JsLibraries[];
      cssLibraries: CssLibraries[];
      js: string;
      css: string;
      html: string;
    } = {
      publickey: '',
      jsLibraries: [],
      cssLibraries: [],
      js: '',
      css: '',
      html: '',
    };

    if (!this.state.predefinedDapps) {
      return <div></div>;
    }

    if (this.props.manifest) {
      initialValues = {
        ...initialValues,
        ...this.props.manifest,
      };
    }

    return (
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          return {};
        }}
        onSubmit={(values, { setSubmitting, setFieldValue }) => {
          setSubmitting(false);
          let dappHtml = values.html;

          values.cssLibraries.forEach((lib) => {
            const headClosesIndex = dappHtml.indexOf('</head>');
            const cssTag = `<link rel="stylesheet" type="text/css" href="${`dappyl://css/${lib}.css`}"></link>`;
            dappHtml = dappHtml.substr(0, headClosesIndex) + cssTag + dappHtml.substr(headClosesIndex);
          });

          values.jsLibraries.forEach((lib) => {
            const headClosesIndex = dappHtml.indexOf('</head>');
            const jsTag = `<script type="text/javascript" href="${`dappyl://js/${lib}.js`}"></script>`;
            dappHtml = dappHtml.substr(0, headClosesIndex) + jsTag + dappHtml.substr(headClosesIndex);
          });

          // todo Validate rpesence version/title/description
          this.props.filledManifestData({
            js: values.js,
            css: values.css,
            html: dappHtml,
            publickey: values.publickey,
          });
        }}
        render={({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          setFieldError,
        }) => {
          return (
            <form className="deploy-dapp-form" onSubmit={handleSubmit}>
              <FormPredefinedManifestComponent
                predefinedDapps={this.state.predefinedDapps}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <div className="field">
                <label className="label">
                  {t('javascript libraries')}
                  <span className="label-description">{t('javascript libraries expl')}</span>
                </label>
                <div className="select is-multiple">
                  <Field
                    multiple
                    component="select"
                    name="jsLibraries"
                    onChange={(a: React.ChangeEvent<HTMLSelectElement>) => {
                      const options: string[] = [];
                      for (var i = 0; i < a.target.length; i++) {
                        if (a.target.options[i].selected) {
                          options.push(a.target.options[i].value);
                        }
                      }
                      setFieldValue('jsLibraries', options);
                    }}>
                    {RESSOURCES.js.map((ressource) => (
                      <option key={ressource.id} value={ressource.id}>
                        {ressource.id}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <FormTextareaComponent
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                setFieldError={setFieldError}
                openModal={this.props.openModal}
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
                name="js"
                displayName={t('javascript code')}
                description={t('javascript code expl')}
              />
              <div className="field">
                <label className="label">
                  {t('css libraries')}
                  <span className="label-description">{t('css libraries expl')}</span>
                </label>
                <div className="select is-multiple">
                  <Field
                    multiple
                    component="select"
                    name="cssLibraries"
                    onChange={(a: React.ChangeEvent<HTMLSelectElement>) => {
                      const options: string[] = [];
                      for (var i = 0; i < a.target.length; i++) {
                        if (a.target.options[i].selected) {
                          options.push(a.target.options[i].value);
                        }
                      }
                      setFieldValue('cssLibraries', options);
                    }}>
                    {RESSOURCES.css.map((ressource) => (
                      <option key={ressource.id} value={ressource.id}>
                        {ressource.id}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <FormTextareaComponent
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                setFieldError={setFieldError}
                openModal={this.props.openModal}
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
                name="css"
                displayName={t('css code')}
                description={t('css code expl')}
              />
              <FormTextareaComponent
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                setFieldError={setFieldError}
                openModal={this.props.openModal}
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
                name="html"
                displayName={t('html code')}
                description={t('html code expl')}
              />
              {touched.html &&
                errors.html &&
                (errors.html as string[]).map((e) => (
                  <p key={e} className="text-danger">
                    {e}
                  </p>
                ))}
              <div className="field is-horizontal is-grouped pt20">
                <div className="control">
                  <button
                    type="submit"
                    className="button is-link"
                    disabled={!touched.html || isSubmitting || Object.keys(errors).length > 0}>
                    {t('next')}
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
