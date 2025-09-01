import { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  SessionStorage, 
  TaskStorage, 
  UserPreferencesStorage, 
  AppStateStorage 
} from '../utils/localStorage';

/**
 * Custom hook for session storage operations
 */
export const useSessionStorage = () => {
  const state = useSelector((state) => state);

  // Save entire app state to session storage
  const saveAppState = useCallback(() => {
    AppStateStorage.saveAppState(state);
  }, [state]);

  // Load app state from session storage
  const loadAppState = useCallback(() => {
    return AppStateStorage.loadAppState();
  }, []);

  // Clear all session storage
  const clearAllStorage = useCallback(() => {
    SessionStorage.clear();
  }, []);

  // Check if session storage is available
  const isStorageAvailable = useCallback(() => {
    return SessionStorage.isAvailable();
  }, []);

  return {
    saveAppState,
    loadAppState,
    clearAllStorage,
    isStorageAvailable,
  };
};

/**
 * Custom hook for task-specific session storage operations
 */
export const useTaskStorage = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const tasksUIState = useSelector((state) => ({
    showCancelled: state.tasks.showCancelled,
    showCompleted: state.tasks.showCompleted,
    sortBy: state.tasks.sortBy,
  }));

  // Save tasks to session storage
  const saveTasks = useCallback(() => {
    TaskStorage.saveTasks(tasks);
  }, [tasks]);

  // Save tasks UI state to session storage
  const saveTasksUIState = useCallback(() => {
    TaskStorage.saveTasksUIState(tasksUIState);
  }, [tasksUIState]);

  // Load tasks from session storage
  const loadTasks = useCallback(() => {
    return TaskStorage.loadTasks();
  }, []);

  // Load tasks UI state from session storage
  const loadTasksUIState = useCallback(() => {
    return TaskStorage.loadTasksUIState();
  }, []);

  // Clear all task data
  const clearTasks = useCallback(() => {
    TaskStorage.clearTasks();
  }, []);

  return {
    saveTasks,
    saveTasksUIState,
    loadTasks,
    loadTasksUIState,
    clearTasks,
  };
};

/**
 * Custom hook for user preferences session storage operations
 */
export const useUserPreferences = () => {
  // Save user preferences
  const savePreferences = useCallback((preferences) => {
    return UserPreferencesStorage.savePreferences(preferences);
  }, []);

  // Load user preferences
  const loadPreferences = useCallback(() => {
    return UserPreferencesStorage.loadPreferences();
  }, []);

  // Update specific preference
  const updatePreference = useCallback((key, value) => {
    return UserPreferencesStorage.updatePreference(key, value);
  }, []);

  return {
    savePreferences,
    loadPreferences,
    updatePreference,
  };
};

/**
 * Custom hook that automatically syncs component state with session storage
 */
export const useSessionStorageSync = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return SessionStorage.getItem(key, initialValue);
  });

  useEffect(() => {
    SessionStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};
