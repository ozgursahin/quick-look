import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import tasksReducer from './slices/tasksSlice';
import notesReducer from './slices/notesSlice';
import pomodoroReducer from './slices/pomodoroSlice';
import rootSaga from './sagas/rootSaga';
import { sessionStorageMiddleware, sessionStorageSyncMiddleware } from './middleware/sessionStorageMiddleware';
import { AppStateStorage } from '../utils/localStorage';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Load persisted state from session storage
const loadPersistedState = () => {
  const savedState = AppStateStorage.loadAppState();
  if (savedState) {
    return {
      tasks: savedState.tasks,
      notes: savedState.notes,
      pomodoro: savedState.pomodoro,
      // Add other slices here as the app grows
    };
  }
  return undefined;
};

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    notes: notesReducer,
    pomodoro: pomodoroReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(sagaMiddleware)
      .concat(sessionStorageMiddleware)
      .concat(sessionStorageSyncMiddleware),
  preloadedState: loadPersistedState(),
});

sagaMiddleware.run(rootSaga);

export default store;
