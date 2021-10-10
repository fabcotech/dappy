import React, { useState } from 'react';
import { connect } from 'react-redux';

import './Requests.scss';
import { LoadRecordsError, LoadRecordsSuccess } from '/models';
import * as fromBlockchain from '/store/blockchain';
import { Pagination, RecordLoadErrorLight } from '../utils';

interface RequestsProps {
  loadSuccesses: LoadRecordsSuccess[];
  loadErrors: LoadRecordsError[];
}

const PER_PAGE = 30;

export function RequestsComponent(props: RequestsProps) {
  const [table, setTable] = useState<'errors' | 'successes'>('successes');
  const [page, setPage] = useState<number>(1);

  const errorsPages = Math.ceil(props.loadErrors.length / PER_PAGE);
  const successesPages = Math.ceil(props.loadSuccesses.length / PER_PAGE);
  return (
    <div className="settings-requests">
      <div className="field has-addons">
        <p className="control">
          <a
            onClick={() => {
              setTable('successes');
              setPage(1);
            }}
            className={`button ${table === 'successes' ? 'is-active' : ''}`}>
            <span>{t('success', true)}</span>
          </a>
        </p>
        <p className="control">
          <a
            onClick={() => {
              setTable('errors');
              setPage(1);
            }}
            className={`button ${table === 'errors' ? 'is-active' : ''}`}>
            <span>{t('error', true)}</span>
          </a>
        </p>
      </div>
      {table === 'successes' ? (
        <div>
          <h3 className="subtitle is-4">{t('name request successes')}</h3>
          <p className="limited-width" />
          <table className="table is-fullwidth is-striped is-bordered is-hoverable">
            <thead>
              <tr>
                <th>
                  <span title="Date at which the request has ended">{t('requested at')}</span>
                </th>
                <th>{t('duration')}</th>
                <th>{t('nodes reached')}</th>
                <th>{t('nodes not reached')}</th>
                <th>{t('name', true)}</th>
              </tr>
            </thead>
            <tbody>
              {props.loadSuccesses.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((c) => {
                return (
                  <tr key={c.date}>
                    <th className="date">{new Date(c.date).toISOString()}</th>
                    <th>
                      <span className="duration">{Math.round(c.time / 10) / 100}s</span>
                    </th>
                    <th>
                      <span className="nodes-reached">{c.nodesReached.length}</span>
                    </th>
                    <th>
                      <span className="nodes-not-reached">{c.nodesNotReached.length}</span>
                    </th>
                    <th>
                      <span className="records-number">{c.recordsNumber}</span>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {successesPages > 1 ? (
            <Pagination changePage={(i) => setPage(i)} pages={successesPages} currentPage={page} />
          ) : undefined}
        </div>
      ) : undefined}
      {table === 'errors' ? (
        <div>
          <h3 className="subtitle is-4">{t('name request errors')}</h3>
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
              {props.loadErrors.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((c) => {
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
                        <RecordLoadErrorLight instance="name" loadError={c} />
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
      loadErrors: fromBlockchain.getLoadRecordsErrors(state),
      loadSuccesses: fromBlockchain.getLoadRecordsSuccesses(state),
    };
  },
  (dispatch) => ({})
)(RequestsComponent);
