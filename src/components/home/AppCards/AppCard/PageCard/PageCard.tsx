import React, { SyntheticEvent } from 'react';

import { Page } from '../../model';
import { Wallets } from '../Wallets';

interface PageCardProps extends Page {
  onClose: () => void;
  onClick: (e: SyntheticEvent) => void;
  onToggleFavorite: () => void;
}

export const PageCard = (props: PageCardProps) => {
  const { title, description, favorite, onClick, onClose, onToggleFavorite, url } = props;
  const titleDefaultToUrl = title || url;
  return (
    <a
      className="ac-pageCard"
      rel="noreferrer"
      title={`go to ${url}`}
      href={url}
      target="_blank"
      onClick={onClick}
      style={{
        borderRadius: '0.5rem',
        display: 'flex',
        width: '35rem',
        height: '14rem',
        fontSize: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '1.5rem',
          gap: '1rem',
          overflow: 'hidden',
          width: '100%',
        }}
        className="ac-content"
      >
        <div
          className="ac-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <div
            className="ac-title"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
            title={titleDefaultToUrl}
          >
            {titleDefaultToUrl}
          </div>
          <div className="ac-buttonBar">
            <button
              style={{
                border: 0,
                background: 'transparent',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <i className={`${favorite ? 'fa-map-marker' : 'fa-map-marker-alt'} fas fa-lg`}></i>
            </button>
            {!favorite && (
              <button
                style={{
                  border: 0,
                  background: 'transparent',
                  cursor: 'pointer',
                  paddingRight: 0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <i className="fas fa-times fa-lg"></i>
              </button>
            )}
          </div>
        </div>
        <div
          className="ac-description"
          title={description}
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </div>
        <Wallets domain={new URL(props.url).hostname} />
      </div>
    </a>
  );
};
