import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './ContractLogs.scss';
import { State } from '/store';
import { getContractLogs } from '/store/ui';
import { getNameSystemContractId } from '/store/blockchain';

// const msg1 = 'New name x was purchased for x REV';
// const msg2 = 'Name x was sold for x REV';

// const log = (message: string) => ({
//   date: new Date().toISOString(),
//   msg: message,
//   type: 'Purchase',
// });
// p,1636020905821,aaa,aaa,1,50000000,0,baz

const parseLogTs = (l: string) => {
  const match = l.match(/^[^,]+,(\d+),/);
  if (match && match[1]) {
    return new Date(parseInt(match[1])).toISOString();
  }
};

const parseLogMessage = (l: string) => {
  return l;
};

const containsContractLogs = (contractLogs: ReturnType<typeof getContractLogs>, contractId: string | undefined) =>
  contractId && contractLogs && contractLogs[contractId];

interface ContractLogsProps {
  contractLogs: ReturnType<typeof getContractLogs>;
  nameSystemContractId: string | undefined;
}

export const ContractLogsComponent = ({ contractLogs, nameSystemContractId }: ContractLogsProps): JSX.Element => {
  return (
    <div className="p-4 contract-logs">
      <p className="title has-text-white">{t('Contract logs')}</p>
      <div className="table">
        <div className="tbody pl-2 pr-2">
          {containsContractLogs(contractLogs, nameSystemContractId) ? (
            contractLogs[nameSystemContractId as string].map((l: string, i: number) => (
              <Fragment key={`l-${i}`}>
                <code style={{ whiteSpace: 'nowrap' }}>{parseLogTs(l)}</code>
                <code>{parseLogMessage(l)}</code>
              </Fragment>
            ))
          ) : (
            <code>({t('empty')})</code>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  contractLogs: getContractLogs(state),
  nameSystemContractId: getNameSystemContractId(state),
});

export const ContractLogs = connect(mapStateToProps)(ContractLogsComponent);
