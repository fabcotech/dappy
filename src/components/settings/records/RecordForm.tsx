import React, { Fragment } from 'react';
import { Formik, Field } from 'formik';

import './RecordsForm.scss';
import { Record, IPServer, RChainInfo, PartialRecord, Blockchain } from '../../../models';
import { BadgeAppreciation } from '../../utils/BadgeAppreciation';
import { IPServersComponent } from './IPServers';

interface RecordFormProps {
  validateName?: boolean;
  nameDisabledAndForced: undefined | string;
  records: { [key: string]: Record };
  partialRecord: PartialRecord | undefined;
  special?: RChainInfo['special'];
  namesBlockchain?: Blockchain;
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
  badgeAppreciationInput: undefined | HTMLInputElement = undefined;
  initValidate: boolean = false;

  state: {
    special: boolean;
    servers: IPServer[];
    settingUpIpServers: boolean;
    badge: string;
    badgeAppreciation: string;
    badgeAppreciationPrefix: 'BS' | 'BW' | 'BD';
    availables: { [key: string]: boolean };
  } = {
    special: false,
    servers: [],
    settingUpIpServers: false,
    badge: '',
    badgeAppreciation: '',
    badgeAppreciationPrefix: 'BS',
    availables: {},
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
                badges: this.props.partialRecord.badges || ({} as { [key: string]: string }),
                names: [this.props.partialRecord.name],
              }
            : {
                names: this.props.nameDisabledAndForced ? [this.props.nameDisabledAndForced] : [''],
                address: '',
                type: 'dapp',
                servers: [],
                badges: {} as { [key: string]: string },
              }
        }
        validate={(values) => {
          let errors: {
            name?: string;
            names: string[];
            address?: string;
            servers?: string;
            tags?: string;
          } = {
            names: [],
          };

          if (this.state.special) {
            [0, 1, 2, 3].forEach((i) => {
              if (!values.names[i]) {
                errors.names[i] = t('field required');
              } else if (this.props.validateName && !/^[a-z][a-z0-9]*$/.test(values.names[i])) {
                errors.names[i] = t('record regexp');
              } else if (values.names[i].length < 1 || values.names[i].length > 24) {
                errors.names[i] = t('record length');
              } else if ([0, 1, 2, 3].filter((j) => values.names[j] === values.names[i]).length > 1) {
                errors.names[i] = 'This name is duplicate';
              }
            });
          } else {
            if (!values.names[0]) {
              errors.names[0] = t('field required');
            } else if (this.props.validateName && !/^[a-z][a-z0-9]*$/.test(values.names[0])) {
              errors.names[0] = t('record regexp');
            } else if (values.names[0].length < 1 || values.names[0].length > 24) {
              errors.names[i] = t('record length');
            }

            if (values.type === 'ip') {
              if (!this.state.servers.length) {
                errors.servers = t('at least on ip server');
              }
            }
          }

          if (Object.keys(errors).length === 1 && errors.names.length === 0) {
            if (this.state.special && this.props.special) {
              this.props.filledRecord({
                servers: this.state.servers,
                name: [this.props.special.name].concat(values.names).join(','),
                address: values.address,
                badges: values.badges,
              });
            } else {
              this.props.filledRecord({
                servers: this.state.servers,
                name: values.names[0],
                address: values.address,
                badges: values.badges,
              });
            }
          } else {
            this.props.filledRecord(undefined);
          }

          // will be used by the async function
          return errors;
        }}
        onSubmit={() => {}}
        render={({ validateForm, values, setFieldValue, setFieldTouched, errors, touched }) => {
          if (this.initValidate === false) {
            this.initValidate = true;
            validateForm();
          }
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

          const SpecialComponent = (p: { special: RChainInfo['special']; setSpecial: (a: boolean) => void }) => {
            if (p.special) {
              return (
                <p className="special-offer text-blue">
                  <i className="fa fa-before fa-gifts"></i>
                  Special offer going on, get 4 names for the price of one{' '}
                  {this.state.special ? (
                    <span className="activate" onClick={() => p.setSpecial(false)}>
                      cancel
                    </span>
                  ) : (
                    <span className="activate" onClick={() => p.setSpecial(true)}>
                      activate offer
                    </span>
                  )}
                  <span className="small">
                    {p.special.max - p.special.current} names still available out of {p.special.max}
                  </span>
                </p>
              );
            }

            return <span></span>;
          };

          // special is available and activated
          if (this.state.special) {
            return (
              <form>
                <div className="record-form">
                  <h5 className="is-6 title">{t('record')}</h5>
                  <div className="field is-horizontal">
                    <label className="label">{t('name')}*</label>

                    <div className="control">
                      {[0, 1, 2, 3].map((i) => {
                        return (
                          <Fragment key={i}>
                            <Field
                              className="input name-input"
                              type="text"
                              name={`names.${i}`}
                              placeholder={`name ${i}`}
                            />
                            {touched.names && touched.names[i] && errors.names && errors.names[i] && (
                              <p className="text-danger name-error no-padding">{(errors as any).names[i]}</p>
                            )}
                          </Fragment>
                        );
                      })}
                      <SpecialComponent
                        special={this.props.special}
                        setSpecial={(a) => this.setState({ special: a })}
                      />
                    </div>
                  </div>
                </div>
              </form>
            );
          }

          // special is not activated or not available
          return (
            <form>
              <div className="record-form">
                <h5 className="is-6 title">{t('record')}</h5>
                <div className="field is-horizontal">
                  <label className="label">{t('name')}*</label>
                  <div className="control">
                    {this.props.nameDisabledAndForced ? (
                      <input
                        className="input name-input"
                        disabled
                        value={this.props.nameDisabledAndForced}
                        defaultValue={this.props.nameDisabledAndForced}></input>
                    ) : (
                      <Field className="input" type="text" name={`names.0`} placeholder={`name`} />
                    )}
                  </div>
                </div>
                {touched.names && touched.names[0] && errors.names && errors.names[0] && (
                  <p className="text-danger">{(errors as any).names[0]}</p>
                )}
                <div className="field is-horizontal">
                  <label className="label"></label>
                  <div className="control">
                    <SpecialComponent special={this.props.special} setSpecial={(a) => this.setState({ special: a })} />
                  </div>
                </div>
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
                      Badges allow you to attest, certify or discredit other websites on dappy. If you add the badge
                      "bob" to your record "mysite", users who visits "bob" website will see a certification or
                      discredit badge from "mysite".
                    </p>
                  </div>
                </div>
                <div className="field badges-field">
                  <label></label>
                  <div>
                    {Object.keys(values.badges).map((t) => (
                      <div key={t} className="badge-line">
                        <div>
                          <u>{t}</u>
                        </div>
                        <BadgeAppreciation appreciation={values.badges[t]} />
                        <u
                          className="remove-badge"
                          onClick={() => {
                            const newBadges = { ...values.badges };
                            delete newBadges[t];
                            setFieldValue('badges', newBadges);
                          }}>
                          remove
                        </u>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field is-horizontal badges-field">
                  <label className="label"></label>
                  <div className="control">
                    <input
                      className="input badge-input"
                      type="text"
                      placeholder={'dappy'}
                      onChange={(e) => {
                        this.badgeInput = e.target;
                        this.setState({ badge: e.target.value });
                      }}
                    />
                    <div
                      className="badge-appreciation fc"
                      onClick={() => {
                        this.setState({
                          badgeAppreciationPrefix: { BS: 'BW', BW: 'BD', BD: 'BS' }[this.state.badgeAppreciationPrefix],
                        });
                      }}>
                      {
                        {
                          BS: <i className="fa fa-check"></i>,
                          BW: <i className="fa fa-exclamation-triangle"></i>,
                          BD: <i className="fa fa-times"></i>,
                        }[this.state.badgeAppreciationPrefix]
                      }
                    </div>
                    <input
                      className="input badge-appreciation-input"
                      type="text"
                      placeholder={'recommended and endorsed'}
                      onChange={(e) => {
                        this.badgeAppreciationInput = e.target;
                        this.setState({ badgeAppreciation: e.target.value });
                      }}
                    />
                    <button
                      onClick={() => {
                        if (this.badgeInput) {
                          this.badgeInput.value = '';
                        }
                        if (this.badgeAppreciationInput) {
                          this.badgeAppreciationInput.value = '';
                        }
                        setFieldValue('badges', {
                          ...values.badges,
                          [this.state.badge]: this.state.badgeAppreciationPrefix + this.state.badgeAppreciation,
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
