import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { IoDocument, IoTime } from 'react-icons/io5';
import './NoteItem.css';

const NoteItem = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleEdit = () => {
    onEdit(note);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the note "${note.title}"?`)) {
      onDelete(note.id);
    }
  };

  return (
    <div className="note-item">
      <div className="note-header">
        <div className="note-icon">
          <IoDocument size={16} />
        </div>
        <div className="note-title">{note.title}</div>
        <div className="note-actions">
          <button 
            className="action-btn edit-btn"
            onClick={handleEdit}
            title="Edit note"
          >
            <FaEdit size={12} />
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={handleDelete}
            title="Delete note"
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>
      
      {note.content && (
        <div className="note-content">
          {truncateContent(note.content)}
        </div>
      )}
      
      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag, index) => (
            <span key={index} className="note-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="note-footer">
        <div className="note-dates">
          <span className="note-date">
            <IoTime size={12} />
            Modified: {formatDate(note.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
