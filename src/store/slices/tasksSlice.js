import { createSlice } from '@reduxjs/toolkit';
import { TaskStorage } from '../../utils/localStorage';

// Load initial state from session storage
const loadInitialState = () => {
  const savedTasks = TaskStorage.loadTasks();
  const savedUIState = TaskStorage.loadTasksUIState();
  
  return {
    tasks: savedTasks, // Use only saved tasks, no fallback to sample data
    loading: false,
    error: null,
    showCreatePanel: false, // Always start with panel closed
    showTasksPanel: true, // Panel is visible by default
    showCancelled: savedUIState.showCancelled,
    showCompleted: savedUIState.showCompleted,
    sortBy: savedUIState.sortBy,
    editingTask: null, // For tracking which task is being edited
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
        const updatedTask = { 
          ...state.tasks[index], 
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        
        // Set completion date when task is marked as completed
        if (action.payload.status === 'completed' && state.tasks[index].status !== 'completed') {
          updatedTask.completedAt = new Date().toISOString();
        }
        
        // Clear completion date if task is moved away from completed status
        if (action.payload.status !== 'completed' && state.tasks[index].status === 'completed') {
          delete updatedTask.completedAt;
        }
        
        state.tasks[index] = updatedTask;
      }
      state.editingTask = null;
      
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
      state.editingTask = null; // Close any editing when creating new
    },
    closeCreatePanel: (state) => {
      state.showCreatePanel = false;
    },
    toggleTasksPanel: (state) => {
      state.showTasksPanel = !state.showTasksPanel;
    },
    closeTasksPanel: (state) => {
      state.showTasksPanel = false;
      state.showCreatePanel = false;
      state.editingTask = null;
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
    
    // Edit mode actions
    setEditingTask: (state, action) => {
      state.editingTask = action.payload;
      state.showCreatePanel = false; // Close create panel when editing
    },
    cancelEditingTask: (state) => {
      state.editingTask = null;
    },
    
    // Data management actions for session storage
    clearAllTasks: (state) => {
      state.tasks = [];
      state.showCreatePanel = false;
      state.editingTask = null;
      
      // Clear session storage
      TaskStorage.clearTasks();
    },
    
    resetUIState: (state) => {
      state.showCancelled = false;
      state.showCompleted = false;
      state.sortBy = 'dueDate';
      state.showCreatePanel = false;
      state.showTasksPanel = true;
      state.editingTask = null;
      
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

    // Development/testing action to load sample data
    loadSampleData: (state) => {
      const { sampleTasks } = require('../../utils/sampleData');
      state.tasks = sampleTasks;
      state.showCreatePanel = false;
      state.showTasksPanel = true;
      
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
  setEditingTask,
  cancelEditingTask,
  clearAllTasks,
  resetUIState,
  loadTasksFromStorage,
  loadSampleData,
} = tasksSlice.actions;

export default tasksSlice.reducer;
