import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose, IoCheckmark, IoAdd, IoRemove } from 'react-icons/io5';
import { createNoteRequest, updateNoteRequest, closeCreatePanel, cancelEditingNote } from '../../store/slices/notesSlice';
import { SessionStorage } from '../../utils/localStorage';
import './NoteEditor.css';

const NOTE_DRAFT_KEY = 'quick-look-note-draft';

const NoteEditor = () => {
  const dispatch = useDispatch();
  const { editingNote } = useSelector(state => state.notes);
  const isEditing = !!editingNote;
  
  // Load draft from session storage on component mount
  const [title, setTitle] = useState(() => {
    if (isEditing) return editingNote.title;
    const draft = SessionStorage.getItem(NOTE_DRAFT_KEY, {});
    return draft.title || '';
  });
  
  const [content, setContent] = useState(() => {
    if (isEditing) return editingNote.content;
    const draft = SessionStorage.getItem(NOTE_DRAFT_KEY, {});
    return draft.content || '';
  });
  
  const [tags, setTags] = useState(() => {
    if (isEditing) return editingNote.tags || [];
    const draft = SessionStorage.getItem(NOTE_DRAFT_KEY, {});
    return draft.tags || [];
  });
  
  const [newTag, setNewTag] = useState('');

  // Save draft to session storage whenever form data changes (only when creating)
  useEffect(() => {
    if (!isEditing) {
      const draft = {
        title: title.trim(),
        content: content.trim(),
        tags,
        lastModified: new Date().toISOString(),
      };
      
      // Only save if there's actual content
      if (title.trim() || content.trim() || tags.length > 0) {
        SessionStorage.setItem(NOTE_DRAFT_KEY, draft);
      }
    }
  }, [title, content, tags, isEditing]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      if (isEditing) {
        dispatch(updateNoteRequest({
          id: editingNote.id,
          title: title.trim(),
          content: content.trim(),
          tags,
        }));
      } else {
        dispatch(createNoteRequest({
          title: title.trim(),
          content: content.trim(),
          tags,
        }));
      }
      
      // Clear draft and form
      clearDraft();
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      dispatch(cancelEditingNote());
    } else {
      dispatch(closeCreatePanel());
    }
    clearDraft();
  };

  const clearDraft = () => {
    if (!isEditing) {
      setTitle('');
      setContent('');
      setTags([]);
      setNewTag('');
      SessionStorage.removeItem(NOTE_DRAFT_KEY);
    }
  };

  return (
    <div className="note-editor">
      <div className="editor-header">
        <h3>{isEditing ? 'Edit Note' : 'Create New Note'}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input title-input"
            required
            autoFocus
          />
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Write your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea content-input"
            rows={8}
          />
        </div>
        
        {/* Tags section */}
        <div className="form-group tags-group">
          <div className="tags-header">
            <label>Tags</label>
            <div className="tag-input-container">
              <input
                type="text"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="tag-input"
              />
              <button 
                type="button"
                onClick={handleAddTag}
                className="btn btn-add-tag"
                disabled={!newTag.trim() || tags.includes(newTag.trim().toLowerCase())}
              >
                <IoAdd size={14} />
              </button>
            </div>
          </div>
          
          {tags.length > 0 && (
            <div className="tags-display">
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="tag-remove"
                  >
                    <IoRemove size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-cancel"
            onClick={handleCancel}
          >
            <IoClose size={16} />
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-save"
            disabled={!title.trim()}
          >
            <IoCheckmark size={16} />
            {isEditing ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteEditor;
