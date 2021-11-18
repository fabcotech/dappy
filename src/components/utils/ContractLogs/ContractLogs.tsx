import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

import './ContractLogs.scss';
import { State } from '/store';
import * as fromDapps from '/store/dapps';
import { getContractLogs } from '/store/ui';
import { getNameSystemContractId } from '/store/blockchain';
import { getNamesBlockchain } from '/store/settings';
import { dustToRev } from '/utils/unit';
import { Blockchain } from '/models';
import { searchToAddress } from '/utils/searchToAddress';
import { LoadResourcePayload } from '/store/dapps';

const parseLogTs = (l: string) => {
  const match = l.match(/^[^,]+,(\d+),/);
  if (match && match[1]) {
    return DateTime.fromMillis(parseInt(match[1])).toLocaleString(DateTime.DATETIME_SHORT);
  }
  process.env.JEST_WORKER_ID === undefined && console.info(`Could not parse log timestamp for log ${l}`);
  return t('no timestamp');
};

const logRegExp = /^(.+),(\d+),(\w+),(\w+),(\d+),(\d+),(\w+),(\w+)$/;

const toLogMessage = (
  [type, ts, boxDest, boxFrom, nbTokens, dustPrice, purseName, newPurseName]: string[],
  goToPurse: (purseName: string) => void
) => {
  if (purseName === '0') {
    return (
      <Fragment>
        <span className="pr-1">{`${t('new name')} `}</span>
        <a onClick={() => goToPurse(newPurseName)} className="purse-id">
          {newPurseName}{' '}
        </a>
        <span className="pr-1">{`${t('was purchased for')} `}</span>
        <span>{`${dustToRev(parseInt(dustPrice))} REV`}</span>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <span className="pr-1">{t('name')} </span>
        <a onClick={() => goToPurse(newPurseName)} className="purse-id">
          {newPurseName}{' '}
        </a>
        <span className="pr-1">{t('was traded for')} </span>
        <span>{dustToRev(parseInt(dustPrice))} REV</span>
      </Fragment>
    );
  }
};

const containsContractLogs = (contractLogs: ReturnType<typeof getContractLogs>, contractId: string | undefined) =>
  contractId && contractLogs && (contractLogs[contractId] || []).length > 0;
// contractId && contractLogs && contractLogs[contractId];

export interface ContractLogsProps {
  contractLogs: ReturnType<typeof getContractLogs>;
  nameSystemContractId: string | undefined;
  namesBlockchain: Blockchain | undefined;
  loadResource: (a: fromDapps.LoadResourcePayload) => void;
}

const goToPurse =
  (namesBlockchain: Blockchain | undefined, loadResource: (a: LoadResourcePayload) => void) => (purseName: string) => {
    if (namesBlockchain) {
      loadResource({
        address: searchToAddress(purseName, namesBlockchain.chainId),
      });
    }
  };

export const ContractLogsComponent = ({
  contractLogs,
  nameSystemContractId,
  namesBlockchain,
  loadResource,
}: ContractLogsProps): JSX.Element => {
  if (!containsContractLogs(contractLogs, nameSystemContractId)) {
    return <Fragment />;
  }
  return (
    <div className="p-4 contract-logs">
      <p className="title is-5 has-text-white">{t('name system logs')}</p>
      <div className="p-2 logs">
        <div className="tbody p-2" data-testid="logs">
          {contractLogs[nameSystemContractId as string].map((l: string, i: number) => {
            const match = l.match(logRegExp);
            return (
              <Fragment key={`l-${l}`}>
                <span style={{ whiteSpace: 'nowrap' }}>{`${parseLogTs(l)} `}</span>
                {match ? toLogMessage(match.slice(1), goToPurse(namesBlockchain, loadResource)) : l}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const ContractLogs = connect(
  (state: State) => ({
    contractLogs: getContractLogs(state),
    nameSystemContractId: getNameSystemContractId(state),
    namesBlockchain: getNamesBlockchain(state),
  }),
  (dispatch) => ({
    loadResource: (a: fromDapps.LoadResourcePayload) => dispatch(fromDapps.loadResourceAction(a)),
  })
)(ContractLogsComponent);
