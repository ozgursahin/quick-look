import React, { useState } from 'react';
import { useAppSessionStorage } from '../../hooks/useAppSessionStorage';
import { useSessionStorage, useTaskStorage, useUserPreferences } from '../../hooks/useSessionStorage';
import { useSessionStorageContext } from '../../providers/SessionStorageProvider';
import './SessionStorageDebug.css';

/**
 * Session Storage Debug Component
 * Provides debugging tools for session storage functionality
 * Only include this in development builds
 */
const SessionStorageDebug = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const appStorage = useAppSessionStorage();
  const sessionStorage = useSessionStorage();
  const taskStorage = useTaskStorage();
  const userPreferences = useUserPreferences();
  const sessionStorageContext = useSessionStorageContext();

  // Show current session storage contents
  const showStorageContents = () => {
    const contents = {
      storageInfo: appStorage.getStorageInfo(),
      tasks: taskStorage.loadTasks(),
      tasksUIState: taskStorage.loadTasksUIState(),
      userPreferences: userPreferences.loadPreferences(),
      appState: sessionStorage.loadAppState(),
      isAvailable: sessionStorage.isStorageAvailable(),
    };
    setDebugInfo(JSON.stringify(contents, null, 2));
  };

  // Show detailed storage statistics
  const showStorageStats = () => {
    const info = appStorage.getStorageInfo();
    const stats = {
      ...info,
      sessionStorageLength: sessionStorage?.length || 0,
      keys: Object.keys(window.sessionStorage),
      totalSize: `${Math.round(info.totalStorageSize / 1024)} KB`,
    };
    setDebugInfo(JSON.stringify(stats, null, 2));
  };

  // Create and show backup
  const createBackup = () => {
    const backup = appStorage.createBackup();
    setDebugInfo(`Backup created successfully:\n${JSON.stringify(backup, null, 2)}`);
  };

  // Test cleanup functionality
  const testCleanup = () => {
    const results = appStorage.cleanupOldData();
    setDebugInfo(`Cleanup completed:\n${JSON.stringify(results, null, 2)}`);
  };

  // Clear all storage
  const clearAllStorage = () => {
    const success = appStorage.clearAllData();
    setDebugInfo(success ? 'All session storage cleared successfully' : 'Failed to clear storage');
  };

  // Export data
  const exportData = () => {
    const data = appStorage.exportData();
    setDebugInfo(`Export data:\n${JSON.stringify(data, null, 2)}`);
  };

  // Save current state
  const saveCurrentState = () => {
    const success = appStorage.saveCurrentState();
    setDebugInfo(success ? 'Current state saved successfully' : 'Failed to save state');
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="debug-section">
            <div className="debug-actions">
              <button onClick={showStorageContents}>Show All Contents</button>
              <button onClick={showStorageStats}>Storage Statistics</button>
              <button onClick={saveCurrentState}>Save Current State</button>
            </div>
          </div>
        );
      
      case 'backup':
        return (
          <div className="debug-section">
            <div className="debug-actions">
              <button onClick={createBackup}>Create Backup</button>
              <button onClick={() => {
                const success = appStorage.restoreFromBackup();
                setDebugInfo(success ? 'Restored from backup successfully' : 'No backup found or restore failed');
              }}>
                Restore Backup
              </button>
              <button onClick={exportData}>Export Data</button>
            </div>
          </div>
        );
      
      case 'maintenance':
        return (
          <div className="debug-section">
            <div className="debug-actions">
              <button onClick={testCleanup}>Cleanup Old Data</button>
              <button onClick={clearAllStorage} className="danger">Clear All Storage</button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="session-storage-debug">
      <button 
        className="debug-toggle"
        onClick={() => setIsVisible(!isVisible)}
      >
        🔧 Session Storage Debug
      </button>
      
      {isVisible && (
        <div className="debug-panel">
          <h3>Session Storage Debug Panel</h3>
          
          <div className="debug-tabs">
            <button 
              className={`debug-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`debug-tab ${activeTab === 'backup' ? 'active' : ''}`}
              onClick={() => setActiveTab('backup')}
            >
              Backup
            </button>
            <button 
              className={`debug-tab ${activeTab === 'maintenance' ? 'active' : ''}`}
              onClick={() => setActiveTab('maintenance')}
            >
              Maintenance
            </button>
          </div>
          
          {renderTabContent()}
          
          {debugInfo && (
            <div className="debug-info">
              <h4>Debug Information:</h4>
              <pre>{debugInfo}</pre>
              <button 
                className="clear-info-btn"
                onClick={() => setDebugInfo('')}
              >
                Clear
              </button>
            </div>
          )}
          
          <div className="debug-stats">
            <p><strong>Storage Available:</strong> {sessionStorageContext.isAvailable() ? 'Yes' : 'No'}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Tasks Count:</strong> {taskStorage.loadTasks().length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionStorageDebug;
