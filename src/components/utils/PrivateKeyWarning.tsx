import * as React from 'react';

const style = { marginBottom: 10, fontSize: '0.9em' };
export const PrivateKeyWarning = () => {
  return (
    <div style={style} className="message is-danger">
      <div className="message-body">
        This release is a beta/pre-release. Do not reference private keys (ETH or REV) that can unlock large sum of
        money, tokens or cryptocurrency.
        <br />
        <br />
        This program does not interact with any private server of FABCO / DAPPY. It does not rely on any centralized
        service or server. The private keys are stored on your computer, and encrypted with your password. While we have
        thoroughly tested the code, it is stilla beta, not-audited software, there is always the possibility something
        unexpected happens that causes your funds to be lost. Please do not invest more than you are willing to lose,
        and please be careful.
        <br />
        <br />
        USE DAPPY, TRANSFER FUNDS, REFERENCE PRIVATE KEYS AND PUBLIC KEYS AT YOUR OWN RISKS.
      </div>
    </div>
  );
};
