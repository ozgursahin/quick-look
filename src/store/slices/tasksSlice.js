import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [
    {
      id: '1',
      name: 'Clean the house',
      status: 'waiting',
      dueDate: '2025-08-28',
    },
    {
      id: '2',
      name: 'Clean the house',
      status: 'completed',
      dueDate: '2025-08-29',
    },
    {
      id: '3',
      name: 'Clean the house',
      status: 'cancelled',
      dueDate: '2025-08-30',
    },
  ],
  loading: false,
  error: null,
  showCreatePanel: false,
  showCancelled: false,
  showCompleted: false,
  sortBy: 'dueDate',
};

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
      state.tasks.push({
        id: Date.now().toString(),
        ...action.payload,
        status: 'waiting',
      });
      state.showCreatePanel = false;
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
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
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
    toggleShowCancelled: (state) => {
      state.showCancelled = !state.showCancelled;
    },
    toggleShowCompleted: (state) => {
      state.showCompleted = !state.showCompleted;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
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
  toggleShowCancelled,
  toggleShowCompleted,
  setSortBy,
} = tasksSlice.actions;

export default tasksSlice.reducer;
