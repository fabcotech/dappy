import React from 'react';

import { account as accountUtils } from '../../utils';
import './AccountPassword.scss';

interface AccountPasswordProps {
  encrypted: string;
  decryptedPrivateKey: (privateKey: string) => void;
}

export class AccountPassword extends React.Component<AccountPasswordProps, { passwordError: string | undefined }> {
  constructor(props: AccountPasswordProps) {
    super(props);
    this.state = {
      passwordError: undefined,
    };
  }

  onTryPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const password = accountUtils.passwordFromStringToBytes(e.currentTarget.value);
      const decrypted = accountUtils.decrypt(this.props.encrypted, password);
      this.setState({
        passwordError: undefined,
      });
      this.props.decryptedPrivateKey(decrypted);
    } catch (err) {
      this.setState({
        passwordError: t('wrong password'),
      });
    }
  };

  render() {
    return (
      <div>
        <div className="field is-horizontal">
          <div className="control">
            <input
              className={`input ${this.state.passwordError ? 'is-danger' : ''}`}
              type="password"
              placeholder="Password for account"
              onChange={this.onTryPassword}></input>
          </div>
        </div>
      </div>
    );
  }
}
