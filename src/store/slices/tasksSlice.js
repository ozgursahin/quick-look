import { createSlice } from '@reduxjs/toolkit';
import { TaskStorage } from '../../utils/sessionStorage';
import { sampleTasks, initializeSampleData } from '../../utils/sampleData';

// Load initial state from session storage
const loadInitialState = () => {
  // Initialize sample data if session storage is empty
  initializeSampleData();
  
  const savedTasks = TaskStorage.loadTasks();
  const savedUIState = TaskStorage.loadTasksUIState();
  
  return {
    tasks: savedTasks.length > 0 ? savedTasks : sampleTasks,
    loading: false,
    error: null,
    showCreatePanel: false, // Always start with panel closed
    showTasksPanel: true, // Panel is visible by default
    showCancelled: savedUIState.showCancelled,
    showCompleted: savedUIState.showCompleted,
    sortBy: savedUIState.sortBy,
  };
};

const initialState = loadInitialState();

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Task management actions
    createTaskRequest: (state, action) => {
      state.loading = true;
    },
    createTaskSuccess: (state, action) => {
      state.loading = false;
      const newTask = {
        id: Date.now().toString(),
        name: action.payload.name,
        description: action.payload.description || '',
        dueDate: action.payload.dueDate,
        status: 'waiting',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
      state.showCreatePanel = false;
      
      // Save to session storage
      TaskStorage.saveTasks(state.tasks);
    },
    createTaskFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    updateTaskRequest: (state, action) => {
      state.loading = true;
    },
    updateTaskSuccess: (state, action) => {
      state.loading = false;
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { 
          ...state.tasks[index], 
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Save to session storage
      TaskStorage.saveTasks(state.tasks);
    },
    updateTaskFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    deleteTaskRequest: (state, action) => {
      state.loading = true;
    },
    deleteTaskSuccess: (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      
      // Save to session storage
      TaskStorage.saveTasks(state.tasks);
    },
    deleteTaskFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // UI actions
    toggleCreatePanel: (state) => {
      state.showCreatePanel = !state.showCreatePanel;
    },
    closeCreatePanel: (state) => {
      state.showCreatePanel = false;
    },
    toggleTasksPanel: (state) => {
      state.showTasksPanel = !state.showTasksPanel;
    },
    closeTasksPanel: (state) => {
      state.showTasksPanel = false;
    },
    toggleShowCancelled: (state) => {
      state.showCancelled = !state.showCancelled;
      
      // Save UI state to session storage
      TaskStorage.saveTasksUIState({
        showCancelled: state.showCancelled,
        showCompleted: state.showCompleted,
        sortBy: state.sortBy,
      });
    },
    toggleShowCompleted: (state) => {
      state.showCompleted = !state.showCompleted;
      
      // Save UI state to session storage
      TaskStorage.saveTasksUIState({
        showCancelled: state.showCancelled,
        showCompleted: state.showCompleted,
        sortBy: state.sortBy,
      });
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      
      // Save UI state to session storage
      TaskStorage.saveTasksUIState({
        showCancelled: state.showCancelled,
        showCompleted: state.showCompleted,
        sortBy: state.sortBy,
      });
    },
    
    // Data management actions for session storage
    clearAllTasks: (state) => {
      state.tasks = [];
      state.showCreatePanel = false;
      
      // Clear session storage
      TaskStorage.clearTasks();
    },
    
    resetUIState: (state) => {
      state.showCancelled = false;
      state.showCompleted = false;
      state.sortBy = 'dueDate';
      state.showCreatePanel = false;
      state.showTasksPanel = true;
      
      // Reset UI state in session storage
      TaskStorage.saveTasksUIState({
        showCancelled: false,
        showCompleted: false,
        sortBy: 'dueDate',
      });
    },

    loadTasksFromStorage: (state, action) => {
      state.tasks = action.payload || [];
      
      // Save to session storage
      TaskStorage.saveTasks(state.tasks);
    },
  },
});

export const {
  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
  toggleCreatePanel,
  closeCreatePanel,
  toggleTasksPanel,
  closeTasksPanel,
  toggleShowCancelled,
  toggleShowCompleted,
  setSortBy,
  clearAllTasks,
  resetUIState,
  loadTasksFromStorage,
} = tasksSlice.actions;

export default tasksSlice.reducer;
