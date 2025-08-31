import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTaskRequest, closeCreatePanel } from '../../store/slices/tasksSlice';
import './TaskCreatePanel.css';

const TaskCreatePanel = () => {
  const dispatch = useDispatch();
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim() && dueDate) {
      dispatch(createTaskRequest({
        name: taskName.trim(),
        dueDate: dueDate,
      }));
      setTaskName('');
      setDueDate('');
    }
  };

  const handleCancel = () => {
    dispatch(closeCreatePanel());
    setTaskName('');
    setDueDate('');
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
