import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoSave, IoRefresh, IoVolumeHigh, IoVolumeOff } from 'react-icons/io5';
import { updateSettings, resetPomodoro } from '../../store/slices/pomodoroSlice';
import './PomodoroSettings.css';

const PomodoroSettings = ({ onClose }) => {
  const dispatch = useDispatch();
  const pomodoro = useSelector(state => state.pomodoro);
  
  const [settings, setSettings] = useState({
    workDuration: pomodoro.workDuration,
    shortBreakDuration: pomodoro.shortBreakDuration,
    longBreakDuration: pomodoro.longBreakDuration,
    sessionsUntilLongBreak: pomodoro.sessionsUntilLongBreak,
    autoStartBreaks: pomodoro.autoStartBreaks,
    autoStartWork: pomodoro.autoStartWork,
    soundEnabled: pomodoro.soundEnabled,
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    dispatch(updateSettings(settings));
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('This will reset your Pomodoro timer and all settings. Are you sure?')) {
      dispatch(resetPomodoro());
      onClose();
    }
  };

  return (
    <div className="pomodoro-settings">
      <div className="settings-header">
        <h3>Pomodoro Settings</h3>
      </div>
      
      <div className="settings-content">
        {/* Duration Settings */}
        <div className="settings-section">
          <h4>Timer Durations (minutes)</h4>
          
          <div className="setting-group">
            <label htmlFor="work-duration">Work Sessions</label>
            <input
              id="work-duration"
              type="number"
              min="1"
              max="60"
              value={settings.workDuration}
              onChange={(e) => handleInputChange('workDuration', parseInt(e.target.value))}
              className="settings-input"
            />
          </div>
          
          <div className="setting-group">
            <label htmlFor="short-break-duration">Short Breaks</label>
            <input
              id="short-break-duration"
              type="number"
              min="1"
              max="30"
              value={settings.shortBreakDuration}
              onChange={(e) => handleInputChange('shortBreakDuration', parseInt(e.target.value))}
              className="settings-input"
            />
          </div>
          
          <div className="setting-group">
            <label htmlFor="long-break-duration">Long Breaks</label>
            <input
              id="long-break-duration"
              type="number"
              min="1"
              max="60"
              value={settings.longBreakDuration}
              onChange={(e) => handleInputChange('longBreakDuration', parseInt(e.target.value))}
              className="settings-input"
            />
          </div>
        </div>

        {/* Session Settings */}
        <div className="settings-section">
          <h4>Session Settings</h4>
          
          <div className="setting-group">
            <label htmlFor="sessions-until-long-break">Sessions until Long Break</label>
            <input
              id="sessions-until-long-break"
              type="number"
              min="2"
              max="8"
              value={settings.sessionsUntilLongBreak}
              onChange={(e) => handleInputChange('sessionsUntilLongBreak', parseInt(e.target.value))}
              className="settings-input"
            />
          </div>
        </div>

        {/* Auto-start Settings */}
        <div className="settings-section">
          <h4>Auto-start Settings</h4>
          
          <div className="setting-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => handleInputChange('autoStartBreaks', e.target.checked)}
                className="settings-checkbox"
              />
              <span className="checkbox-text">Auto-start breaks</span>
            </label>
            <p className="setting-description">
              Automatically start break timers when work sessions complete
            </p>
          </div>
          
          <div className="setting-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.autoStartWork}
                onChange={(e) => handleInputChange('autoStartWork', e.target.checked)}
                className="settings-checkbox"
              />
              <span className="checkbox-text">Auto-start work sessions</span>
            </label>
            <p className="setting-description">
              Automatically start work timers when breaks complete
            </p>
          </div>
        </div>

        {/* Sound Settings */}
        <div className="settings-section">
          <h4>Notifications</h4>
          
          <div className="setting-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => handleInputChange('soundEnabled', e.target.checked)}
                className="settings-checkbox"
              />
              <span className="checkbox-text">
                {settings.soundEnabled ? <IoVolumeHigh size={16} /> : <IoVolumeOff size={16} />}
                Sound notifications
              </span>
            </label>
            <p className="setting-description">
              Play sound when timer phases complete
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button
            className="btn btn-primary"
            onClick={handleSave}
          >
            <IoSave size={16} />
            Save Settings
          </button>
          
          <button
            className="btn btn-danger"
            onClick={handleReset}
          >
            <IoRefresh size={16} />
            Reset Everything
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroSettings;
