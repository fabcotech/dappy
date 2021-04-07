import * as React from 'react';

import { GCU_TEXT } from '../../GCU';

export class ConsultGcuComponent extends React.Component<RootProps, {}> {
  state = {};

  render() {
    return (
      <div>
        <p style={{ whiteSpace: 'break-spaces', maxWidth: '800px' }}>{GCU_TEXT}</p>
      </div>
    );
  }
}

export const ConsultGcu = ConsultGcuComponent;
