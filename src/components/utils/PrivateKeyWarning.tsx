import * as React from 'react';

const style = { marginBottom: 10, fontSize: '0.9em', 'WhiteSpace': 'break-spaces' };
export const PrivateKeyWarning = () => {
  return (
    <div style={style} className="message is-warning">
      <div className="message-body">{t('dappy opensource warning')}</div>
    </div>
  );
};
