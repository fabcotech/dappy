import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';

import { store } from './store';
import './index.scss';
import './style/index.scss';
import { Root } from './components';
import { DEVELOPMENT, VERSION } from './CONSTANTS';
import { contextMenu } from './contextMenu';

contextMenu(document);

if (!DEVELOPMENT) {
  Sentry.init({
    dsn: 'https://6a60897f868848289980868db72a98d6@sentry.io/1504943',
    release: VERSION,
    beforeSend(event, hint) {
      console.error('sentry error beforeSend :');
      console.log(event);

      // just keep the src.xxx.js
      if (
        event.request &&
        event.request.url &&
        (event.request.url.startsWith('file://') || event.request.url.startsWith('/C:/'))
      ) {
        const splitted = event.request.url.split('/');
        event.request.url = splitted[splitted.length - 1];
      }

      // replace full path by app:///src.xxxx.js
      if (
        event.exception &&
        event.exception.values &&
        event.exception.values[0] &&
        event.exception.values[0].stacktrace &&
        event.exception.values[0].stacktrace.frames
      ) {
        const framesWithUrlUpdated = event.exception.values[0].stacktrace.frames.map((f) => {
          let filename = f.filename;
          if (filename && (filename.startsWith('file://') || filename.startsWith('/C:/'))) {
            const splitted = filename.split('/');
            filename = `app:///${splitted[splitted.length - 1]}`;
          }
          return {
            ...f,
            filename: filename,
          };
        });

        event.exception.values[0].stacktrace.frames = framesWithUrlUpdated;
      }
      return event;
    },
  });

  window.Sentry = Sentry;
}

const renderApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Root />
    </Provider>,
    document.getElementById('root')
  );
};

document.addEventListener('DOMContentLoaded', function () {
  renderApp();
});
