import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoAdd, IoClose, IoEye, IoEyeOff, IoArchive } from 'react-icons/io5';
import TaskList from '../TaskList/TaskList';
import TaskCreatePanel from '../TaskCreatePanel/TaskCreatePanel';
import NotesPage from '../NotesPage/NotesPage';
import PomodoroPanel from '../PomodoroPanel/PomodoroPanel';
import NavigationTabs from '../NavigationTabs/NavigationTabs';
import SessionStorageDebug from '../SessionStorageDebug/SessionStorageDebug';
import DateTimePanel from '../DateTimePanel/DateTimePanel';
import {
  toggleCreatePanel,
  toggleTasksPanel,
  toggleShowCancelled,
  toggleShowCompleted,
  toggleShowArchived,
  setSortBy,
  setLabelFilter,
} from '../../store/slices/tasksSlice';
import './TasksPage.css';

const TasksPage = () => {
  const dispatch = useDispatch();
  const { showCreatePanel, showTasksPanel, showCancelled, showCompleted, showArchived, sortBy, editingTask, labelFilter, tasks } = useSelector(
    (state) => state.tasks
  );
  const { showPomodoroPanel } = useSelector(state => state.pomodoro);

  const handleCreateTask = () => {
    dispatch(toggleCreatePanel());
  };

  const handleToggleCancelled = () => {
    dispatch(toggleShowCancelled());
  };

  const handleToggleCompleted = () => {
    dispatch(toggleShowCompleted());
  };

  const handleToggleArchived = () => {
    dispatch(toggleShowArchived());
  };

  const handleSortChange = (newSortBy) => {
    dispatch(setSortBy(newSortBy));
  };

  const handleLabelFilterChange = (e) => {
    dispatch(setLabelFilter(e.target.value));
  };

  const handleClosePanel = () => {
    dispatch(toggleTasksPanel());
  };

  // Get unique labels from all tasks for filter dropdown
  const availableLabels = [...new Set(
    tasks.flatMap(task => task.labels || [])
  )].sort();

  return (
    <div className="tasks-page">
      {/* Session Storage Debug Panel (development only) */}
      <SessionStorageDebug />
      
      {/* Sky decorations */}
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="moon"></div>
      <div className="star star-1"></div>
      <div className="star star-2"></div>
      <div className="star star-3"></div>
      <div className="star star-4"></div>
      <div className="star star-5"></div>
      <div className="star star-6"></div>
      
      {/* Task panel */}
      {showTasksPanel && (
        <div className="task-panel">
          <div className="task-header">
            <h1>Tasks</h1>
            <div className="task-controls">
              <div className="label-filter-control">
                <span>Label:</span>
                <select
                  value={labelFilter}
                  onChange={handleLabelFilterChange}
                  className="label-filter-select"
                >
                  <option value="">All Labels</option>
                  {availableLabels.map(label => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleCreateTask}
                disabled={!!editingTask} // Disable when editing
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
              <button 
                className={`btn btn-filter ${showArchived ? 'active' : ''}`}
                onClick={handleToggleArchived}
              >
                <IoArchive size={14} />
                {showArchived ? 'Hide Archived' : 'Show Archived'}
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
                  <option value="createdAt">Created Date</option>
                  <option value="updatedAt">Updated Date</option>
                  <option value="completedAt">Completion Date</option>
                </select>
              </div>
              <button 
                className="btn btn-close"
                onClick={handleClosePanel}
                title="Close Tasks Panel"
              >
                <IoClose size={22} />
              </button>
            </div>
          </div>

          {/* Create/Edit Task Panel */}
          {(showCreatePanel || editingTask) && <TaskCreatePanel />}

          {/* Task List - Hide when editor is open */}
          {!(showCreatePanel || editingTask) && <TaskList />}
        </div>
      )}

      {/* Notes Panel */}
      <NotesPage />

      {/* Pomodoro Panel */}
      {showPomodoroPanel && <PomodoroPanel />}

      {/* Navigation Tabs */}
      <NavigationTabs />
      
      {/* Date Time Panel - Always Visible */}
      <DateTimePanel />
    </div>
  );
};

export default TasksPage;
