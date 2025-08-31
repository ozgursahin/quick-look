import React, { useState, useEffect, useCallback } from 'react';
import { useAppSessionStorage } from '../hooks/useAppSessionStorage';

/**
 * Session Storage Status Component
 * Shows the current status of session storage and provides quick actions
 * Can be used in settings pages or as a status indicator
 */
const SessionStorageStatus = ({ showActions = true, compact = false }) => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const appStorage = useAppSessionStorage();

  // Update storage info
  const updateStorageInfo = useCallback(() => {
    const info = appStorage.getStorageInfo();
    setStorageInfo(info);
    setLastUpdate(new Date().toLocaleTimeString());
  }, [appStorage]);

  // Auto-update storage info every 5 seconds
  useEffect(() => {
    updateStorageInfo();
    const interval = setInterval(updateStorageInfo, 5000);
    return () => clearInterval(interval);
  }, [updateStorageInfo]);

  // Handle quick actions
  const handleQuickSave = () => {
    appStorage.saveCurrentState();
    updateStorageInfo();
  };

  const handleQuickBackup = () => {
    appStorage.createBackup();
    updateStorageInfo();
  };

  const handleQuickCleanup = () => {
    appStorage.cleanupOldData();
    updateStorageInfo();
  };

  if (!storageInfo) {
    return <div className="storage-status loading">Loading storage info...</div>;
  }

  if (compact) {
    return (
      <div className="storage-status compact">
        <div className="storage-indicator">
          <span className={`status-dot ${storageInfo.available ? 'online' : 'offline'}`}></span>
          <span className="status-text">
            {storageInfo.available ? `${storageInfo.tasks} tasks` : 'Storage unavailable'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="storage-status full">
      <div className="storage-header">
        <h3>Session Storage Status</h3>
        <span className="last-update">Last updated: {lastUpdate}</span>
      </div>

      <div className="storage-stats">
        <div className="stat-item">
          <label>Status:</label>
          <span className={`status ${storageInfo.available ? 'available' : 'unavailable'}`}>
            {storageInfo.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
        
        <div className="stat-item">
          <label>Tasks Stored:</label>
          <span>{storageInfo.tasks || 0}</span>
        </div>
        
        <div className="stat-item">
          <label>Storage Size:</label>
          <span>{Math.round(storageInfo.totalStorageSize / 1024)} KB</span>
        </div>
        
        <div className="stat-item">
          <label>Has Draft:</label>
          <span className={storageInfo.hasDraft ? 'yes' : 'no'}>
            {storageInfo.hasDraft ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="stat-item">
          <label>Last Saved:</label>
          <span>{storageInfo.lastSaved || 'Never'}</span>
        </div>
      </div>

      {showActions && (
        <div className="storage-actions">
          <button onClick={handleQuickSave} className="storage-btn save">
            💾 Quick Save
          </button>
          <button onClick={handleQuickBackup} className="storage-btn backup">
            📦 Create Backup
          </button>
          <button onClick={handleQuickCleanup} className="storage-btn cleanup">
            🧹 Cleanup
          </button>
          <button onClick={updateStorageInfo} className="storage-btn refresh">
            🔄 Refresh
          </button>
        </div>
      )}

      <style jsx>{`
        .storage-status {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
        }

        .storage-status.loading {
          text-align: center;
          color: #666;
          padding: 20px;
        }

        .storage-status.compact {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          margin: 0;
          background: transparent;
          border: none;
        }

        .storage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 8px;
        }

        .storage-header h3 {
          margin: 0;
          color: #333;
          font-size: 16px;
        }

        .last-update {
          font-size: 12px;
          color: #666;
        }

        .storage-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #dc3545;
        }

        .status-dot.online {
          background: #28a745;
        }

        .status-text {
          font-size: 14px;
          color: #333;
        }

        .storage-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: white;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }

        .stat-item label {
          font-weight: 500;
          color: #333;
          font-size: 13px;
        }

        .stat-item span {
          font-size: 13px;
          color: #666;
        }

        .status.available {
          color: #28a745;
          font-weight: 500;
        }

        .status.unavailable {
          color: #dc3545;
          font-weight: 500;
        }

        .yes {
          color: #28a745;
        }

        .no {
          color: #6c757d;
        }

        .storage-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .storage-btn {
          padding: 8px 12px;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .storage-btn:hover {
          background: #f8f9fa;
          border-color: #007acc;
        }

        .storage-btn.save:hover {
          background: #e8f5e8;
          border-color: #28a745;
        }

        .storage-btn.backup:hover {
          background: #e8f4fd;
          border-color: #007acc;
        }

        .storage-btn.cleanup:hover {
          background: #fff3cd;
          border-color: #ffc107;
        }

        .storage-btn.refresh:hover {
          background: #e2e3e5;
          border-color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default SessionStorageStatus;
