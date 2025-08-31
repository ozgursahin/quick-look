import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onStatusChange }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
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

  const handleStatusClick = () => {
    const statusCycle = {
      waiting: 'completed',
      completed: 'cancelled',
      cancelled: 'waiting'
    };
    onStatusChange(task.id, statusCycle[task.status]);
  };

  return (
    <div className="task-item">
      <div 
        className="status-badge" 
        style={{ backgroundColor: getStatusColor(task.status) }}
        onClick={handleStatusClick}
        title={`Click to change status from ${getStatusText(task.status)}`}
      >
        {getStatusText(task.status)}
      </div>
      
      <div className="task-content">
        <div className="task-name">{task.name}</div>
        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
      </div>
      
      <div className="task-due-date">
        <span>Due Date: {formatDate(task.dueDate)}</span>
      </div>
    </div>
  );
};

export default TaskItem;
