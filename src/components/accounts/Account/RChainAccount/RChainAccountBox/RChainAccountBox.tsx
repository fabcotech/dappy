import React from 'react';

import './RChainAccountBox.scss';

interface RChainAccountBoxProps {
  saveBoxId: (boxId: string) => void;
}

export class RChainAccountBox extends React.Component<RChainAccountBoxProps, { boxId: string }> {
  constructor(props: RChainAccountBoxProps) {
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
            <input className={`input`} placeholder="Box id" onChange={this.onChange}></input>
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
