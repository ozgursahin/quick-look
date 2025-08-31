import React, { useState, useEffect } from 'react';
import { IoCalendar, IoTime } from 'react-icons/io5';
import './DateTimePanel.css';

const DateTimePanel = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

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
      </div>
    </div>
  );
};

export default DateTimePanel;
