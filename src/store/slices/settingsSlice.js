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
    setBackgroundImage: (state, action) => {
      state.backgroundImage = action.payload;
      state.useCustomBackground = action.payload !== null;
      // Save to localStorage
      localStorage.setItem('quick-look-settings', JSON.stringify(state));
    },
    setUseCustomBackground: (state, action) => {
      state.useCustomBackground = action.payload;
      if (!action.payload) {
        state.backgroundImage = null;
      }
      // Save to localStorage
      localStorage.setItem('quick-look-settings', JSON.stringify(state));
    },
    setBackgroundOpacity: (state, action) => {
      state.backgroundOpacity = action.payload;
      // Save to localStorage
      localStorage.setItem('quick-look-settings', JSON.stringify(state));
    },
    setBackgroundBlur: (state, action) => {
      state.backgroundBlur = action.payload;
      // Save to localStorage
      localStorage.setItem('quick-look-settings', JSON.stringify(state));
    },
    resetBackgroundToDefault: (state) => {
      state.backgroundImage = null;
      state.useCustomBackground = false;
      state.backgroundOpacity = 0.8;
      state.backgroundBlur = 5;
      // Save to localStorage
      localStorage.setItem('quick-look-settings', JSON.stringify(state));
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
} = settingsSlice.actions;

export default settingsSlice.reducer;
