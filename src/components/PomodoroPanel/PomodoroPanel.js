import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  IoPlay, 
  IoPause, 
  IoStop, 
  IoPlaySkipForward, 
  IoSettings, 
  IoClose,
  IoTimer,
  IoStatsChart,
  IoLink,
  IoUnlink,
  IoCheckmarkCircle,
  IoRefresh
} from 'react-icons/io5';
import {
  startTimer,
  pauseTimer,
  resetTimer,
  skipPhase,
  completeSession,
  resetAllPomodoro,
  setActiveTask,
  clearActiveTask,
  closePomodoroPanel,
  POMODORO_PHASES
} from '../../store/slices/pomodoroSlice';
import PomodoroSettings from '../PomodoroSettings/PomodoroSettings';
import PomodoroStats from '../PomodoroStats/PomodoroStats';
import './PomodoroPanel.css';

const PomodoroPanel = () => {
  const dispatch = useDispatch();
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const pomodoro = useSelector(state => state.pomodoro);
  const tasks = useSelector(state => state.tasks.tasks);
  
  const {
    currentPhase,
    isRunning,
    timeRemaining,
    currentSession,
    completedSessions,
    activeTaskId,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsUntilLongBreak
  } = pomodoro;

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get phase display info
  const getPhaseInfo = () => {
    switch (currentPhase) {
      case POMODORO_PHASES.WORK:
        return {
          title: 'Focus Time',
          emoji: '🍅',
          color: '#e74c3c',
          description: isRunning ? 'Stay focused and work on your task' : 'Ready to start your focus session'
        };
      case POMODORO_PHASES.SHORT_BREAK:
        return {
          title: 'Short Break',
          emoji: '☕',
          color: '#3498db',
          description: 'Take a quick break to recharge'
        };
      case POMODORO_PHASES.LONG_BREAK:
        return {
          title: 'Long Break',
          emoji: '🏖️',
          color: '#9b59b6',
          description: 'Enjoy a longer break - you earned it!'
        };
      default:
        return {
          title: 'Ready to Start',
          emoji: '⏱️',
          color: '#95a5a6',
          description: 'Click start to begin your focus session'
        };
    }
  };

  const phaseInfo = getPhaseInfo();
  const activeTask = tasks.find(task => task.id === activeTaskId);
  const progress = getCurrentPhaseProgress();

  function getCurrentPhaseProgress() {
    let totalDuration;
    switch (currentPhase) {
      case POMODORO_PHASES.WORK:
        totalDuration = workDuration * 60;
        break;
      case POMODORO_PHASES.SHORT_BREAK:
        totalDuration = shortBreakDuration * 60;
        break;
      case POMODORO_PHASES.LONG_BREAK:
        totalDuration = longBreakDuration * 60;
        break;
      default:
        totalDuration = workDuration * 60;
    }
    
    return ((totalDuration - timeRemaining) / totalDuration) * 100;
  }

  const handleStartPause = () => {
    if (isRunning) {
      dispatch(pauseTimer());
    } else {
      dispatch(startTimer());
    }
  };

  const handleReset = () => {
    dispatch(resetTimer());
  };

  const handleSkip = () => {
    dispatch(skipPhase());
  };

  const handleCompleteSession = () => {
    dispatch(completeSession());
  };

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all Pomodoro data? This will clear all statistics, history, and current progress.')) {
      dispatch(resetAllPomodoro());
    }
  };

  const handleTaskLink = (taskId) => {
    if (activeTaskId === taskId) {
      dispatch(clearActiveTask());
    } else {
      dispatch(setActiveTask(taskId));
    }
  };

  const handleClosePanel = () => {
    dispatch(closePomodoroPanel());
  };

  // Show available tasks for linking
  const availableTasks = tasks.filter(task => 
    task.status === 'waiting' || task.status === 'in_progress'
  );

  return (
    <div className="pomodoro-panel">
      <div className="pomodoro-header">
        <h1>
          <IoTimer size={20} />
          Pomodoro Timer
        </h1>
        <div className="pomodoro-header-controls">
          <button 
            className="btn btn-icon btn-danger"
            onClick={handleResetAll}
            title="Reset All Pomodoro Data"
          >
            <IoRefresh size={16} />
          </button>
          <button 
            className={`btn btn-icon ${showStats ? 'active' : ''}`}
            onClick={() => setShowStats(!showStats)}
            title="Statistics"
          >
            <IoStatsChart size={16} />
          </button>
          <button 
            className={`btn btn-icon ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <IoSettings size={16} />
          </button>
          <button 
            className="btn btn-close"
            onClick={handleClosePanel}
            title="Close Pomodoro Panel"
          >
            <IoClose size={20} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <PomodoroSettings 
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Stats Panel */}
      {showStats && (
        <PomodoroStats 
          onClose={() => setShowStats(false)}
        />
      )}

      {/* Main Timer Interface */}
      {!showSettings && !showStats && (
        <div className="pomodoro-content">
          {/* Phase Info */}
          <div className="phase-info">
            <div className="phase-header">
              <span className="phase-emoji">{phaseInfo.emoji}</span>
              <h2 className="phase-title" style={{ color: phaseInfo.color }}>
                {phaseInfo.title}
              </h2>
            </div>
            <p className="phase-description">{phaseInfo.description}</p>
          </div>

          {/* Timer Display */}
          <div className="timer-container">
            <div className="timer-circle" style={{ '--progress': `${progress}%`, '--color': phaseInfo.color }}>
              <div className="timer-display">
                <span className="timer-time">{formatTime(timeRemaining)}</span>
                <span className="timer-phase">{phaseInfo.title}</span>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="session-info">
            <div className="session-counter">
              <span className="session-label">Session</span>
              <span className="session-number">{currentSession}</span>
            </div>
            <div className="completed-sessions">
              <span className="completed-label">Completed</span>
              <span className="completed-number">{completedSessions}</span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="timer-controls">
            <button 
              className={`btn btn-primary timer-btn ${isRunning ? 'pause' : 'play'}`}
              onClick={handleStartPause}
            >
              {isRunning ? <IoPause size={24} /> : <IoPlay size={24} />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button 
              className="btn btn-secondary timer-btn"
              onClick={handleReset}
            >
              <IoStop size={20} />
              Reset
            </button>
            <button 
              className="btn btn-success timer-btn"
              onClick={handleCompleteSession}
              title="Complete current session and move to next phase"
            >
              <IoCheckmarkCircle size={20} />
              Complete
            </button>
            <button 
              className="btn btn-secondary timer-btn"
              onClick={handleSkip}
            >
              <IoPlaySkipForward size={20} />
              Skip
            </button>
          </div>

          {/* Active Task Display */}
          {activeTask && (
            <div className="active-task-display">
              <div className="active-task-header">
                <span className="active-task-label">Working on:</span>
                <button 
                  className="btn btn-link unlink-btn"
                  onClick={() => handleTaskLink(activeTask.id)}
                  title="Unlink task"
                >
                  <IoUnlink size={14} />
                </button>
              </div>
              <div className="active-task-name">{activeTask.name}</div>
              {activeTask.description && (
                <div className="active-task-description">{activeTask.description}</div>
              )}
            </div>
          )}

          {/* Task Linking */}
          {!activeTask && availableTasks.length > 0 && (
            <div className="task-linking">
              <h3 className="task-linking-title">Link a Task</h3>
              <p className="task-linking-description">
                Focus on a specific task during this Pomodoro session
              </p>
              <div className="available-tasks">
                {availableTasks.slice(0, 5).map(task => (
                  <button
                    key={task.id}
                    className="btn btn-task-link"
                    onClick={() => handleTaskLink(task.id)}
                    title={task.description || task.name}
                  >
                    <IoLink size={14} />
                    <span className="task-name">{task.name}</span>
                    {task.labels && task.labels.length > 0 && (
                      <span className="task-labels">
                        {task.labels.map(label => (
                          <span key={label} className="task-label">{label}</span>
                        ))}
                      </span>
                    )}
                  </button>
                ))}
                {availableTasks.length > 5 && (
                  <div className="more-tasks">
                    +{availableTasks.length - 5} more tasks available
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress Visualization */}
          <div className="pomodoro-progress">
            <div className="session-progress">
              <span className="progress-label">Sessions until long break:</span>
              <div className="progress-dots">
                {Array.from({ length: sessionsUntilLongBreak }, (_, i) => {
                  const sessionsCompleted = completedSessions % sessionsUntilLongBreak;
                  return (
                    <div 
                      key={i}
                      className={`progress-dot ${
                        i < sessionsCompleted ? 'completed' : ''
                      }`}
                    />
                  );
                })}
              </div>
              <span className="progress-counter">
                {sessionsUntilLongBreak - (completedSessions % sessionsUntilLongBreak)} remaining
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroPanel;
