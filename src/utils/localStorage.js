/**
 * Local Storage Utility
 * Provides centralized local storage management for the entire application
 */

const LOCAL_STORAGE_KEYS = {
  TASKS: 'quick-look-tasks',
  TASKS_UI_STATE: 'quick-look-tasks-ui-state',
  NOTES: 'quick-look-notes',
  NOTES_UI_STATE: 'quick-look-notes-ui-state',
  POMODORO: 'quick-look-pomodoro',
  POMODORO_UI_STATE: 'quick-look-pomodoro-ui-state',
  USER_PREFERENCES: 'quick-look-user-preferences',
  APP_STATE: 'quick-look-app-state',
};

/**
 * Generic local storage operations
 */
export const LocalStorage = {
  // Set data in local storage
  setItem: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to local storage:', error);
      return false;
    }
  },

  // Get data from local storage
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from local storage:', error);
      return defaultValue;
    }
  },

  // Remove data from local storage
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from local storage:', error);
      return false;
    }
  },

  // Clear all local storage
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing local storage:', error);
      return false;
    }
  },

  // Check if local storage is available
  isAvailable: () => {
    try {
      const testKey = '__local_storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  },
};

/**
 * Task-specific local storage operations
 */
export const TaskStorage = {
  // Save tasks to local storage
  saveTasks: (tasks) => {
    return LocalStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, tasks);
  },

  // Load tasks from local storage
  loadTasks: () => {
    return LocalStorage.getItem(LOCAL_STORAGE_KEYS.TASKS, []);
  },

  // Save tasks UI state (filters, sorting, etc.)
  saveTasksUIState: (uiState) => {
    return LocalStorage.setItem(LOCAL_STORAGE_KEYS.TASKS_UI_STATE, uiState);
  },

  // Load tasks UI state
  loadTasksUIState: () => {
    return LocalStorage.getItem(LOCAL_STORAGE_KEYS.TASKS_UI_STATE, {
      showCancelled: false,
      showCompleted: false,
      sortBy: 'dueDate',
      showCreatePanel: false,
    });
  },

  // Clear all task data
  clearTasks: () => {
    LocalStorage.removeItem(LOCAL_STORAGE_KEYS.TASKS);
    LocalStorage.removeItem(LOCAL_STORAGE_KEYS.TASKS_UI_STATE);
  },
};

/**
 * Note-specific local storage operations
 */
export const NoteStorage = {
  // Save notes to local storage
  saveNotes: (notes) => {
    return LocalStorage.setItem(LOCAL_STORAGE_KEYS.NOTES, notes);
  },

  // Load notes from local storage
  loadNotes: () => {
    return LocalStorage.getItem(LOCAL_STORAGE_KEYS.NOTES, []);
  },

  // Save notes UI state (filters, sorting, etc.)
  saveNotesUIState: (uiState) => {
    return LocalStorage.setItem(LOCAL_STORAGE_KEYS.NOTES_UI_STATE, uiState);
  },

  // Load notes UI state
  loadNotesUIState: () => {
    return LocalStorage.getItem(LOCAL_STORAGE_KEYS.NOTES_UI_STATE, {
      sortBy: 'updatedAt',
      showCreatePanel: false,
    });
  },

  // Clear all note data
  clearNotes: () => {
    LocalStorage.removeItem(LOCAL_STORAGE_KEYS.NOTES);
    LocalStorage.removeItem(LOCAL_STORAGE_KEYS.NOTES_UI_STATE);
  },
};

/**
 * Pomodoro-specific local storage operations
 */
export const PomodoroStorage = {
  // Save pomodoro state to local storage
  savePomodoroState: (pomodoroState) => {
    const stateToSave = {
      currentPhase: pomodoroState.currentPhase,
      timeRemaining: pomodoroState.timeRemaining,
      currentSession: pomodoroState.currentSession,
      completedSessions: pomodoroState.completedSessions,
      workDuration: pomodoroState.workDuration,
      shortBreakDuration: pomodoroState.shortBreakDuration,
      longBreakDuration: pomodoroState.longBreakDuration,
      sessionsUntilLongBreak: pomodoroState.sessionsUntilLongBreak,
      activeTaskId: pomodoroState.activeTaskId,
      autoStartBreaks: pomodoroState.autoStartBreaks,
      autoStartWork: pomodoroState.autoStartWork,
      soundEnabled: pomodoroState.soundEnabled,
      todayStats: pomodoroState.todayStats,
      pomodoroHistory: pomodoroState.pomodoroHistory,
    };
    return LocalStorage.setItem(LOCAL_STORAGE_KEYS.POMODORO, stateToSave);
  },

  // Load pomodoro state from local storage
  loadPomodoroState: () => {
    return LocalStorage.getItem(LOCAL_STORAGE_KEYS.POMODORO, {});
  },

  // Save pomodoro UI state
  savePomodoroUIState: (uiState) => {
    return LocalStorage.setItem(LOCAL_STORAGE_KEYS.POMODORO_UI_STATE, uiState);
  },

  // Load pomodoro UI state
  loadPomodoroUIState: () => {
    return LocalStorage.getItem(LOCAL_STORAGE_KEYS.POMODORO_UI_STATE, {
      showPomodoroPanel: false,
    });
  },

  // Clear all pomodoro data
  clearPomodoro: () => {
    LocalStorage.removeItem(LOCAL_STORAGE_KEYS.POMODORO);
    LocalStorage.removeItem(LOCAL_STORAGE_KEYS.POMODORO_UI_STATE);
  },
};

/**
 * User preferences local storage operations
 */
export const UserPreferencesStorage = {
  // Save user preferences
  savePreferences: (preferences) => {
    return LocalStorage.setItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  // Load user preferences
  loadPreferences: () => {
    return LocalStorage.getItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES, {
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
 * App state local storage operations
 */
export const AppStateStorage = {
  // Save entire app state
  saveAppState: (state) => {
    const stateToSave = {
      tasks: state.tasks,
      notes: state.notes,
      pomodoro: state.pomodoro,
      // Add other slices here as the app grows
      lastSaved: new Date().toISOString(),
    };
    return LocalStorage.setItem(LOCAL_STORAGE_KEYS.APP_STATE, stateToSave);
  },

  // Load entire app state
  loadAppState: () => {
    return LocalStorage.getItem(LOCAL_STORAGE_KEYS.APP_STATE, null);
  },

  // Clear app state
  clearAppState: () => {
    return LocalStorage.removeItem(LOCAL_STORAGE_KEYS.APP_STATE);
  },
};

export { LOCAL_STORAGE_KEYS };

// For backward compatibility, keep the old exports but using localStorage
export const SessionStorage = LocalStorage;
export const SESSION_STORAGE_KEYS = LOCAL_STORAGE_KEYS;
