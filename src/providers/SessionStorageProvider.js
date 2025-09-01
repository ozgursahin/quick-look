import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { SessionStorage, AppStateStorage } from '../utils/localStorage';

const SessionStorageContext = createContext();

/**
 * Local Storage Provider Component
 * Provides local storage functionality throughout the app (named SessionStorage for backward compatibility)
 */
export const SessionStorageProvider = ({ children }) => {
  const appState = useSelector((state) => state);

  // Auto-save to local storage on state changes
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (SessionStorage.isAvailable()) {
        AppStateStorage.saveAppState(appState);
      }
    }, 500); // Debounce saves

    return () => clearTimeout(saveTimeout);
  }, [appState]);

  // Local storage operations (kept as sessionStorageAPI for backward compatibility)
  const sessionStorageAPI = {
    // Check if local storage is available
    isAvailable: useCallback(() => {
      return SessionStorage.isAvailable();
    }, []),

    // Save current app state
    saveAppState: useCallback(() => {
      return AppStateStorage.saveAppState(appState);
    }, [appState]),

    // Load app state
    loadAppState: useCallback(() => {
      return AppStateStorage.loadAppState();
    }, []),

    // Clear all storage
    clearAllStorage: useCallback(() => {
      return SessionStorage.clear();
    }, []),

    // Generic storage operations
    setItem: useCallback((key, value) => {
      return SessionStorage.setItem(key, value);
    }, []),

    getItem: useCallback((key, defaultValue) => {
      return SessionStorage.getItem(key, defaultValue);
    }, []),

    removeItem: useCallback((key) => {
      return SessionStorage.removeItem(key);
    }, []),
  };

  return (
    <SessionStorageContext.Provider value={sessionStorageAPI}>
      {children}
    </SessionStorageContext.Provider>
  );
};

/**
 * Custom hook to use session storage context
 */
export const useSessionStorageContext = () => {
  const context = useContext(SessionStorageContext);
  if (!context) {
    throw new Error('useSessionStorageContext must be used within a SessionStorageProvider');
  }
  return context;
};

export default SessionStorageProvider;
