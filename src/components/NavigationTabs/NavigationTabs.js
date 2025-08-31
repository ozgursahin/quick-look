import React from 'react';
import './NavigationTabs.css';

const NavigationTabs = () => {
  return (
    <div className="navigation-tabs">
      <div className="tab-container">
        <button className="tab active">
          Tasks
        </button>
        <button className="tab">
          Notes
        </button>
      </div>
    </div>
  );
};

export default NavigationTabs;
