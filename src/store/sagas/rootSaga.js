import { all } from 'redux-saga/effects';
import tasksSaga from './tasksSaga';
import notesSaga from './notesSaga';

export default function* rootSaga() {
  yield all([
    tasksSaga(),
    notesSaga(),
  ]);
}
