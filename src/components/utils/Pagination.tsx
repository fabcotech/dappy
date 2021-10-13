import React, { Fragment } from 'react';

import './Pagination.scss';

export function Pagination(props: { pages: number; currentPage: number; changePage: (u: number) => void }) {
  if (props.pages > 8) {
    return (
      <nav className="pagination is-centered" role="navigation" aria-label="pagination">
        <a
          className="pagination-previous"
          onClick={a => (props.currentPage === 1 ? undefined : props.changePage(props.currentPage - 1))}>
          {t('previous')}
        </a>
        <a
          className="pagination-next"
          onClick={a => (props.currentPage === props.pages ? undefined : props.changePage(props.currentPage + 1))}>
          {t('next')}
        </a>
        <ul className="pagination-list">
          {props.currentPage !== 1 ? (
            <li>
              <a className="pagination-link" onClick={() => props.changePage(1)} aria-label="Go to page 1">
                1
              </a>
            </li>
          ) : (
            undefined
          )}

          {props.currentPage > 2 ? (
            <Fragment>
              <li>
                <span className="pagination-ellipsis">&hellip;</span>
              </li>
              <li>
                <a
                  className="pagination-link"
                  onClick={() => props.changePage(props.currentPage - 1)}
                  aria-label={`Go to page ${props.currentPage - 1}`}>
                  {props.currentPage - 1}
                </a>
              </li>
            </Fragment>
          ) : (
            undefined
          )}

          <li>
            <a
              className="pagination-link is-current"
              onClick={() => props.changePage(props.currentPage)}
              aria-label={`Page ${props.currentPage}`}
              aria-current="page">
              {props.currentPage}
            </a>
          </li>

          {props.pages - 1 > props.currentPage ? (
            <Fragment>
              <li>
                <a
                  className="pagination-link"
                  onClick={() => props.changePage(props.currentPage + 1)}
                  aria-label={`Go to page ${props.currentPage + 1}`}>
                  {props.currentPage + 1}
                </a>
              </li>
              <li>
                <span className="pagination-ellipsis">&hellip;</span>
              </li>
            </Fragment>
          ) : (
            undefined
          )}

          {props.currentPage !== props.pages ? (
            <li>
              <a
                className="pagination-link"
                onClick={() => props.changePage(props.pages)}
                aria-label={`Go to page ${props.pages}`}>
                {props.pages}
              </a>
            </li>
          ) : (
            undefined
          )}
        </ul>
      </nav>
    );
  } else {
    return (
      <nav className="pagination is-centered" role="navigation" aria-label="pagination">
        <a
          className="pagination-previous"
          onClick={a => (props.currentPage === 1 ? undefined : props.changePage(props.currentPage - 1))}>
          {t('previous')}
        </a>
        <a
          className="pagination-next"
          onClick={a => (props.currentPage === props.pages ? undefined : props.changePage(props.currentPage + 1))}>
          {t('next')}
        </a>
        <ul className="pagination-list">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => {
            return i <= props.pages ? (
              <li key={i}>
                <a
                  onClick={a => props.changePage(i)}
                  className={`pagination-link ${i === props.currentPage ? 'is-current' : ''}`}
                  aria-label={`Go to page ${i}`}>
                  {i}
                </a>
              </li>
            ) : (
              undefined
            );
          })}
        </ul>
      </nav>
    );
  }
}
