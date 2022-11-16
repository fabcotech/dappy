import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { State as StoreState } from '/store';
import { getFavs, loadResourceAction, removeFavAction } from '/store/dapps';

import './Favs.scss';

const connector = connect(
  (state: StoreState) => {
    return {
      favs: getFavs(state),
    };
  },
  (dispatch) => ({
    loadResource: (url: string) =>
      dispatch(
        loadResourceAction({
          url: url,
          tabId: undefined,
        })
      ),
    removeFav: (favId: string) => dispatch(removeFavAction({ favId })),
  })
);

type FavsConnectorProps = ConnectedProps<typeof connector>;

const FavsComponent = ({ favs, loadResource, removeFav }: FavsConnectorProps) => {
  return (
    <div className="favs">
      {favs.map((f) => {
        return (
          <a
            key={f.id}
            className="fav"
            title={f.title}
            onClick={() => {
              loadResource(f.url);
            }}
          >
            {f.img ? <img src={f.img}></img> : <span className="square"></span>}
          </a>
        );
      })}
    </div>
  );
};

export const Favs = connector(FavsComponent);
