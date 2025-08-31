import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskList from '../TaskList/TaskList';
import TaskCreatePanel from '../TaskCreatePanel/TaskCreatePanel';
import NavigationTabs from '../NavigationTabs/NavigationTabs';
import SessionStorageDebug from '../SessionStorageDebug/SessionStorageDebug';
import {
  toggleCreatePanel,
  toggleShowCancelled,
  toggleShowCompleted,
  setSortBy,
} from '../../store/slices/tasksSlice';
import './TasksPage.css';

const TasksPage = () => {
  const dispatch = useDispatch();
  const { showCreatePanel, showCancelled, showCompleted, sortBy } = useSelector(
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

  return (
    <div className="tasks-page">
      {/* Session Storage Debug Panel (development only) */}
      <SessionStorageDebug />
      
      {/* Cloud decorations */}
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      
      {/* Task panel */}
      <div className="task-panel">
        <div className="task-header">
          <h1>Tasks</h1>
          <div className="task-controls">
            <button 
              className="btn btn-primary"
              onClick={handleCreateTask}
            >
              Create Task
            </button>
            <button 
              className={`btn btn-filter ${showCancelled ? 'active' : ''}`}
              onClick={handleToggleCancelled}
            >
              Show Cancelled
            </button>
            <button 
              className={`btn btn-filter ${showCompleted ? 'active' : ''}`}
              onClick={handleToggleCompleted}
            >
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
          </div>
        </div>

        {/* Create Task Panel */}
        {showCreatePanel && <TaskCreatePanel />}

        {/* Task List */}
        <TaskList />
      </div>

      {/* Navigation Tabs */}
      <NavigationTabs />
    </div>
  );
};

export default TasksPage;
