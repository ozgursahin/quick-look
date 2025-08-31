import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { IoTime, IoCheckmarkCircle, IoBanOutline } from 'react-icons/io5';
import './TaskItem.css';

const TaskItem = ({ task, onStatusChange, onDelete }) => {
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

  return (
    <div className="task-item">
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
        <div className="task-name">{task.name}</div>
        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
      </div>
      
      <div className="task-due-date">
        <span>Due Date: {formatDate(task.dueDate)}</span>
      </div>
      
      <button 
        className="delete-btn"
        onClick={handleDelete}
        title="Delete task"
      >
        <FaTrash size={14} />
      </button>
    </div>
  );
};

export default TaskItem;
