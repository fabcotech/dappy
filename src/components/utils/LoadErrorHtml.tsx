import * as React from 'react';

import { NavigationUrl, SimpleError } from '/models/';
import './LoadErrorHtml.scss';

const Button = (props: { ok: () => void; text: string }) => (
  <button type="button" className="mr-2 button is-outlined is-medium" onClick={() => props.ok()}>
    {props.text}
  </button>
);

export const LoadErrorHtml = (props: {
  loadError: SimpleError;
  clear: () => void;
  clearAndNavigate: (path: NavigationUrl) => void;
}) => {
  return (
    <div>
      <h4 className="title is-4">{props.loadError.title}</h4>
      <p>{props.loadError.message}</p>
      <div className="ack-button-div">
        {props.loadError.message.includes('is not whitelisted') ? (
          <Button
            text="Navigate to whitelist"
            ok={() => {
              props.clearAndNavigate('/whitelist');
            }}
          />
        ) : undefined}
        <Button text="Ok" ok={props.clear} />
      </div>
    </div>
  );
};
