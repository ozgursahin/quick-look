import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoCalendar, IoTime, IoTimer } from 'react-icons/io5';
import { POMODORO_PHASES } from '../../store/slices/pomodoroSlice';
import './DateTimePanel.css';

const DateTimePanel = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const pomodoro = useSelector(state => state.pomodoro);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPomodoroTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPomodoroEmoji = () => {
    switch (pomodoro.currentPhase) {
      case POMODORO_PHASES.WORK:
        return '🍅';
      case POMODORO_PHASES.SHORT_BREAK:
        return '☕';
      case POMODORO_PHASES.LONG_BREAK:
        return '🏖️';
      default:
        return null;
    }
  };

  const showPomodoroStatus = pomodoro.currentPhase !== POMODORO_PHASES.IDLE;

  return (
    <div className="datetime-panel">
      <div className="datetime-content">
        <div className="time-section">
          <IoTime size={16} className="datetime-icon" />
          <span className="time-text">{formatTime(currentTime)}</span>
          <span className="cute-emoji">🌙</span>
        </div>
        <div className="date-section">
          <IoCalendar size={14} className="datetime-icon" />
          <span className="date-text">{formatDate(currentTime)}</span>
          <span className="cute-emoji">✨</span>
        </div>
        {/* Mini Pomodoro Status */}
        {showPomodoroStatus && (
          <div className="pomodoro-mini-status">
            <IoTimer size={14} className="datetime-icon" />
            <span className="pomodoro-mini-text">
              {getPomodoroEmoji()} {formatPomodoroTime(pomodoro.timeRemaining)}
            </span>
            <span className={`pomodoro-mini-indicator ${pomodoro.isRunning ? 'running' : 'paused'}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimePanel;
