import { createSlice } from '@reduxjs/toolkit';
import { NoteStorage } from '../../utils/localStorage';

// Load initial state from session storage
const loadInitialState = () => {
  const savedNotes = NoteStorage.loadNotes();
  const savedUIState = NoteStorage.loadNotesUIState();
  
  return {
    notes: savedNotes, // Use only saved notes, no fallback to sample data
    loading: false,
    error: null,
    showCreatePanel: false, // Always start with panel closed
    showNotesPanel: false, // Panel is hidden by default
    sortBy: savedUIState.sortBy,
    editingNote: null, // For tracking which note is being edited
    searchQuery: '', // For search functionality
  };
};

const initialState = loadInitialState();

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // Note management actions
    createNoteRequest: (state, action) => {
      state.loading = true;
    },
    createNoteSuccess: (state, action) => {
      state.loading = false;
      const newNote = {
        id: Date.now().toString(),
        title: action.payload.title,
        content: action.payload.content || '',
        tags: action.payload.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.notes.push(newNote);
      state.showCreatePanel = false;
      
      // Save to session storage
      NoteStorage.saveNotes(state.notes);
    },
    createNoteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    updateNoteRequest: (state, action) => {
      state.loading = true;
    },
    updateNoteSuccess: (state, action) => {
      state.loading = false;
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = { 
          ...state.notes[index], 
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
      state.editingNote = null;
      
      // Save to session storage
      NoteStorage.saveNotes(state.notes);
    },
    updateNoteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    deleteNoteRequest: (state, action) => {
      state.loading = true;
    },
    deleteNoteSuccess: (state, action) => {
      state.loading = false;
      state.notes = state.notes.filter(note => note.id !== action.payload);
      
      // Save to session storage
      NoteStorage.saveNotes(state.notes);
    },
    deleteNoteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // UI actions
    toggleCreatePanel: (state) => {
      state.showCreatePanel = !state.showCreatePanel;
      state.editingNote = null; // Close any editing when creating new
    },
    closeCreatePanel: (state) => {
      state.showCreatePanel = false;
    },
    toggleNotesPanel: (state) => {
      state.showNotesPanel = !state.showNotesPanel;
    },
    closeNotesPanel: (state) => {
      state.showNotesPanel = false;
      state.showCreatePanel = false;
      state.editingNote = null;
    },
    openNotesPanel: (state) => {
      state.showNotesPanel = true;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      
      // Save UI state to session storage
      NoteStorage.saveNotesUIState({
        sortBy: state.sortBy,
      });
    },
    
    // Edit mode actions
    setEditingNote: (state, action) => {
      state.editingNote = action.payload;
      state.showCreatePanel = false; // Close create panel when editing
    },
    cancelEditingNote: (state) => {
      state.editingNote = null;
    },
    
    // Search actions
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
    },
    
    // Data management actions for session storage
    clearAllNotes: (state) => {
      state.notes = [];
      state.showCreatePanel = false;
      state.editingNote = null;
      
      // Clear session storage
      NoteStorage.clearNotes();
    },
    
    resetUIState: (state) => {
      state.sortBy = 'updatedAt';
      state.showCreatePanel = false;
      state.showNotesPanel = false;
      state.editingNote = null;
      
      // Reset UI state in session storage
      NoteStorage.saveNotesUIState({
        sortBy: 'updatedAt',
      });
    },

    loadNotesFromStorage: (state, action) => {
      state.notes = action.payload || [];
      
      // Save to session storage
      NoteStorage.saveNotes(state.notes);
    },

    // Development/testing action to load sample data
    loadSampleData: (state) => {
      const { sampleNotes } = require('../../utils/sampleData');
      state.notes = sampleNotes;
      state.showCreatePanel = false;
      state.showNotesPanel = true;
      
      // Save to session storage
      NoteStorage.saveNotes(state.notes);
    },
  },
});

export const {
  createNoteRequest,
  createNoteSuccess,
  createNoteFailure,
  updateNoteRequest,
  updateNoteSuccess,
  updateNoteFailure,
  deleteNoteRequest,
  deleteNoteSuccess,
  deleteNoteFailure,
  toggleCreatePanel,
  closeCreatePanel,
  toggleNotesPanel,
  closeNotesPanel,
  openNotesPanel,
  setSortBy,
  setEditingNote,
  cancelEditingNote,
  setSearchQuery,
  clearSearch,
  clearAllNotes,
  resetUIState,
  loadNotesFromStorage,
  loadSampleData,
} = notesSlice.actions;

export default notesSlice.reducer;
