import * as React from 'react';

import { SimpleError } from '/models/';
import './LoadErrorHtml.scss';

const Button = (props: { ok: () => void }) => (
  <div className="ack-button-div">
    <button type="button" className="button is-outlined is-medium" onClick={() => props.ok()}>
      Ok
    </button>
  </div>
);

export const LoadErrorHtml = (props: {
  loadError: SimpleError;
  clearSearchAndLoadError: () => void;
}) => {
  return (
    <div>
      <h4 className="title is-4">{(props.loadError as SimpleError).title}</h4>
      <p>{(props.loadError as SimpleError).message}</p>
      <Button ok={props.clearSearchAndLoadError} />
    </div>
  );
};
