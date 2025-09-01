import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  SessionStorage, 
  TaskStorage, 
  UserPreferencesStorage, 
  AppStateStorage 
} from '../utils/localStorage';
import { clearAllTasks, resetUIState } from '../store/slices/tasksSlice';

/**
 * Master session storage hook for the entire application
 * This hook provides all session storage functionality needed across the app
 */
export const useAppSessionStorage = () => {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state);

  // Check if session storage is available
  const isAvailable = useCallback(() => {
    return SessionStorage.isAvailable();
  }, []);

  // Auto-save current state
  const saveCurrentState = useCallback(() => {
    if (isAvailable()) {
      return AppStateStorage.saveAppState(appState);
    }
    return false;
  }, [appState, isAvailable]);

  // Load previously saved state
  const loadSavedState = useCallback(() => {
    if (isAvailable()) {
      return AppStateStorage.loadAppState();
    }
    return null;
  }, [isAvailable]);

  // Clear all application data
  const clearAllData = useCallback(() => {
    if (isAvailable()) {
      SessionStorage.clear();
      dispatch(clearAllTasks());
      dispatch(resetUIState());
      return true;
    }
    return false;
  }, [isAvailable, dispatch]);

  // Export application data
  const exportData = useCallback(() => {
    if (isAvailable()) {
      const data = {
        tasks: TaskStorage.loadTasks(),
        tasksUIState: TaskStorage.loadTasksUIState(),
        userPreferences: UserPreferencesStorage.loadPreferences(),
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };
      return data;
    }
    return null;
  }, [isAvailable]);

  // Import application data
  const importData = useCallback((data) => {
    if (isAvailable() && data) {
      try {
        // Validate data structure
        if (data.tasks && Array.isArray(data.tasks)) {
          TaskStorage.saveTasks(data.tasks);
        }
        if (data.tasksUIState) {
          TaskStorage.saveTasksUIState(data.tasksUIState);
        }
        if (data.userPreferences) {
          UserPreferencesStorage.savePreferences(data.userPreferences);
        }
        
        // Reload the page to apply imported data
        window.location.reload();
        return true;
      } catch (error) {
        console.error('Error importing data:', error);
        return false;
      }
    }
    return false;
  }, [isAvailable]);

  // Get storage usage info
  const getStorageInfo = useCallback(() => {
    if (!isAvailable()) {
      return { available: false };
    }

    const info = {
      available: true,
      tasks: TaskStorage.loadTasks().length,
      lastSaved: AppStateStorage.loadAppState()?.lastSaved || 'Never',
      storageKeys: Object.keys(sessionStorage).filter(key => 
        key.startsWith('quick-look-')
      ),
      totalStorageSize: JSON.stringify(sessionStorage).length,
      hasDraft: !!SessionStorage.getItem('quick-look-task-draft'),
    };

    return info;
  }, [isAvailable]);

  // Create backup of all data
  const createBackup = useCallback(() => {
    if (!isAvailable()) return null;

    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: exportData(),
    };

    SessionStorage.setItem('quick-look-backup', backup);
    return backup;
  }, [isAvailable, exportData]);

  // Restore from backup
  const restoreFromBackup = useCallback(() => {
    const backup = SessionStorage.getItem('quick-look-backup');
    if (backup?.data) {
      return importData(backup.data);
    }
    return false;
  }, [importData]);

  // Cleanup old data
  const cleanupOldData = useCallback(() => {
    if (!isAvailable()) return { cleaned: false };

    const results = { cleaned: true, removedItems: [] };

    // Remove old drafts (older than 7 days)
    const draft = SessionStorage.getItem('quick-look-task-draft');
    if (draft?.lastModified) {
      const draftAge = Date.now() - new Date(draft.lastModified).getTime();
      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      
      if (draftAge > weekInMs) {
        SessionStorage.removeItem('quick-look-task-draft');
        results.removedItems.push('old-task-draft');
      }
    }

    return results;
  }, [isAvailable]);

  return {
    // Core functionality
    isAvailable,
    saveCurrentState,
    loadSavedState,
    clearAllData,
    
    // Data management
    exportData,
    importData,
    getStorageInfo,
    
    // Backup and maintenance
    createBackup,
    restoreFromBackup,
    cleanupOldData,
    
    // Direct access to storage APIs
    sessionStorage: SessionStorage,
    taskStorage: TaskStorage,
    userPreferencesStorage: UserPreferencesStorage,
    appStateStorage: AppStateStorage,
  };
};

/**
 * Hook for automatically syncing component state with session storage
 * Perfect for form inputs, user preferences, etc.
 */
export const useSessionStorageState = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return SessionStorage.getItem(key, initialValue);
  });

  const updateValue = useCallback((newValue) => {
    setValue(newValue);
    SessionStorage.setItem(key, newValue);
  }, [key]);

  return [value, updateValue];
};
