import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoTrash, IoTrendingUp, IoTimer, IoCheckbox } from 'react-icons/io5';
import { clearPomodoroHistory } from '../../store/slices/pomodoroSlice';
import './PomodoroStats.css';

const PomodoroStats = ({ onClose }) => {
  const dispatch = useDispatch();
  const pomodoro = useSelector(state => state.pomodoro);
  const tasks = useSelector(state => state.tasks.tasks);
  
  const { todayStats, pomodoroHistory } = pomodoro;

  // Calculate additional stats
  const totalSessions = pomodoroHistory.filter(entry => entry.completed && entry.type === 'work').length;
  const averageSessionLength = totalSessions > 0 
    ? pomodoroHistory
        .filter(entry => entry.completed && entry.type === 'work')
        .reduce((sum, entry) => sum + entry.duration, 0) / totalSessions
    : 0;

  // Get recent session history (last 10 sessions)
  const recentSessions = pomodoroHistory
    .filter(entry => entry.completed && entry.type === 'work')
    .slice(-10)
    .reverse();

  const handleClearHistory = () => {
    if (window.confirm('This will permanently delete your Pomodoro history. Are you sure?')) {
      dispatch(clearPomodoroHistory());
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getTaskName = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.name : 'Unknown Task';
  };

  return (
    <div className="pomodoro-stats">
      <div className="stats-header">
        <h3>Pomodoro Statistics</h3>
      </div>
      
      <div className="stats-content">
        {/* Today's Stats */}
        <div className="stats-section">
          <h4>Today's Progress</h4>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <IoTimer size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{todayStats.completedPomodoros}</span>
                <span className="stat-label">Completed Sessions</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <IoTrendingUp size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatDuration(todayStats.totalFocusTime)}</span>
                <span className="stat-label">Focus Time</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <IoCheckbox size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{todayStats.completedTasks}</span>
                <span className="stat-label">Tasks Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="stats-section">
          <h4>Overall Statistics</h4>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-value">{totalSessions}</span>
                <span className="stat-label">Total Sessions</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-value">{averageSessionLength.toFixed(1)}m</span>
                <span className="stat-label">Avg Session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <div className="stats-section">
            <div className="section-header">
              <h4>Recent Sessions</h4>
              <button
                className="btn btn-danger btn-small"
                onClick={handleClearHistory}
                title="Clear History"
              >
                <IoTrash size={14} />
              </button>
            </div>
            
            <div className="recent-sessions">
              {recentSessions.map((session, index) => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <div className="session-time">
                      {formatDate(session.completedAt)}
                    </div>
                    <div className="session-duration">
                      {session.duration}m session
                    </div>
                    {session.taskId && (
                      <div className="session-task">
                        📝 {getTaskName(session.taskId)}
                      </div>
                    )}
                  </div>
                  <div className="session-number">
                    #{totalSessions - index}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No History Message */}
        {recentSessions.length === 0 && (
          <div className="stats-section">
            <div className="no-history">
              <IoTimer size={48} />
              <h4>No Sessions Yet</h4>
              <p>Complete your first Pomodoro session to see statistics here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroStats;
