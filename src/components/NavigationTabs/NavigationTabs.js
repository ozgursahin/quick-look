import React from 'react';
import { IoList, IoDocument } from 'react-icons/io5';
import './NavigationTabs.css';

const NavigationTabs = ({ showTasksPanel, onToggleTasksPanel }) => {
  return (
    <div className="navigation-tabs">
      <div className="tab-container">
        <button 
          className={`tab ${showTasksPanel ? 'active' : ''}`}
          onClick={onToggleTasksPanel}
        >
          <IoList size={18} />
          Tasks
        </button>
        <button className="tab">
          <IoDocument size={18} />
          Notes
        </button>
      </div>
    </div>
  );
};

export default NavigationTabs;
