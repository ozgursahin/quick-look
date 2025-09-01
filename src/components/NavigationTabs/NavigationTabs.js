import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoList, IoDocument } from 'react-icons/io5';
import { closeTasksPanel } from '../../store/slices/tasksSlice';
import { openNotesPanel, closeNotesPanel } from '../../store/slices/notesSlice';
import './NavigationTabs.css';

const NavigationTabs = () => {
  const dispatch = useDispatch();
  const { showTasksPanel } = useSelector(state => state.tasks);
  const { showNotesPanel } = useSelector(state => state.notes);

  const handleTasksClick = () => {
    if (showTasksPanel) {
      dispatch(closeTasksPanel());
    } else {
      dispatch(closeTasksPanel());
      dispatch(closeNotesPanel());
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
      // Small delay to ensure panels close before opening new one
      setTimeout(() => {
        dispatch(openNotesPanel());
      }, 50);
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
      </div>
    </div>
  );
};

export default NavigationTabs;
