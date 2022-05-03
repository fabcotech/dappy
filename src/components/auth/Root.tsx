import * as React from 'react';

import * as fromSettings from '/store/settings';

import { Account, NavigationUrl } from '/models';
import './Root.scss';
import { connect } from 'react-redux';
import { copyToClipboard } from '/interProcess';


interface RootProps {
  accounts: { [key: string]: Account };
  navigationUrl: NavigationUrl;
  navigate: (navigationUrl: NavigationUrl) => void;
}

export class RootComponent extends React.Component<RootProps, {}> {
  state: {
    hosts: { [key: string]: string }
  } = {
    hosts: {}
  };

  render() {
    return (
      <div className="p20 auth">
        <h3 className="subtitle is-3">{t('menu auth')}</h3>
        <p className="limited-width mb-2">
          Safe authentication protects you and the web services you interact with from phishing.
          <br/><br/>
          Simply provide a list of trusted hosts for each one of your account.
        </p>
        {
          Object.keys(this.props.accounts).map(a => {
            return <>
              <br />
              <h4 className="title is-4">Account {a}</h4>
              <div className="field">
                <label className="label">
                  Public key {' '}
                  <b>{this.props.accounts[a].publicKey}</b>
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
                    className="textarea"
                    rows={16}
                    placeholder={`https://hello.dappy\nonlinewebservice.dappy\nbitconnect.dappy`}
                    value={this.state.hosts && this.state.hosts[a] ? this.state.hosts[a] : ""}
                    onChange={(e) => {
                      this.setState({
                        hosts: {
                          ...this.state.hosts,
                          [a]: e.target.value
                        }
                      });
                    }}></textarea>
                </div>
              </div>
            </>
          })
        }
      </div>
    );
  }
}

export const Root = connect(
  (state) => ({
    accounts: fromSettings.getRChainAccounts(state),
  }),
  () => ({})
)(RootComponent);
