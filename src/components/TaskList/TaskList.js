import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskItem from '../TaskItem/TaskItem';
import { 
  updateTaskRequest, 
  deleteTaskRequest, 
  setEditingTask,
  archiveTaskRequest,
  unarchiveTaskRequest
} from '../../store/slices/tasksSlice';
import './TaskList.css';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, showCancelled, showCompleted, showArchived, sortBy, labelFilter } = useSelector(
    (state) => state.tasks
  );

  const handleTaskStatusChange = (taskId, newStatus) => {
    dispatch(updateTaskRequest({ id: taskId, status: newStatus }));
  };

  const handleTaskDelete = (taskId) => {
    dispatch(deleteTaskRequest(taskId));
  };

  const handleTaskEdit = (task) => {
    dispatch(setEditingTask(task));
  };

  const handleTaskArchive = (taskId) => {
    dispatch(archiveTaskRequest(taskId));
  };

  const handleTaskUnarchive = (taskId) => {
    dispatch(unarchiveTaskRequest(taskId));
  };

  // Filter tasks based on visibility settings and labels
  const filteredTasks = tasks.filter((task) => {
    // Filter by archived status
    if (!showArchived && task.archived) return false;
    if (showArchived && !task.archived) return false;
    
    // Filter by status
    if (!showCompleted && task.status === 'completed') return false;
    if (!showCancelled && task.status === 'cancelled') return false;
    
    // Filter by label
    if (labelFilter && (!task.labels || !task.labels.includes(labelFilter))) {
      return false;
    }
    
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status':
        const statusOrder = { waiting: 0, completed: 1, cancelled: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'createdAt':
        return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
      case 'updatedAt':
        return new Date(b.updatedAt) - new Date(a.updatedAt); // Most recently updated first
      case 'completedAt':
        // Show completed tasks by completion date, others by due date
        if (a.status === 'completed' && b.status === 'completed') {
          return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
        }
        if (a.status === 'completed') return 1;
        if (b.status === 'completed') return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      default:
        return 0;
    }
  });

  if (sortedTasks.length === 0) {
    return (
      <div className="task-list empty">
        <div className="empty-state">
          {showArchived ? (
            <p>No archived tasks</p>
          ) : labelFilter ? (
            <>
              <p>No tasks found with label "{labelFilter}"</p>
              <small>Try a different label or clear the filter</small>
            </>
          ) : (
            <>
              <p>No tasks to display</p>
              <small>Create a new task to get started</small>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {sortedTasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onStatusChange={handleTaskStatusChange}
          onEdit={handleTaskEdit}
          onDelete={handleTaskDelete}
          onArchive={handleTaskArchive}
          onUnarchive={handleTaskUnarchive}
        />
      ))}
    </div>
  );
};

export default TaskList;
