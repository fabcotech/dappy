import * as React from 'react';

import { NavigationUrl } from '/models';
import { getWhitelistArgument, parseWhitelist } from '/CONSTANTS';
import './Root.scss';
import { connect } from 'react-redux';
import { validateWhitelistDomain } from '/utils/validateWhitelistDomain';
import * as fromUi from '/store/ui';

interface RootProps {
  whitelist: fromUi.State['whitelist'];
  navigationUrl: NavigationUrl;
  updateWhitelist: (a: fromUi.State['whitelist']) => void;
  navigate: (navigationUrl: NavigationUrl) => void;
}

export class RootComponent extends React.Component<RootProps> {
  state: {
    whitelist: fromUi.State['whitelist'];
    error: undefined | string;
  } = {
    whitelist: [],
    error: undefined,
  };

  harcodedWhitelist: undefined | fromUi.State['whitelist'];

  componentDidMount() {
    this.harcodedWhitelist = parseWhitelist(getWhitelistArgument(window.location.search));
    this.setState({
      whitelist: this.harcodedWhitelist || this.props.whitelist,
    });
  }

  render() {
    return (
      <div className="p20 whitelist">
        <h3 className="subtitle is-3">{t('whitelist title')}</h3>
        {!this.harcodedWhitelist && (
          <p className="text-mid limited-width mb-2">{t('whitelist 1')}</p>
        )}
        <div className="field">
          <label className="label">{t('whitelist of domains')}</label>
          <div className="control">
            <textarea
              disabled={!!this.harcodedWhitelist}
              className={`textarea ${this.state.error ? 'with-error' : ''}`}
              rows={8}
              placeholder="bitconnect.d"
              defaultValue={this.state.whitelist.map((a) => a.host).join('\n')}
              onChange={(e) => {
                try {
                  const splitByLine = e.target.value.split('\n').filter((a) => !!a);
                  const validLines = splitByLine.filter(validateWhitelistDomain);
                  if (validLines.length === splitByLine.length) {
                    this.setState({
                      error: undefined,
                      whitelist: validLines.map((a) => {
                        return { host: a, topLevel: true, secondLevel: true };
                      }),
                    });
                  } else {
                    this.setState({
                      error: 'Invalid lines, please provide only valid hosts ex: hello.d',
                      whitelists: this.props.whitelist,
                    });
                  }
                } catch (err) {
                  this.setState({
                    error: 'Unable to parse',
                    whitelist: this.props.whitelist,
                  });
                }
              }}
            ></textarea>
            {this.state.error && <p className="text-danger">{this.state.error}</p>}
          </div>
        </div>
        {!this.harcodedWhitelist && (
          <div className="field is-horizontal is-grouped pt20">
            <div className="control">
              <button
                type="submit"
                className="button is-link is-medium"
                disabled={!!this.harcodedWhitelist || !!this.state.error}
                onClick={() => {
                  if (this.state.whitelist) {
                    this.props.updateWhitelist(this.state.whitelist);
                  }
                }}
              >
                {t('save whitelist')}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export const Root = connect(
  (state) => ({
    whitelist: fromUi.getWhitelist(state),
  }),
  (dispatch) => ({
    updateWhitelist: (a: fromUi.State['whitelist']) =>
      dispatch(
        fromUi.updateWhitelistAction({
          whitelist: a,
        })
      ),
  })
)(RootComponent);
