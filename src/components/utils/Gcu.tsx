import * as React from 'react';
import { useState } from 'react';
import './Gcu.scss';

export const Gcu = (props: { version: string; text: string; continue: () => void }) => {
  const [agree, setAgree] = useState(false);

  return (
    <div className="gcu">
      <p className="gcu-title">Please agree with our general conditions of use to continue</p>
      <p className="gcu-text">{props.text}</p>
      <div className="field is-horizontal">
        <div className="control">
          <input
            className="is-checkradio is-link is-inverted"
            id="exampleCheckbox"
            type="checkbox"
            onChange={() => {}}
            checked={agree}
          />
          <label onClick={() => setAgree(!agree)}>I have read and I agree to the general conditions of use</label>
        </div>
      </div>
      <button className="button is-light" disabled={!agree} onClick={() => props.continue()}>
        Continue
      </button>
      <br />
      <br />
    </div>
  );
};
