import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage
const loadInitialState = () => {
  try {
    const savedSettings = localStorage.getItem('quick-look-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return {
        showSettingsPanel: false,
        backgroundImage: parsed.backgroundImage || null,
        useCustomBackground: parsed.useCustomBackground || false,
        backgroundOpacity: parsed.backgroundOpacity || 0.8,
        backgroundBlur: parsed.backgroundBlur || 5,
        uploadLoading: false,
        uploadError: null,
        ...parsed
      };
    }
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
  }
  
  return {
    showSettingsPanel: false,
    backgroundImage: null,
    useCustomBackground: false,
    backgroundOpacity: 0.8,
    backgroundBlur: 5,
    uploadLoading: false,
    uploadError: null,
  };
};

const initialState = loadInitialState();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    openSettingsPanel: (state) => {
      state.showSettingsPanel = true;
    },
    closeSettingsPanel: (state) => {
      state.showSettingsPanel = false;
    },
    toggleSettingsPanel: (state) => {
      state.showSettingsPanel = !state.showSettingsPanel;
    },
    setUseCustomBackground: (state, action) => {
      state.useCustomBackground = action.payload;
      // Save to localStorage with compression-safe data
      try {
        const settingsToSave = {
          backgroundImage: state.backgroundImage,
          useCustomBackground: state.useCustomBackground,
          backgroundOpacity: state.backgroundOpacity,
          backgroundBlur: state.backgroundBlur,
        };
        localStorage.setItem('quick-look-settings', JSON.stringify(settingsToSave));
      } catch (error) {
        console.error('Error saving settings:', error);
        // If localStorage fails, continue without saving
      }
    },
    setBackgroundOpacity: (state, action) => {
      state.backgroundOpacity = action.payload;
      // Save to localStorage
      try {
        const settingsToSave = {
          backgroundImage: state.backgroundImage,
          useCustomBackground: state.useCustomBackground,
          backgroundOpacity: state.backgroundOpacity,
          backgroundBlur: state.backgroundBlur,
        };
        localStorage.setItem('quick-look-settings', JSON.stringify(settingsToSave));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    },
    setBackgroundBlur: (state, action) => {
      state.backgroundBlur = action.payload;
      // Save to localStorage
      try {
        const settingsToSave = {
          backgroundImage: state.backgroundImage,
          useCustomBackground: state.useCustomBackground,
          backgroundOpacity: state.backgroundOpacity,
          backgroundBlur: state.backgroundBlur,
        };
        localStorage.setItem('quick-look-settings', JSON.stringify(settingsToSave));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    },
    resetBackgroundToDefault: (state) => {
      state.backgroundImage = null;
      state.useCustomBackground = false;
      state.backgroundOpacity = 0.8;
      state.backgroundBlur = 5;
      // Save to localStorage
      try {
        const settingsToSave = {
          backgroundImage: null,
          useCustomBackground: false,
          backgroundOpacity: 0.8,
          backgroundBlur: 5,
        };
        localStorage.setItem('quick-look-settings', JSON.stringify(settingsToSave));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    },
    clearUploadError: (state) => {
      state.uploadError = null;
    },
    setUploadLoading: (state, action) => {
      state.uploadLoading = action.payload;
    },
    setUploadError: (state, action) => {
      state.uploadError = action.payload;
      state.uploadLoading = false;
    },
    setBackgroundImage: (state, action) => {
      state.backgroundImage = action.payload;
      state.useCustomBackground = action.payload !== null;
      state.uploadLoading = false;
      state.uploadError = null;
      // Save to localStorage with error handling
      try {
        const settingsToSave = {
          backgroundImage: state.backgroundImage,
          useCustomBackground: state.useCustomBackground,
          backgroundOpacity: state.backgroundOpacity,
          backgroundBlur: state.backgroundBlur,
        };
        localStorage.setItem('quick-look-settings', JSON.stringify(settingsToSave));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        state.uploadError = 'Settings saved for this session only (storage limit reached)';
      }
    },
  },
});

export const {
  openSettingsPanel,
  closeSettingsPanel,
  toggleSettingsPanel,
  setBackgroundImage,
  setUseCustomBackground,
  setBackgroundOpacity,
  setBackgroundBlur,
  resetBackgroundToDefault,
  clearUploadError,
  setUploadLoading,
  setUploadError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
