import { createSlice } from '@reduxjs/toolkit';
import { PomodoroStorage } from '../../utils/localStorage';

// Pomodoro phase types
export const POMODORO_PHASES = {
  WORK: 'work',
  SHORT_BREAK: 'short_break',
  LONG_BREAK: 'long_break',
  IDLE: 'idle'
};

// Default durations in minutes
export const DEFAULT_DURATIONS = {
  work: 25,
  shortBreak: 5,
  longBreak: 15
};

// Load initial state from session storage
const loadInitialState = () => {
  const savedPomodoro = PomodoroStorage.loadPomodoroState();
  const savedUIState = PomodoroStorage.loadPomodoroUIState();
  
  return {
    // Timer state
    currentPhase: savedPomodoro.currentPhase || POMODORO_PHASES.WORK,
    isRunning: false, // Always start paused on app load
    timeRemaining: savedPomodoro.timeRemaining || DEFAULT_DURATIONS.work * 60, // in seconds
    currentSession: savedPomodoro.currentSession || 1,
    completedSessions: savedPomodoro.completedSessions || 0,
    
    // Configuration
    workDuration: savedPomodoro.workDuration || DEFAULT_DURATIONS.work,
    shortBreakDuration: savedPomodoro.shortBreakDuration || DEFAULT_DURATIONS.shortBreak,
    longBreakDuration: savedPomodoro.longBreakDuration || DEFAULT_DURATIONS.longBreak,
    sessionsUntilLongBreak: savedPomodoro.sessionsUntilLongBreak || 4,
    
    // Task integration
    activeTaskId: savedPomodoro.activeTaskId || null,
    
    // UI state
    showPomodoroPanel: savedUIState.showPomodoroPanel || false,
    autoStartBreaks: savedPomodoro.autoStartBreaks || false,
    autoStartWork: savedPomodoro.autoStartWork || false,
    soundEnabled: savedPomodoro.soundEnabled || true,
    
    // Statistics
    todayStats: savedPomodoro.todayStats || {
      date: new Date().toDateString(),
      completedPomodoros: 0,
      totalFocusTime: 0, // in minutes
      completedTasks: 0
    },
    
    // History
    pomodoroHistory: savedPomodoro.pomodoroHistory || [],
    
    loading: false,
    error: null,
  };
};

const initialState = loadInitialState();

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    // Timer controls
    startTimer: (state) => {
      state.isRunning = true;
      state.error = null;
      
      // If starting from IDLE, transition to WORK
      if (state.currentPhase === POMODORO_PHASES.IDLE) {
        state.currentPhase = POMODORO_PHASES.WORK;
        state.timeRemaining = state.workDuration * 60;
      }
      
      // Create history entry when starting a new work session
      if (state.currentPhase === POMODORO_PHASES.WORK && state.timeRemaining === state.workDuration * 60) {
        const historyEntry = {
          id: Date.now().toString(),
          type: 'work',
          startedAt: new Date().toISOString(),
          taskId: state.activeTaskId,
          duration: state.workDuration,
          completed: false
        };
        state.pomodoroHistory.push(historyEntry);
      }
      
      PomodoroStorage.savePomodoroState(state);
    },
    
    pauseTimer: (state) => {
      state.isRunning = false;
      PomodoroStorage.savePomodoroState(state);
    },
    
    resetTimer: (state) => {
      state.isRunning = false;
      const duration = getDurationForPhase(state.currentPhase, state);
      state.timeRemaining = duration * 60;
      
      // Remove incomplete history entry if resetting during work session
      if (state.currentPhase === POMODORO_PHASES.WORK && state.pomodoroHistory.length > 0) {
        const lastEntry = state.pomodoroHistory[state.pomodoroHistory.length - 1];
        if (!lastEntry.completed && lastEntry.type === 'work') {
          state.pomodoroHistory.pop();
        }
      }
      
      PomodoroStorage.savePomodoroState(state);
    },
    
    tick: (state) => {
      if (state.isRunning && state.timeRemaining > 0) {
        state.timeRemaining -= 1;
        
        // Auto-save state every 10 seconds
        if (state.timeRemaining % 10 === 0) {
          PomodoroStorage.savePomodoroState(state);
        }
      }
    },
    
    completePhase: (state) => {
      state.isRunning = false;
      
      if (state.currentPhase === POMODORO_PHASES.WORK) {
        // Complete work session
        state.completedSessions += 1;
        state.todayStats.completedPomodoros += 1;
        state.todayStats.totalFocusTime += state.workDuration;
        
        // Mark history entry as completed
        if (state.pomodoroHistory.length > 0) {
          const lastEntry = state.pomodoroHistory[state.pomodoroHistory.length - 1];
          if (!lastEntry.completed && lastEntry.type === 'work') {
            lastEntry.completed = true;
            lastEntry.completedAt = new Date().toISOString();
          }
        }
        
        // Determine next break type - FIXED LOGIC
        // After 4 completed work sessions, take a long break
        const shouldTakeLongBreak = state.completedSessions % state.sessionsUntilLongBreak === 0;
        console.log(`🍅 Completed work session #${state.completedSessions}. Should take long break: ${shouldTakeLongBreak}`);
        state.currentPhase = shouldTakeLongBreak ? POMODORO_PHASES.LONG_BREAK : POMODORO_PHASES.SHORT_BREAK;
        
        const breakDuration = shouldTakeLongBreak ? state.longBreakDuration : state.shortBreakDuration;
        state.timeRemaining = breakDuration * 60;
        
        // Auto-start break if enabled
        if (state.autoStartBreaks) {
          state.isRunning = true;
        }
      } else {
        // Complete break session
        state.currentPhase = POMODORO_PHASES.WORK;
        state.currentSession += 1;
        state.timeRemaining = state.workDuration * 60;
        
        // Auto-start work if enabled
        if (state.autoStartWork) {
          state.isRunning = true;
        }
      }
      
      PomodoroStorage.savePomodoroState(state);
    },
    
    skipPhase: (state) => {
      state.isRunning = false;
      
      if (state.currentPhase === POMODORO_PHASES.IDLE) {
        // From IDLE, skip to WORK phase
        state.currentPhase = POMODORO_PHASES.WORK;
        state.timeRemaining = state.workDuration * 60;
      } else if (state.currentPhase === POMODORO_PHASES.WORK) {
        // Skip work session - don't count as completed
        // Use current completed sessions to determine break type
        const shouldTakeLongBreak = state.completedSessions > 0 && state.completedSessions % state.sessionsUntilLongBreak === 0;
        state.currentPhase = shouldTakeLongBreak ? POMODORO_PHASES.LONG_BREAK : POMODORO_PHASES.SHORT_BREAK;
        
        const breakDuration = shouldTakeLongBreak ? state.longBreakDuration : state.shortBreakDuration;
        state.timeRemaining = breakDuration * 60;
        
        // Remove incomplete history entry if skipping during work session
        if (state.pomodoroHistory.length > 0) {
          const lastEntry = state.pomodoroHistory[state.pomodoroHistory.length - 1];
          if (!lastEntry.completed && lastEntry.type === 'work') {
            state.pomodoroHistory.pop();
          }
        }
      } else {
        // Skip break session
        state.currentPhase = POMODORO_PHASES.WORK;
        state.currentSession += 1;
        state.timeRemaining = state.workDuration * 60;
      }
      
      PomodoroStorage.savePomodoroState(state);
    },
    
    // Complete current session immediately (before timer ends)
    completeSession: (state) => {
      if (state.currentPhase === POMODORO_PHASES.IDLE) {
        // From IDLE, start the first work session
        state.currentPhase = POMODORO_PHASES.WORK;
        state.timeRemaining = state.workDuration * 60;
      } else {
        // Force complete the current phase
        pomodoroSlice.caseReducers.completePhase(state);
      }
    },
    
    // Reset all Pomodoro data to clean state
    resetAllPomodoro: (state) => {
      state.currentPhase = POMODORO_PHASES.WORK;
      state.isRunning = false;
      state.timeRemaining = state.workDuration * 60;
      state.currentSession = 1;
      state.completedSessions = 0;
      state.activeTaskId = null;
      state.pomodoroHistory = [];
      state.todayStats = {
        date: new Date().toDateString(),
        completedPomodoros: 0,
        totalFocusTime: 0,
        completedTasks: 0
      };
      
      PomodoroStorage.savePomodoroState(state);
    },
    
    // Task integration
    setActiveTask: (state, action) => {
      state.activeTaskId = action.payload;
      PomodoroStorage.savePomodoroState(state);
    },
    
    clearActiveTask: (state) => {
      state.activeTaskId = null;
      PomodoroStorage.savePomodoroState(state);
    },
    
    // Configuration
    updateSettings: (state, action) => {
      const { 
        workDuration, 
        shortBreakDuration, 
        longBreakDuration, 
        sessionsUntilLongBreak,
        autoStartBreaks,
        autoStartWork,
        soundEnabled
      } = action.payload;
      
      if (workDuration !== undefined) state.workDuration = workDuration;
      if (shortBreakDuration !== undefined) state.shortBreakDuration = shortBreakDuration;
      if (longBreakDuration !== undefined) state.longBreakDuration = longBreakDuration;
      if (sessionsUntilLongBreak !== undefined) state.sessionsUntilLongBreak = sessionsUntilLongBreak;
      if (autoStartBreaks !== undefined) state.autoStartBreaks = autoStartBreaks;
      if (autoStartWork !== undefined) state.autoStartWork = autoStartWork;
      if (soundEnabled !== undefined) state.soundEnabled = soundEnabled;
      
      // If we're in idle or work state with full timer, update the timer to match new work duration
      if (state.currentPhase === POMODORO_PHASES.IDLE || 
          (state.currentPhase === POMODORO_PHASES.WORK && state.timeRemaining === state.workDuration * 60)) {
        state.timeRemaining = state.workDuration * 60;
      }
      
      PomodoroStorage.savePomodoroState(state);
    },
    
    // UI actions
    togglePomodoroPanel: (state) => {
      state.showPomodoroPanel = !state.showPomodoroPanel;
      
      PomodoroStorage.savePomodoroUIState({
        showPomodoroPanel: state.showPomodoroPanel,
      });
    },
    
    closePomodoroPanel: (state) => {
      state.showPomodoroPanel = false;
      
      PomodoroStorage.savePomodoroUIState({
        showPomodoroPanel: state.showPomodoroPanel,
      });
    },
    
    openPomodoroPanel: (state) => {
      state.showPomodoroPanel = true;
      
      PomodoroStorage.savePomodoroUIState({
        showPomodoroPanel: state.showPomodoroPanel,
      });
    },
    
    // Data management
    resetDailyStats: (state) => {
      const today = new Date().toDateString();
      if (state.todayStats.date !== today) {
        state.todayStats = {
          date: today,
          completedPomodoros: 0,
          totalFocusTime: 0,
          completedTasks: 0
        };
      }
      
      PomodoroStorage.savePomodoroState(state);
    },
    
    clearPomodoroHistory: (state) => {
      state.pomodoroHistory = [];
      PomodoroStorage.savePomodoroState(state);
    },
    
    resetPomodoro: (state) => {
      state.currentPhase = POMODORO_PHASES.WORK;
      state.isRunning = false;
      state.timeRemaining = state.workDuration * 60;
      state.currentSession = 1;
      state.activeTaskId = null;
      
      PomodoroStorage.savePomodoroState(state);
    },
    
    // Load data from storage
    loadPomodoroFromStorage: (state, action) => {
      const savedState = action.payload || {};
      Object.assign(state, savedState);
    },
  },
});

// Helper function to get duration for current phase
function getDurationForPhase(phase, state) {
  switch (phase) {
    case POMODORO_PHASES.WORK:
      return state.workDuration;
    case POMODORO_PHASES.SHORT_BREAK:
      return state.shortBreakDuration;
    case POMODORO_PHASES.LONG_BREAK:
      return state.longBreakDuration;
    default:
      return state.workDuration;
  }
}

export const {
  startTimer,
  pauseTimer,
  resetTimer,
  tick,
  completePhase,
  skipPhase,
  completeSession,
  resetAllPomodoro,
  setActiveTask,
  clearActiveTask,
  updateSettings,
  togglePomodoroPanel,
  closePomodoroPanel,
  openPomodoroPanel,
  resetDailyStats,
  clearPomodoroHistory,
  resetPomodoro,
  loadPomodoroFromStorage,
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
