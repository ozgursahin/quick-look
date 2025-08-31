import { AppStateStorage } from '../../utils/sessionStorage';

/**
 * Redux middleware for automatic session storage persistence
 * This middleware will save the app state to session storage after every action
 */
export const sessionStorageMiddleware = (store) => (next) => (action) => {
  // Let the action pass through first
  const result = next(action);
  
  // Get the updated state
  const state = store.getState();
  
  // Save to session storage (debounced to avoid excessive writes)
  if (!sessionStorageMiddleware.saveTimeout) {
    sessionStorageMiddleware.saveTimeout = setTimeout(() => {
      AppStateStorage.saveAppState(state);
      sessionStorageMiddleware.saveTimeout = null;
    }, 100); // Debounce by 100ms
  }
  
  return result;
};

/**
 * Session storage sync middleware
 * This middleware ensures session storage is updated on specific actions
 */
export const sessionStorageSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Actions that should trigger immediate session storage sync
  const immediateSync = [
    'tasks/createTaskSuccess',
    'tasks/updateTaskSuccess',
    'tasks/deleteTaskSuccess',
  ];
  
  if (immediateSync.includes(action.type)) {
    const state = store.getState();
    AppStateStorage.saveAppState(state);
  }
  
  return result;
};
