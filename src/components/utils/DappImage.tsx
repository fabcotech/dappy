import * as React from 'react';
import { TransitoryState } from '/models';

export const DappImage = (props: {
  img: undefined | string;
  title: string;
  small?: boolean;
  transitoryState: undefined | TransitoryState;
}) => {
  if (props.img) {
    return <img className={props.small ? 'small' : ''} src={`${props.img}`} />;
  } else if (
    props.transitoryState &&
    ['launching', 'stopping', 'loading', 'reloading'].includes(props.transitoryState)
  ) {
    return (
      <div className={'fc ' + props.small ? 'small' : ''}>
        <i className="color-aaa fas fa-redo rotating"></i>
      </div>
    );
  } else {
    return <></>;
  }
};
