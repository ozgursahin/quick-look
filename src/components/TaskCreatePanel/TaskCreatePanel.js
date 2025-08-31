import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTaskRequest, closeCreatePanel } from '../../store/slices/tasksSlice';
import { SessionStorage } from '../../utils/sessionStorage';
import './TaskCreatePanel.css';

const DRAFT_KEY = 'quick-look-task-draft';

const TaskCreatePanel = () => {
  const dispatch = useDispatch();
  
  // Load draft from session storage on component mount
  const [taskName, setTaskName] = useState(() => {
    const draft = SessionStorage.getItem(DRAFT_KEY, {});
    return draft.taskName || '';
  });
  
  const [dueDate, setDueDate] = useState(() => {
    const draft = SessionStorage.getItem(DRAFT_KEY, {});
    return draft.dueDate || '';
  });
  
  const [description, setDescription] = useState(() => {
    const draft = SessionStorage.getItem(DRAFT_KEY, {});
    return draft.description || '';
  });

  // Save draft to session storage whenever form data changes
  useEffect(() => {
    const draft = {
      taskName: taskName.trim(),
      dueDate,
      description: description.trim(),
      lastModified: new Date().toISOString(),
    };
    
    // Only save if there's actual content
    if (taskName.trim() || dueDate || description.trim()) {
      SessionStorage.setItem(DRAFT_KEY, draft);
    }
  }, [taskName, dueDate, description]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim() && dueDate) {
      dispatch(createTaskRequest({
        name: taskName.trim(),
        dueDate: dueDate,
        description: description.trim(),
      }));
      
      // Clear draft and form
      clearDraft();
    }
  };

  const handleCancel = () => {
    dispatch(closeCreatePanel());
    clearDraft();
  };

  const clearDraft = () => {
    setTaskName('');
    setDueDate('');
    setDescription('');
    SessionStorage.removeItem(DRAFT_KEY);
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="task-create-panel">
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              placeholder="Due Date (Date Picker)"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input date-picker"
              min={today}
              required
            />
          </div>
        </div>
        
        {/* Description/Notes area */}
        <div className="form-group">
          <textarea
            placeholder="Task description or notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            rows={6}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-create"
            disabled={!taskName.trim() || !dueDate}
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreatePanel;
