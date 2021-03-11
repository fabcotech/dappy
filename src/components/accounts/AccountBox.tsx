import React from 'react';

import './AccountBox.scss';

interface AccountBoxProps {
  saveBoxRegistryUri: (regstryUri: string) => void;
}

export class AccountBox extends React.Component<AccountBoxProps, { registryUri: string }> {
  constructor(props: AccountBoxProps) {
    super(props);
    this.state = {
      registryUri: '',
    };
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      registryUri: e.target.value,
    });
  };

  render() {
    return (
      <div className="add-existing-account-box">
        <div className="field is-horizontal">
          <div className="control">
            <input className={`input`} type="password" placeholder="Box registry URI" onChange={this.onChange}></input>
            <button
              onClick={() => {
                if (this.state.registryUri.length > 0) {
                  this.props.saveBoxRegistryUri(this.state.registryUri);
                }
              }}
              className="button is-link is-small">
              Save box
            </button>
          </div>
        </div>
      </div>
    );
  }
}
