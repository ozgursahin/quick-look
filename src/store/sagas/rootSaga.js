import { all } from 'redux-saga/effects';
import tasksSaga from './tasksSaga';

export default function* rootSaga() {
  yield all([
    tasksSaga(),
  ]);
}
