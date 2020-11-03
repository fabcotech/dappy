import React, { Fragment, useState } from 'react';
import { Formik, Field } from 'formik';

import './RecordsForm.scss';
import { Record, IPServer, PartialRecord } from '../../../models';

import { IPServersComponent } from './IPServers';

interface RecordFormProps {
  validateName?: boolean;
  nameDisabled: boolean;
  records: { [key: string]: Record };
  partialRecord: PartialRecord | undefined;
  filledRecord: (t: undefined | PartialRecord) => void;
}

const CheckRadio = (props: { humanName: string; value: string; field: any; form: any }) => {
  return (
    <Fragment>
      <input
        className="is-checkradio is-record"
        value={props.value}
        name="type"
        type="radio"
        checked={props.field.value === props.value}
        onChange={() => {}}
      />
      <label
        onClick={() => {
          props.form.setFieldValue(props.field.name, props.value);
        }}>
        {props.humanName}
      </label>
    </Fragment>
  );
};

export class RecordForm extends React.Component<RecordFormProps, {}> {
  constructor(props: RecordFormProps) {
    super(props);
  }

  badgeInput: undefined | HTMLInputElement = undefined;

  state: {
    servers: IPServer[];
    settingUpIpServers: boolean;
    badge: '';
  } = {
    servers: [],
    settingUpIpServers: false,
    badge: '',
  };

  componentDidMount() {
    if (this.props.partialRecord && this.props.partialRecord.servers) {
      this.setState({
        servers: this.props.partialRecord.servers,
      });
    }
  }

  onToggleSetupIpServers = () => {
    this.setState({
      settingUpIpServers: !this.state.settingUpIpServers,
    });
  };

  onSetIpServers = (a: IPServer[]) => {
    this.setState({
      servers: a,
    });
  };

  render() {
    return (
      <Formik
        initialValues={
          this.props.partialRecord
            ? {
                ...this.props.partialRecord,
                type: this.props.partialRecord.address ? 'dapp' : 'ip',
                badges: this.props.partialRecord.badges || {},
              }
            : {
                name: '',
                address: '',
                type: 'ip',
                servers: [],
                badges: {},
              }
        }
        validate={(values) => {
          let errors: {
            name?: string;
            address?: string;
            servers?: string;
            tags?: string;
          } = {};

          const exists = this.props.records[values.name];

          if (!values.name) {
            errors.name = t('field required');
          } else if (!!exists) {
            errors.name = t('record exists');
          }

          if (!errors.name && this.props.validateName && !/^[a-z][a-z0-9]*$/.test(values.name)) {
            errors.name = t('record regexp');
          }

          if (values.type === 'ip') {
            if (!this.state.servers.length) {
              errors.servers = t('at least on ip server');
            }
          } else {
            if (!values.address) {
              errors.address = t('field required');
            }
          }

          if (Object.keys(errors).length === 0) {
            this.props.filledRecord({
              ...values,
              servers: this.state.servers,
            });
          } else {
            this.props.filledRecord(undefined);
          }

          return errors;
        }}
        onSubmit={() => {}}
        render={({ values, setFieldValue, setFieldTouched, errors, touched }) => {
          if (this.state.settingUpIpServers) {
            return (
              <div className="ip-servers-form">
                <button
                  type="button"
                  className="button back-button is-link is-small"
                  onClick={this.onToggleSetupIpServers}>
                  <i className="fa fa-arrow-left fa-before"></i>
                  {t('back')}
                </button>
                <h5 className="is-6 title">{t('setup ip servers')}</h5>
                <IPServersComponent
                  back={this.onToggleSetupIpServers}
                  setIpServers={(a: IPServer[]) => {
                    this.onSetIpServers(a);
                    setFieldTouched('servers');
                  }}
                  ipServers={this.state.servers}></IPServersComponent>
              </div>
            );
          }
          return (
            <form>
              <div className="record-form">
                <h5 className="is-6 title">{t('record')}</h5>
                <div className="field is-horizontal">
                  <label className="label">{t('name')}*</label>
                  <div className="control">
                    <Field
                      disabled={this.props.nameDisabled}
                      className="input"
                      name="name"
                      placeholder="Name"
                      type="text"
                    />
                  </div>
                </div>
                {touched.name && errors.name && <p className="text-danger">{(errors as any).name}</p>}

                <div className="field is-horizontal">
                  <label className="label">{t('application type')}*</label>
                  <div className="control">
                    <Field component={CheckRadio} humanName="IP" value="ip" name="type" />
                    <Field component={CheckRadio} humanName="Dapp" value="dapp" name="type" />
                  </div>
                </div>

                {values.type === 'ip' ? (
                  <Fragment>
                    <div className="field is-horizontal">
                      <label className="label">{t('ip server', true)}*</label>
                      <div className="control">
                        {this.state.servers.map((s) => {
                          return (
                            <div className="server-ro" key={s.ip}>
                              <span className="ip">
                                {t('ip')} : {s.ip}
                              </span>
                              <span className="host">
                                {t('host name')} : {s.host}
                              </span>
                              <span className="cert">
                                {t('certificate')} : {s.cert.substr(0, 40) + '...'}
                              </span>
                            </div>
                          );
                        })}
                        <button type="button" className="button is-link is-small" onClick={this.onToggleSetupIpServers}>
                          {t('setup ip servers')}
                        </button>
                      </div>
                    </div>
                    {errors.servers && <p className="text-danger">{(errors as any).servers}</p>}
                  </Fragment>
                ) : (
                  <Fragment>
                    <div className="field is-horizontal">
                      <label className="label">{t('blockchain address')}*</label>
                      <div className="control">
                        <Field className="input" type="text" name="address" placeholder={t('blockchain address')} />
                      </div>
                    </div>
                    {touched.address && errors.address && <p className="text-danger">{(errors as any).address}</p>}
                  </Fragment>
                )}
                <div className="field is-horizontal badges-field">
                  <label className="label">{t('reputation badges')}*</label>
                  <div className="control">
                    <p className="smaller-text">
                      Badges allow you to attest or certify third party websites on Dappy. If you add the badge "bob" to
                      your record "mysite", users who visits "bob" website will see a badge "mysite approves this site".
                    </p>
                  </div>
                </div>
                <div className="field badges-field">
                  <label></label>
                  <div className="control">
                    {Object.keys(values.badges).map((t) => (
                      <span key={t} className="tag is-dark is-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="field is-horizontal badges-field">
                  <label className="label"></label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder={'dappy'}
                      onChange={(e) => {
                        this.badgeInput = e.target;
                        this.setState({ badge: e.target.value });
                      }}
                    />
                    <button
                      onClick={() => {
                        if (this.badgeInput) {
                          this.badgeInput.value = '';
                        }
                        setFieldValue('badges', {
                          ...values.badges,
                          [this.state.badge]: '',
                        });
                      }}
                      type="button"
                      disabled={!this.state.badge}
                      className="button is-light">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </form>
          );
        }}
      />
    );
  }
}
