import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoPlay, IoPause } from 'react-icons/io5';
import { 
  startTimer, 
  pauseTimer, 
  openPomodoroPanel,
  POMODORO_PHASES 
} from '../../store/slices/pomodoroSlice';
import './PomodoroStatus.css';

const PomodoroStatus = () => {
  const dispatch = useDispatch();
  const pomodoro = useSelector(state => state.pomodoro);
  
  const {
    currentPhase,
    isRunning,
    timeRemaining,
    completedSessions
  } = pomodoro;

  // Don't show if in idle state
  if (currentPhase === POMODORO_PHASES.IDLE) {
    return null;
  }

  // Format time for compact display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get phase display info
  const getPhaseInfo = () => {
    switch (currentPhase) {
      case POMODORO_PHASES.WORK:
        return { emoji: '🍅', color: '#e74c3c', shortName: 'Work' };
      case POMODORO_PHASES.SHORT_BREAK:
        return { emoji: '☕', color: '#3498db', shortName: 'Break' };
      case POMODORO_PHASES.LONG_BREAK:
        return { emoji: '🏖️', color: '#9b59b6', shortName: 'Long Break' };
      default:
        return { emoji: '⏱️', color: '#95a5a6', shortName: 'Timer' };
    }
  };

  const phaseInfo = getPhaseInfo();

  const handleStartPause = (e) => {
    e.stopPropagation();
    if (isRunning) {
      dispatch(pauseTimer());
    } else {
      dispatch(startTimer());
    }
  };

  const handleOpenPanel = () => {
    dispatch(openPomodoroPanel());
  };

  return (
    <div 
      className={`pomodoro-status ${isRunning ? 'running' : 'paused'}`}
      onClick={handleOpenPanel}
      style={{ '--phase-color': phaseInfo.color }}
    >
      <div className="status-indicator">
        <span className="status-emoji">{phaseInfo.emoji}</span>
        <div className="status-info">
          <div className="status-time">{formatTime(timeRemaining)}</div>
          <div className="status-label">{phaseInfo.shortName}</div>
        </div>
      </div>
      
      <div className="status-controls">
        <button 
          className="status-control-btn"
          onClick={handleStartPause}
          title={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <IoPause size={14} /> : <IoPlay size={14} />}
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="status-progress">
        <div 
          className="status-progress-fill"
          style={{ 
            width: `${((25 * 60 - timeRemaining) / (25 * 60)) * 100}%`,
            backgroundColor: phaseInfo.color 
          }}
        />
      </div>
      
      {/* Session counter */}
      <div className="status-sessions">
        {completedSessions} sessions
      </div>
    </div>
  );
};

export default PomodoroStatus;
