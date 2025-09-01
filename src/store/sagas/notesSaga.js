import { call, put, takeEvery } from 'redux-saga/effects';
import {
  createNoteRequest,
  createNoteSuccess,
  createNoteFailure,
  updateNoteRequest,
  updateNoteSuccess,
  updateNoteFailure,
  deleteNoteRequest,
  deleteNoteSuccess,
  deleteNoteFailure,
} from '../slices/notesSlice';

// Simulated API calls (in a real app, these would be actual API calls)
const simulateApiCall = (data, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

function* createNoteSaga(action) {
  try {
    // Simulate API call
    const result = yield call(simulateApiCall, action.payload);
    yield put(createNoteSuccess(result));
  } catch (error) {
    yield put(createNoteFailure(error.message));
  }
}

function* updateNoteSaga(action) {
  try {
    // Simulate API call
    const result = yield call(simulateApiCall, action.payload);
    yield put(updateNoteSuccess(result));
  } catch (error) {
    yield put(updateNoteFailure(error.message));
  }
}

function* deleteNoteSaga(action) {
  try {
    // Simulate API call
    yield call(simulateApiCall, { id: action.payload });
    yield put(deleteNoteSuccess(action.payload));
  } catch (error) {
    yield put(deleteNoteFailure(error.message));
  }
}

export default function* notesSaga() {
  yield takeEvery(createNoteRequest.type, createNoteSaga);
  yield takeEvery(updateNoteRequest.type, updateNoteSaga);
  yield takeEvery(deleteNoteRequest.type, deleteNoteSaga);
}
