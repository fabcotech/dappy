import React, { useState } from 'react';
import { connect } from 'react-redux';

import './Requests.scss';
import { LoadNodesError } from '../../../models';
import * as fromBlockchain from '../../../store/blockchain';
import { Pagination, RecordLoadErrorLight } from '../../utils';

interface RequestsProps {
  loadNodesErrors: LoadNodesError[];
}

const PER_PAGE = 30;

export function RequestsComponent(props: RequestsProps) {
  const [table, setTable] = useState<'errors'>('errors');
  const [page, setPage] = useState<number>(1);

  const errorsPages = Math.ceil(props.loadNodesErrors.length / PER_PAGE);

  return (
    <div className="blockchain-requests">
      {table === 'errors' ? (
        <div>
          <h3 className="subtitle is-4">{t('node requests errors')}</h3>
          <p className="limited-width" />
          <table className="table is-fullwidth is-striped is-bordered is-hoverable">
            <thead>
              <tr>
                <th>
                  <span title="Date at which the request has ended">{t('requested at')}</span>
                </th>
                <th>{t('duration')}</th>
                <th>{t('network id')}</th>
                <th>{t('error')}</th>
              </tr>
            </thead>
            <tbody>
              {props.loadNodesErrors.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((c) => {
                return (
                  <tr key={c.date}>
                    <th>{new Date(c.date).toISOString()}</th>
                    <th>
                      <span className="duration">{Math.round(c.time / 10) / 100}s</span>
                    </th>
                    <th>
                      <span className="chainid">{c.chainId}</span>
                    </th>
                    <th>
                      <span className="error">
                        <RecordLoadErrorLight instance="node" loadError={c} />
                      </span>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {errorsPages > 1 ? (
            <Pagination changePage={(i) => setPage(i)} pages={errorsPages} currentPage={page} />
          ) : undefined}
        </div>
      ) : undefined}
    </div>
  );
}

export const Requests = connect(
  (state) => {
    return {
      loadNodesErrors: fromBlockchain.getLoadNodesErrors(state),
    };
  },
  (dispatch) => ({})
)(RequestsComponent);
