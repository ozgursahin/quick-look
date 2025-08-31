/**
 * Feature Integration Utilities
 * Helper functions to easily add new features with session storage support
 */

import { SessionStorage } from './sessionStorage';

/**
 * Creates a new feature storage utility
 * @param {string} featureName - Name of the feature (e.g., 'notes', 'calendar')
 * @param {*} defaultValue - Default value for the feature data
 * @returns {Object} Storage utility object for the feature
 */
export const createFeatureStorage = (featureName, defaultValue = []) => {
  const storageKey = `quick-look-${featureName}`;
  const uiStateKey = `quick-look-${featureName}-ui-state`;

  return {
    // Save feature data
    saveData: (data) => {
      return SessionStorage.setItem(storageKey, data);
    },

    // Load feature data
    loadData: () => {
      return SessionStorage.getItem(storageKey, defaultValue);
    },

    // Save feature UI state
    saveUIState: (uiState) => {
      return SessionStorage.setItem(uiStateKey, uiState);
    },

    // Load feature UI state
    loadUIState: (defaultUIState = {}) => {
      return SessionStorage.getItem(uiStateKey, defaultUIState);
    },

    // Clear feature data
    clearData: () => {
      SessionStorage.removeItem(storageKey);
      SessionStorage.removeItem(uiStateKey);
    },

    // Get storage keys for this feature
    getStorageKeys: () => ({
      data: storageKey,
      uiState: uiStateKey,
    }),
  };
};

/**
 * Creates a Redux slice template with session storage integration
 * @param {string} featureName - Name of the feature
 * @param {*} initialState - Initial state for the slice
 * @param {Object} customReducers - Custom reducers for the feature
 * @returns {Object} Redux slice configuration
 */
export const createFeatureSliceWithStorage = (featureName, initialState, customReducers = {}) => {
  const featureStorage = createFeatureStorage(featureName);

  // Load initial state from session storage
  const loadInitialState = () => {
    const savedData = featureStorage.loadData();
    const savedUIState = featureStorage.loadUIState();

    return {
      ...initialState,
      data: savedData,
      ...savedUIState,
    };
  };

  const baseReducers = {
    // Standard CRUD operations with session storage
    [`create${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Success`]: (state, action) => {
      if (Array.isArray(state.data)) {
        state.data.push({
          id: Date.now().toString(),
          ...action.payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        state.data = {
          ...state.data,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
      
      featureStorage.saveData(state.data);
    },

    [`update${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Success`]: (state, action) => {
      if (Array.isArray(state.data)) {
        const index = state.data.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            ...action.payload,
            updatedAt: new Date().toISOString(),
          };
        }
      } else {
        state.data = {
          ...state.data,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
      
      featureStorage.saveData(state.data);
    },

    [`delete${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Success`]: (state, action) => {
      if (Array.isArray(state.data)) {
        state.data = state.data.filter(item => item.id !== action.payload);
        featureStorage.saveData(state.data);
      }
    },

    // Clear all data for this feature
    [`clear${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Data`]: (state) => {
      if (Array.isArray(state.data)) {
        state.data = [];
      } else {
        state.data = initialState.data;
      }
      featureStorage.clearData();
    },
  };

  return {
    name: featureName,
    initialState: loadInitialState(),
    reducers: {
      ...baseReducers,
      ...customReducers,
    },
    featureStorage,
  };
};

/**
 * Example usage for future features:
 * 
 * // For a Notes feature:
 * const notesSliceConfig = createFeatureSliceWithStorage('notes', {
 *   data: [],
 *   loading: false,
 *   showCreatePanel: false,
 * }, {
 *   // Custom reducers specific to notes
 *   toggleNotesPanel: (state) => {
 *     state.showCreatePanel = !state.showCreatePanel;
 *   }
 * });
 * 
 * // For a Calendar feature:
 * const calendarSliceConfig = createFeatureSliceWithStorage('calendar', {
 *   data: {},
 *   currentView: 'month',
 *   selectedDate: null,
 * });
 */

/**
 * Utility to check storage health across all features
 */
export const checkStorageHealth = () => {
  const health = {
    isHealthy: true,
    issues: [],
    recommendations: [],
    storageUsage: {},
  };

  // Check if session storage is available
  if (!SessionStorage.isAvailable()) {
    health.isHealthy = false;
    health.issues.push('Session storage is not available');
    return health;
  }

  // Check storage usage
  let totalSize = 0;
  const keys = Object.keys(sessionStorage);
  
  keys.forEach(key => {
    if (key.startsWith('quick-look-')) {
      const size = new Blob([sessionStorage.getItem(key)]).size;
      health.storageUsage[key] = `${Math.round(size / 1024)} KB`;
      totalSize += size;
    }
  });

  health.storageUsage.total = `${Math.round(totalSize / 1024)} KB`;

  // Check for issues
  if (totalSize > 5 * 1024 * 1024) { // 5MB
    health.recommendations.push('Consider cleaning up old data - storage is getting large');
  }

  if (keys.length > 20) {
    health.recommendations.push('Too many storage keys - consider consolidation');
  }

  return health;
};

const featureIntegrationUtils = {
  createFeatureStorage,
  createFeatureSliceWithStorage,
  checkStorageHealth,
};

export default featureIntegrationUtils;
