import { all } from 'redux-saga/effects';

import { goForwardSaga } from './goForward';
import { goBackwardSaga } from './goBackward';
import { savePreviewSaga } from './savePreview';

export const sagas = function* rootSaga() {
  yield all([goForwardSaga(), goBackwardSaga(), savePreviewSaga()]);
};
