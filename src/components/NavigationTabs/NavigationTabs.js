import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoList, IoDocument, IoTimer, IoSettings } from 'react-icons/io5';
import { closeTasksPanel } from '../../store/slices/tasksSlice';
import { openNotesPanel, closeNotesPanel } from '../../store/slices/notesSlice';
import { openPomodoroPanel, closePomodoroPanel } from '../../store/slices/pomodoroSlice';
import { openSettingsPanel, closeSettingsPanel } from '../../store/slices/settingsSlice';
import './NavigationTabs.css';

const NavigationTabs = () => {
  const dispatch = useDispatch();
  const { showTasksPanel } = useSelector(state => state.tasks);
  const { showNotesPanel } = useSelector(state => state.notes);
  const { showPomodoroPanel } = useSelector(state => state.pomodoro);
  const { showSettingsPanel } = useSelector(state => state.settings);

  const handleTasksClick = () => {
    if (showTasksPanel) {
      dispatch(closeTasksPanel());
    } else {
      dispatch(closeTasksPanel());
      dispatch(closeNotesPanel());
      dispatch(closePomodoroPanel());
      // Small delay to ensure panels close before opening new one
      setTimeout(() => {
        dispatch({ type: 'tasks/toggleTasksPanel' });
      }, 50);
    }
  };

  const handleNotesClick = () => {
    if (showNotesPanel) {
      dispatch(closeNotesPanel());
    } else {
      dispatch(closeTasksPanel());
      dispatch(closeNotesPanel());
      dispatch(closePomodoroPanel());
      // Small delay to ensure panels close before opening new one
      setTimeout(() => {
        dispatch(openNotesPanel());
      }, 50);
    }
  };

  const handlePomodoroClick = () => {
    if (showPomodoroPanel) {
      dispatch(closePomodoroPanel());
    } else {
      dispatch(closeTasksPanel());
      dispatch(closeNotesPanel());
      dispatch(closePomodoroPanel());
      // Small delay to ensure panels close before opening new one
      setTimeout(() => {
        dispatch(openPomodoroPanel());
      }, 50);
    }
  };

  const handleSettingsClick = () => {
    if (showSettingsPanel) {
      dispatch(closeSettingsPanel());
    } else {
      dispatch(openSettingsPanel());
    }
  };

  return (
    <div className="navigation-tabs">
      <div className="tab-container">
        <button 
          className={`tab ${showTasksPanel ? 'active' : ''}`}
          onClick={handleTasksClick}
        >
          <IoList size={18} />
          Tasks
        </button>
        <button 
          className={`tab ${showNotesPanel ? 'active' : ''}`}
          onClick={handleNotesClick}
        >
          <IoDocument size={18} />
          Notes
        </button>
        <button 
          className={`tab ${showPomodoroPanel ? 'active' : ''}`}
          onClick={handlePomodoroClick}
        >
          <IoTimer size={18} />
          Pomodoro
        </button>
        <button 
          className={`tab ${showSettingsPanel ? 'active' : ''}`}
          onClick={handleSettingsClick}
        >
          <IoSettings size={18} />
          Settings
        </button>
      </div>
    </div>
  );
};

export default NavigationTabs;
