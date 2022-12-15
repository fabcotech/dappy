import * as React from 'react';

import { Account } from '/models';
import './Root.scss';
import { connect } from 'react-redux';
import { updateAccountAction } from '/store/settings';
import { validateWhitelistDomain } from '/utils/validateWhitelistDomain';

interface AccountWhitelistProps {
  account: Account;
  updateAccount: (a: Account) => void;
  back: () => void;
}

export class AccountWhitelistComponent extends React.Component<AccountWhitelistProps, unknown> {
  state: {
    whitelist: Account['whitelist'] | undefined;
    error: string | undefined;
  } = {
    whitelist: undefined,
    error: undefined,
  };

  render() {
    return (
      <div className="auth">
        <a
          href="#"
          className="underlined-link"
          onClick={(e) => {
            e.preventDefault();
            this.props.back();
          }}
        >
          {t('back to wallets')}
        </a>
        <br />
        <br />
        <h3 className="subtitle is-4">
          {t('auth title')} ({this.props.account.name})
        </h3>
        <p className="text-mid limited-width mb-2">
          {t('auth 1')}
          <br />
          <br />
          {t('auth 2')}
        </p>

        <div className="field">
          <div className="control">
            <textarea
              className={`textarea ${this.state.error ? 'with-error' : ''}`}
              rows={8}
              placeholder="bitconnect.d`"
              defaultValue={this.props.account.whitelist.map((b) => b.host).join('\n')}
              onChange={(e) => {
                try {
                  const splitByLine = e.target.value.split('\n').filter((b) => !!b);
                  const validLines = splitByLine.filter(validateWhitelistDomain);
                  if (validLines.length === splitByLine.length) {
                    this.setState({
                      error: undefined,
                      whitelist: validLines.map((b) => {
                        return { host: b, blitz: true, transactions: true };
                      }),
                    });
                  } else {
                    this.setState({
                      error: 'Invalid lines, please provide only valid hosts ex: hello.d',
                      whitelist: this.props.account.whitelist,
                    });
                  }
                } catch (err) {
                  this.setState({
                    error: 'Unable to parse',
                    whitelist: this.props.account.whitelist,
                  });
                }
              }}
            ></textarea>
            {this.state.error && <p className="text-danger">{this.state.error}</p>}
          </div>
        </div>

        <div className="field is-horizontal is-grouped pt20">
          <div className="control">
            <button
              type="submit"
              className="button is-link is-medium"
              disabled={!!this.state.error}
              onClick={() => {
                this.props.updateAccount({
                  ...this.props.account,
                  whitelist: this.state.whitelist || [],
                });
              }}
            >
              {t('save auth')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export const AccountWhitelist = connect(
  (state) => ({}),
  (dispatch) => ({
    updateAccount: (a: Account) =>
      dispatch(
        updateAccountAction({
          account: a,
        })
      ),
  })
)(AccountWhitelistComponent);
