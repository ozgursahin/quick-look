import { AppStateStorage } from '../../utils/localStorage';

/**
 * Redux middleware for automatic local storage persistence
 * This middleware will save the app state to local storage after every action
 */
export const localStorageMiddleware = (store) => (next) => (action) => {
  // Let the action pass through first
  const result = next(action);
  
  // Get the updated state
  const state = store.getState();
  
  // Save to local storage (debounced to avoid excessive writes)
  if (!localStorageMiddleware.saveTimeout) {
    localStorageMiddleware.saveTimeout = setTimeout(() => {
      AppStateStorage.saveAppState(state);
      localStorageMiddleware.saveTimeout = null;
    }, 100); // Debounce by 100ms
  }
  
  return result;
};

/**
 * Local storage sync middleware
 * This middleware ensures local storage is updated on specific actions
 */
export const localStorageSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Actions that should trigger immediate local storage sync
  const immediateSync = [
    'tasks/createTaskSuccess',
    'tasks/updateTaskSuccess',
    'tasks/deleteTaskSuccess',
    'notes/createNoteSuccess',
    'notes/updateNoteSuccess',
    'notes/deleteNoteSuccess',
  ];
  
  if (immediateSync.includes(action.type)) {
    const state = store.getState();
    AppStateStorage.saveAppState(state);
  }
  
  return result;
};

// For backward compatibility, export with old names
export const sessionStorageMiddleware = localStorageMiddleware;
export const sessionStorageSyncMiddleware = localStorageSyncMiddleware;
