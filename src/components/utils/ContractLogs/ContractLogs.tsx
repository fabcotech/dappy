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
  process.env.JEST_WORKER_ID === undefined && console.info(`Could not parse log timestamp for log ${l}`);
  return t('no timestamp');
};

const logRegExp = /^(.+),(\d+),(\w+),(\w+),(\d+),(\d+),(\w+),(\w+)$/;

const toLogMessage = ([type, ts, boxDest, boxFrom, nbTokens, dustPrice, purseName, newPurseName]: string[]) => {
  if (purseName === '0') {
    return (
      <Fragment>
        <span>{`${t('New name')} `}</span>
        <span>{`${t(newPurseName)} `}</span>
        <span>{`${t('was purchased for')} `}</span>
        <span>{`${dustToRev(parseInt(dustPrice))} REV`}</span>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <span>{t('Name')} </span>
        <span>{newPurseName} </span>
        <span>{t('was sold for')} </span>
        <span>{dustToRev(parseInt(dustPrice))} REV</span>
      </Fragment>
    );
  }
};

const parseLogMessage = (l: string) => {
  const match = l.match(logRegExp);
  if (match) {
    return toLogMessage(match.slice(1));
  }
  return l;
};

const containsContractLogs = (contractLogs: ReturnType<typeof getContractLogs>, contractId: string | undefined) =>
  contractId && contractLogs && contractLogs[contractId];

export interface ContractLogsProps {
  contractLogs: ReturnType<typeof getContractLogs>;
  nameSystemContractId: string | undefined;
}

export const ContractLogsComponent = ({ contractLogs, nameSystemContractId }: ContractLogsProps): JSX.Element => {
  if (!containsContractLogs(contractLogs, nameSystemContractId)) {
    return <Fragment />;
  }
  return (
    <div className="p-4 contract-logs">
      <p className="title has-text-white">{t('Contract logs')}</p>
      <div className="has-background-white logs">
        <div className="tbody pl-2 pr-2" data-testid="logs">
          {contractLogs[nameSystemContractId as string].map((l: string, i: number) => (
            <Fragment key={`l-${i}`}>
              <span style={{ whiteSpace: 'nowrap' }}>{parseLogTs(l)}</span>
              {parseLogMessage(l)}
            </Fragment>
          ))}
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
