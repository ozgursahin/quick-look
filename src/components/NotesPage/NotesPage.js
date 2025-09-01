import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoAdd, IoClose, IoSearch, IoCloseCircle } from 'react-icons/io5';
import NoteList from '../NoteList/NoteList';
import NoteEditor from '../NoteEditor/NoteEditor';
import {
  toggleCreatePanel,
  toggleNotesPanel,
  setSortBy,
  setSearchQuery,
  clearSearch,
} from '../../store/slices/notesSlice';
import './NotesPage.css';

const NotesPage = () => {
  const dispatch = useDispatch();
  const { showCreatePanel, showNotesPanel, sortBy, editingNote, searchQuery } = useSelector(
    (state) => state.notes
  );

  const handleCreateNote = () => {
    dispatch(toggleCreatePanel());
  };

  const handleSortChange = (newSortBy) => {
    dispatch(setSortBy(newSortBy));
  };

  const handleClosePanel = () => {
    dispatch(toggleNotesPanel());
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
  };

  if (!showNotesPanel) {
    return null;
  }

  return (
    <div className="notes-panel">
      <div className="notes-header">
        <h1>Notes</h1>
        <div className="notes-controls">
          <div className="search-control">
            <div className="search-input-wrapper">
              <IoSearch size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="clear-search-btn"
                  title="Clear search"
                >
                  <IoCloseCircle size={16} />
                </button>
              )}
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleCreateNote}
            disabled={!!editingNote} // Disable when editing
          >
            <IoAdd size={16} />
            Create Note
          </button>
          <div className="sort-control">
            <span>Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="updatedAt">Last Modified</option>
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
            </select>
          </div>
          <button 
            className="btn btn-close"
            onClick={handleClosePanel}
            title="Close Notes Panel"
          >
            <IoClose size={22} />
          </button>
        </div>
      </div>

      {/* Create/Edit Note Panel */}
      {(showCreatePanel || editingNote) && <NoteEditor />}

      {/* Note List - Hide when editor is open */}
      {!(showCreatePanel || editingNote) && <NoteList />}
    </div>
  );
};

export default NotesPage;
