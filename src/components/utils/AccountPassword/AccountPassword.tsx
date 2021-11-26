import React from 'react';

import { passwordFromStringToBytes, decrypt } from '/utils/crypto';
import './AccountPassword.scss';

interface AccountPasswordProps {
  encrypted: string;
  decryptedPrivateKey: (privateKey: string | undefined) => void;
}

export class AccountPassword extends React.Component<
  AccountPasswordProps,
  { passwordError: string | undefined; success: boolean }
> {
  constructor(props: AccountPasswordProps) {
    super(props);
    this.state = {
      passwordError: undefined,
      success: false,
    };
  }

  onTryPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const password = passwordFromStringToBytes(e.currentTarget.value);
      const decrypted = decrypt(this.props.encrypted, password);
      this.setState({
        passwordError: undefined,
        success: true,
      });
      this.props.decryptedPrivateKey(decrypted);
    } catch (err) {
      this.props.decryptedPrivateKey(undefined);
      this.setState({
        passwordError: t('wrong password'),
        success: false,
      });
    }
  };

  render() {
    return (
      <input
        className={`input password-for-deploy-box ${this.state.success ? 'is-success' : ''} ${
          this.state.passwordError ? 'is-danger' : ''
        }`}
        type="password"
        placeholder={t('password for account')}
        onChange={this.onTryPassword}></input>
    );
  }
}
