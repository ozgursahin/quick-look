import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose, IoCheckmark } from 'react-icons/io5';
import { createTaskRequest, updateTaskRequest, closeCreatePanel, cancelEditingTask } from '../../store/slices/tasksSlice';
import { SessionStorage } from '../../utils/localStorage';
import './TaskCreatePanel.css';

const DRAFT_KEY = 'quick-look-task-draft';

const TaskCreatePanel = () => {
  const dispatch = useDispatch();
  const { editingTask } = useSelector(state => state.tasks);
  const isEditing = !!editingTask;
  
  // Load draft from session storage on component mount
  const [taskName, setTaskName] = useState(() => {
    if (isEditing) return editingTask.name;
    const draft = SessionStorage.getItem(DRAFT_KEY, {});
    return draft.taskName || '';
  });
  
  const [dueDate, setDueDate] = useState(() => {
    if (isEditing) return editingTask.dueDate;
    const draft = SessionStorage.getItem(DRAFT_KEY, {});
    return draft.dueDate || '';
  });
  
  const [description, setDescription] = useState(() => {
    if (isEditing) return editingTask.description || '';
    const draft = SessionStorage.getItem(DRAFT_KEY, {});
    return draft.description || '';
  });

  // Save draft to session storage whenever form data changes (only when creating)
  useEffect(() => {
    if (!isEditing) {
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
    }
  }, [taskName, dueDate, description, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim() && dueDate) {
      if (isEditing) {
        dispatch(updateTaskRequest({
          id: editingTask.id,
          name: taskName.trim(),
          dueDate: dueDate,
          description: description.trim(),
        }));
      } else {
        dispatch(createTaskRequest({
          name: taskName.trim(),
          dueDate: dueDate,
          description: description.trim(),
        }));
      }
      
      // Clear draft and form
      clearDraft();
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      dispatch(cancelEditingTask());
    } else {
      dispatch(closeCreatePanel());
    }
    clearDraft();
  };

  const clearDraft = () => {
    if (!isEditing) {
      setTaskName('');
      setDueDate('');
      setDescription('');
      SessionStorage.removeItem(DRAFT_KEY);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="task-create-panel">
      <div className="panel-header">
        <h3>{isEditing ? 'Edit Task' : 'Create New Task'}</h3>
      </div>
      
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
            <IoClose size={16} />
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-create"
            disabled={!taskName.trim() || !dueDate}
          >
            <IoCheckmark size={16} />
            {isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreatePanel;
