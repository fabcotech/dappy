import React from 'react';

import './AccountBox.scss';

interface AccountBoxProps {
  saveBoxId: (boxId: string) => void;
}

export class AccountBox extends React.Component<AccountBoxProps, { boxId: string }> {
  constructor(props: AccountBoxProps) {
    super(props);
    this.state = {
      boxId: '',
    };
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      boxId: e.target.value,
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
                if (this.state.boxId.length > 0) {
                  this.props.saveBoxId(this.state.boxId);
                }
              }}
              className="button is-link is-small">
              {t('save box')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
