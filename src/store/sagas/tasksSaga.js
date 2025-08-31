import { takeEvery, call, put, delay } from 'redux-saga/effects';
import {
  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
} from '../slices/tasksSlice';

// Simulate API calls
const api = {
  createTask: (task) => Promise.resolve({ id: Date.now().toString(), ...task }),
  updateTask: (task) => Promise.resolve(task),
  deleteTask: (id) => Promise.resolve(id),
};

function* createTaskSaga(action) {
  try {
    yield delay(500); // Simulate API delay
    const task = yield call(api.createTask, action.payload);
    yield put(createTaskSuccess(task));
  } catch (error) {
    yield put(createTaskFailure(error.message));
  }
}

function* updateTaskSaga(action) {
  try {
    yield delay(300);
    const task = yield call(api.updateTask, action.payload);
    yield put(updateTaskSuccess(task));
  } catch (error) {
    yield put(updateTaskFailure(error.message));
  }
}

function* deleteTaskSaga(action) {
  try {
    yield delay(300);
    const id = yield call(api.deleteTask, action.payload);
    yield put(deleteTaskSuccess(id));
  } catch (error) {
    yield put(deleteTaskFailure(error.message));
  }
}

export default function* tasksSaga() {
  yield takeEvery(createTaskRequest.type, createTaskSaga);
  yield takeEvery(updateTaskRequest.type, updateTaskSaga);
  yield takeEvery(deleteTaskRequest.type, deleteTaskSaga);
}
