import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { IoTime, IoCheckmarkCircle, IoBanOutline, IoCreate, IoFlag, IoArchive, IoRefresh, IoTimer } from 'react-icons/io5';
import { setActiveTask, openPomodoroPanel } from '../../store/slices/pomodoroSlice';
import './TaskItem.css';

const TaskItem = ({ task, onStatusChange, onEdit, onDelete, onArchive, onUnarchive }) => {
  const dispatch = useDispatch();
  const pomodoro = useSelector(state => state.pomodoro);
  
  const isActiveTask = pomodoro.activeTaskId === task.id;
  const canStartPomodoro = task.status === 'waiting' || task.status === 'in_progress';
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return '#FFC107';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting':
        return 'Waiting';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'waiting':
        return <IoTime size={14} />;
      case 'completed':
        return <IoCheckmarkCircle size={14} />;
      case 'cancelled':
        return <IoBanOutline size={14} />;
      default:
        return null;
    }
  };

  const handleStatusClick = () => {
    const statusCycle = {
      waiting: 'completed',
      completed: 'cancelled',
      cancelled: 'waiting'
    };
    onStatusChange(task.id, statusCycle[task.status]);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the task "${task.name}"?`)) {
      onDelete(task.id);
    }
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleArchive = () => {
    if (task.archived) {
      onUnarchive(task.id);
    } else {
      onArchive(task.id);
    }
  };

  const handleStartPomodoro = (e) => {
    e.stopPropagation();
    dispatch(setActiveTask(task.id));
    dispatch(openPomodoroPanel());
  };

  return (
    <div className={`task-item ${task.archived ? 'archived' : ''} ${isActiveTask ? 'active-pomodoro' : ''}`}>
      <div 
        className="status-badge" 
        style={{ backgroundColor: getStatusColor(task.status) }}
        onClick={handleStatusClick}
        title={`Click to change status from ${getStatusText(task.status)}`}
      >
        {getStatusIcon(task.status)}
        {getStatusText(task.status)}
      </div>
      
      <div className="task-content">
        <div className="task-name">
          {task.name}
          {task.archived && <span className="archived-badge">Archived</span>}
          {isActiveTask && <span className="pomodoro-badge">🍅 Active</span>}
        </div>
        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
        {task.labels && task.labels.length > 0 && (
          <div className="task-labels">
            {task.labels.map((label, index) => (
              <span key={index} className="task-label">{label}</span>
            ))}
          </div>
        )}
        <div className="task-metrics">
          <span className="metric">
            <IoCreate size={12} />
            Created: {formatDateTime(task.createdAt)}
          </span>
          <span className="metric">
            <IoTime size={12} />
            Updated: {formatDateTime(task.updatedAt)}
          </span>
          {task.completedAt && (
            <span className="metric completion-metric">
              <IoFlag size={12} />
              Completed: {formatDateTime(task.completedAt)}
            </span>
          )}
        </div>
      </div>
      
      <div className="task-due-date">
        <span>Due Date: {formatDate(task.dueDate)}</span>
      </div>
      
      <div className="task-actions">
        {canStartPomodoro && (
          <button 
            className={`action-btn pomodoro-btn ${isActiveTask ? 'active' : ''}`}
            onClick={handleStartPomodoro}
            title={isActiveTask ? "Already active in Pomodoro" : "Start Pomodoro for this task"}
          >
            <IoTimer size={12} />
          </button>
        )}
        <button 
          className="action-btn edit-btn"
          onClick={handleEdit}
          title="Edit task"
        >
          <FaEdit size={12} />
        </button>
        <button 
          className="action-btn archive-btn"
          onClick={handleArchive}
          title={task.archived ? "Unarchive task" : "Archive task"}
        >
          {task.archived ? <IoRefresh size={12} /> : <IoArchive size={12} />}
        </button>
        <button 
          className="action-btn delete-btn"
          onClick={handleDelete}
          title="Delete task"
        >
          <FaTrash size={12} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
