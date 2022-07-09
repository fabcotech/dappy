import * as React from 'react';

import * as fromSettings from '/store/settings';

import { Account, NavigationUrl } from '/models';
import './Root.scss';
import { connect } from 'react-redux';
import { copyToClipboard } from '/interProcess';
import { updateAccountAction } from '/store/settings';


interface RootProps {
  accounts: { [key: string]: Account };
  navigationUrl: NavigationUrl;
  updateAccount: (a: Account) => void;
  navigate: (navigationUrl: NavigationUrl) => void;
}

export class RootComponent extends React.Component<RootProps, {}> {
  state: {
    whitelists: { [key: string]: Account["whitelist"] }
    errors: { [key: string]: string }
  } = {
    whitelists: {},
    errors: {}
  };

  render() {
    return (
      <div className="p20 auth">
        <h3 className="subtitle is-3">{t('menu auth')}</h3>
        <p className="limited-width mb-2">
          Safe authentication protects you and the web services you interact with from phishing. Authentication will use asymetric cryptography instead of passwords.
          <br/><br/>
          Simply provide a list of trusted hosts for each one of your account.
        </p>
        {
          Object.keys(this.props.accounts).map(a => {
            return <React.Fragment key={a} >
              <br />
              <h4 className="title is-4">Account {a}</h4>
              <div className="field">
                <label className="label">
                  Public key {' '}
                  <b>{this.props.accounts[a].publicKey.slice(0,100)}</b>
                  <a
                    type="button"
                    className="underlined-link"
                    onClick={() => copyToClipboard(this.props.accounts[a].publicKey)}>
                    <i className="fa fa-copy fa-before fa-after"></i>
                    {t('copy public key')}
                  </a>
                </label>
                <div className="control">
                  <textarea
                    className={`textarea ${!!this.state.errors[a] ? 'with-error' : ''}`}
                    rows={8}
                    placeholder={`hello.d\nonlinewebservice.d\nbitconnect.d`}
                    defaultValue={this.props.accounts[a].whitelist.map(a => a.host).join('\n')}
                    onChange={(e) => {
                      try {
                        const splitByLine = e.target.value.split('\n').filter(a => !!a);
                        const validLines = splitByLine.filter(a => {
                          return /^(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])$/g.test(a)
                        })
                        if (validLines.length === splitByLine.length) {
                          this.setState({
                            errors: {
                              ...this.state.errors,
                              [a]: undefined
                            },
                            whitelists: {
                              ...this.state.whitelists,
                              [a]: validLines.map(a => {
                                return { host: a, blitz: true, transactions: true }
                              }),
                            }
                          });
                        } else {
                          this.setState({
                            errors: {
                              ...this.state.errors,
                              [a]: 'Invalid lines, please provide only valid hosts ex: hello.d'
                            },
                            whitelists: {
                              ...this.state.whitelists,
                              [a]: this.props.accounts[a].whitelist
                            }
                          });
                        }
                      } catch (err) {
                        this.setState({
                          errors: {
                            [a]: 'Unable to parse'
                          },
                          whitelists: {
                            ...this.state.whitelists,
                            [a]: this.props.accounts[a].whitelist
                          }
                        });
                        return;
                      }
                    }}></textarea>
                    {
                      this.state.errors[a] &&
                      <p className="text-danger">{this.state.errors[a]}</p>
                    }
                </div>
              </div>
            </React.Fragment>
          })
        }
        <div className="field is-horizontal is-grouped pt20">
          <div className="control">
            <button
              type="submit"
              className="button is-link is-medium"
              disabled={Object.keys(this.state.errors).filter(e => !!this.state.errors[e]).length > 0}
              onClick={() => {
                Object.keys(this.props.accounts).forEach(a => {
                  if (this.state.whitelists[a]) {
                    this.props.updateAccount({
                      ...this.props.accounts[a],
                      whitelist: this.state.whitelists[a]
                    })
                  }
                })
              }}>
              {t('save safe authentication lists')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export const Root = connect(
  (state) => ({
    accounts: fromSettings.getRChainAccounts(state),
  }),
  (dispatch) => ({
    updateAccount: (a: Account) =>
      dispatch(
        updateAccountAction({
          account: a,
        })
      ),
  })
)(RootComponent);
