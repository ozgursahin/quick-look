/**
 * Session Storage Utility
 * Provides centralized session storage management for the entire application
 */

const SESSION_STORAGE_KEYS = {
  TASKS: 'quick-look-tasks',
  TASKS_UI_STATE: 'quick-look-tasks-ui-state',
  USER_PREFERENCES: 'quick-look-user-preferences',
  APP_STATE: 'quick-look-app-state',
};

/**
 * Generic session storage operations
 */
export const SessionStorage = {
  // Set data in session storage
  setItem: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to session storage:', error);
      return false;
    }
  },

  // Get data from session storage
  getItem: (key, defaultValue = null) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from session storage:', error);
      return defaultValue;
    }
  },

  // Remove data from session storage
  removeItem: (key) => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from session storage:', error);
      return false;
    }
  },

  // Clear all session storage
  clear: () => {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing session storage:', error);
      return false;
    }
  },

  // Check if session storage is available
  isAvailable: () => {
    try {
      const testKey = '__session_storage_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  },
};

/**
 * Task-specific session storage operations
 */
export const TaskStorage = {
  // Save tasks to session storage
  saveTasks: (tasks) => {
    return SessionStorage.setItem(SESSION_STORAGE_KEYS.TASKS, tasks);
  },

  // Load tasks from session storage
  loadTasks: () => {
    return SessionStorage.getItem(SESSION_STORAGE_KEYS.TASKS, []);
  },

  // Save tasks UI state (filters, sorting, etc.)
  saveTasksUIState: (uiState) => {
    return SessionStorage.setItem(SESSION_STORAGE_KEYS.TASKS_UI_STATE, uiState);
  },

  // Load tasks UI state
  loadTasksUIState: () => {
    return SessionStorage.getItem(SESSION_STORAGE_KEYS.TASKS_UI_STATE, {
      showCancelled: false,
      showCompleted: false,
      sortBy: 'dueDate',
      showCreatePanel: false,
    });
  },

  // Clear all task data
  clearTasks: () => {
    SessionStorage.removeItem(SESSION_STORAGE_KEYS.TASKS);
    SessionStorage.removeItem(SESSION_STORAGE_KEYS.TASKS_UI_STATE);
  },
};

/**
 * User preferences session storage operations
 */
export const UserPreferencesStorage = {
  // Save user preferences
  savePreferences: (preferences) => {
    return SessionStorage.setItem(SESSION_STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  // Load user preferences
  loadPreferences: () => {
    return SessionStorage.getItem(SESSION_STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'light',
      dateFormat: 'MM-DD-YYYY',
      notifications: true,
    });
  },

  // Update specific preference
  updatePreference: (key, value) => {
    const preferences = UserPreferencesStorage.loadPreferences();
    preferences[key] = value;
    return UserPreferencesStorage.savePreferences(preferences);
  },
};

/**
 * App state session storage operations
 */
export const AppStateStorage = {
  // Save entire app state
  saveAppState: (state) => {
    const stateToSave = {
      tasks: state.tasks,
      // Add other slices here as the app grows
      lastSaved: new Date().toISOString(),
    };
    return SessionStorage.setItem(SESSION_STORAGE_KEYS.APP_STATE, stateToSave);
  },

  // Load entire app state
  loadAppState: () => {
    return SessionStorage.getItem(SESSION_STORAGE_KEYS.APP_STATE, null);
  },

  // Clear app state
  clearAppState: () => {
    return SessionStorage.removeItem(SESSION_STORAGE_KEYS.APP_STATE);
  },
};

export { SESSION_STORAGE_KEYS };
