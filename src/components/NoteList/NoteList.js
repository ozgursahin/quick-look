import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NoteItem from '../NoteItem/NoteItem';
import { deleteNoteRequest, setEditingNote } from '../../store/slices/notesSlice';
import './NoteList.css';

const NoteList = () => {
  const dispatch = useDispatch();
  const { notes, sortBy, searchQuery } = useSelector(
    (state) => state.notes
  );

  const handleNoteEdit = (note) => {
    dispatch(setEditingNote(note));
  };

  const handleNoteDelete = (noteId) => {
    dispatch(deleteNoteRequest(noteId));
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'updatedAt':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'createdAt':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  if (sortedNotes.length === 0) {
    return (
      <div className="note-list empty">
        <div className="empty-state">
          {searchQuery ? (
            <>
              <p>No notes found for "{searchQuery}"</p>
              <small>Try a different search term</small>
            </>
          ) : (
            <>
              <p>No notes to display</p>
              <small>Create a new note to get started</small>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="note-list">
      {sortedNotes.map((note) => (
        <NoteItem 
          key={note.id} 
          note={note} 
          onEdit={handleNoteEdit}
          onDelete={handleNoteDelete}
        />
      ))}
    </div>
  );
};

export default NoteList;
