import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './ContractLogs.scss';
import { State } from '/store';
import { getContractLogs } from '/store/ui';
import { getNameSystemContractId } from '/store/blockchain';
import { dustToRev } from '/utils/unit';

const parseLogTs = (l: string) => {
  const match = l.match(/^[^,]+,(\d+),/);
  if (match && match[1]) {
    return new Date(parseInt(match[1])).toISOString();
  }
};

const logRegExp = /^(.+),(\d+),(\w+),(\w+),(\d+),(\d+),(\d+),(\w+)$/;

const toLogMessage = ([type, ts, boxDest, boxFrom, nbTokens, dustPrice, purseName, newPurseName]: string[]) => {
  if (purseName === '0') {
    return `${t('New name')} ${newPurseName} ${t('was purchased for')} ${dustToRev(parseInt(dustPrice))} REV`;
  } else {
    return `${t('Name')} ${newPurseName} ${t('was sold for')} ${dustToRev(parseInt(dustPrice))} REV`;
  }
};

const parseLogMessage = (l: string) => {
  const match = l.match(logRegExp);
  if (match) {
    return toLogMessage(match.slice(1));
  }
};

const containsContractLogs = (contractLogs: ReturnType<typeof getContractLogs>, contractId: string | undefined) =>
  contractId && contractLogs && contractLogs[contractId];

export interface ContractLogsProps {
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
