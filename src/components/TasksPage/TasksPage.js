import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoAdd, IoClose, IoEye, IoEyeOff } from 'react-icons/io5';
import TaskList from '../TaskList/TaskList';
import TaskCreatePanel from '../TaskCreatePanel/TaskCreatePanel';
import NavigationTabs from '../NavigationTabs/NavigationTabs';
import SessionStorageDebug from '../SessionStorageDebug/SessionStorageDebug';
import {
  toggleCreatePanel,
  toggleTasksPanel,
  toggleShowCancelled,
  toggleShowCompleted,
  setSortBy,
} from '../../store/slices/tasksSlice';
import './TasksPage.css';

const TasksPage = () => {
  const dispatch = useDispatch();
  const { showCreatePanel, showTasksPanel, showCancelled, showCompleted, sortBy } = useSelector(
    (state) => state.tasks
  );

  const handleCreateTask = () => {
    dispatch(toggleCreatePanel());
  };

  const handleToggleCancelled = () => {
    dispatch(toggleShowCancelled());
  };

  const handleToggleCompleted = () => {
    dispatch(toggleShowCompleted());
  };

  const handleSortChange = (newSortBy) => {
    dispatch(setSortBy(newSortBy));
  };

  const handleClosePanel = () => {
    dispatch(toggleTasksPanel());
  };

  return (
    <div className="tasks-page">
      {/* Session Storage Debug Panel (development only) */}
      <SessionStorageDebug />
      
      {/* Cloud decorations */}
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      
      {/* Task panel */}
      {showTasksPanel && (
        <div className="task-panel">
          <div className="task-header">
            <h1>Tasks</h1>
            <div className="task-controls">
              <button 
                className="btn btn-primary"
                onClick={handleCreateTask}
              >
                <IoAdd size={16} />
                Create Task
              </button>
              <button 
                className={`btn btn-filter ${showCancelled ? 'active' : ''}`}
                onClick={handleToggleCancelled}
              >
                {showCancelled ? <IoEyeOff size={14} /> : <IoEye size={14} />}
                Show Cancelled
              </button>
              <button 
                className={`btn btn-filter ${showCompleted ? 'active' : ''}`}
                onClick={handleToggleCompleted}
              >
                {showCompleted ? <IoEyeOff size={14} /> : <IoEye size={14} />}
                Show Completed
              </button>
              <div className="sort-control">
                <span>Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="sort-select"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                </select>
              </div>
              <button 
                className="btn btn-close"
                onClick={handleClosePanel}
                title="Close Tasks Panel"
              >
                <IoClose size={18} />
              </button>
            </div>
          </div>

          {/* Create Task Panel */}
          {showCreatePanel && <TaskCreatePanel />}

          {/* Task List */}
          <TaskList />
        </div>
      )}

      {/* Navigation Tabs */}
      <NavigationTabs 
        showTasksPanel={showTasksPanel}
        onToggleTasksPanel={handleClosePanel}
      />
    </div>
  );
};

export default TasksPage;
