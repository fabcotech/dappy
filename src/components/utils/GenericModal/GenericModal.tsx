import * as React from 'react';

import * as fromMain from '/store/main';

import './GenericModal.scss';

interface LinesProps {
  lines: [label: string, value: string][] | undefined;
}

const Lines = ({ lines }: LinesProps) => {
  if (!lines || !lines.length) {
    return null;
  }
  return (
    <section className="gm-lines">
      {lines.map(([lbl, val], i) => (
        <React.Fragment key={`${lbl}-${i}`}>
          <div>{lbl}</div>
          <div>{val}</div>
        </React.Fragment>
      ))}
    </section>
  );
};

interface GenericModalProps {
  modal: fromMain.Modal;
  dispatchModalAction: (
    action: undefined | { type: string; payload?: any } | { type: string; payload?: any }[]
  ) => void;
  onClose: () => void;
}

export const GenericModal = ({ modal, dispatchModalAction, onClose }: GenericModalProps) => {
  return (
    <div className="modal fc">
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{modal.title}</p>
          <i onClick={onClose} className="fa fa-times" />
        </header>
        <section className="modal-card-body">
          {modal.text}
          <Lines lines={modal.parameters?.lines} />
        </section>
        <footer className="modal-card-foot">
          {modal.buttons &&
            modal.buttons.map((b) => (
              <button
                key={b.text}
                type="button"
                className={`button ${b.classNames}`}
                onClick={() => dispatchModalAction(b.action)}>
                {b.text}
              </button>
            ))}
        </footer>
      </div>
    </div>
  );
};
