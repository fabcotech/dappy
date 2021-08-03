import React from 'react';

import { account as accountUtils } from '../../utils';
import './AccountPassword.scss';

interface AccountPasswordProps {
  encrypted: string;
  decryptedPrivateKey: (privateKey: string | undefined) => void;
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
      this.props.decryptedPrivateKey(undefined);
      this.setState({
        passwordError: t('wrong password'),
      });
    }
  };

  render() {
    return (
      <div className="account-password-field field is-horizontal">
        <div className="control">
          <input
            className={`input password-for-deploy-box ${this.state.passwordError ? 'is-danger' : ''}`}
            type="password"
            placeholder={t('password for account')}
            onChange={this.onTryPassword}></input>
        </div>
      </div>
    );
  }
}
