import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoClose, IoCloudUpload, IoRefresh, IoCheckmark } from 'react-icons/io5';
import {
  closeSettingsPanel,
  setBackgroundImage,
  setUseCustomBackground,
  setBackgroundOpacity,
  setBackgroundBlur,
  resetBackgroundToDefault,
} from '../../store/slices/settingsSlice';
import './SettingsPanel.css';

const SettingsPanel = () => {
  const dispatch = useDispatch();
  const { 
    backgroundImage, 
    useCustomBackground, 
    backgroundOpacity, 
    backgroundBlur 
  } = useSelector(state => state.settings);
  
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleClose = () => {
    dispatch(closeSettingsPanel());
  };

  const handleImageUpload = (file) => {
    setUploadError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      // Save the image and automatically apply it
      dispatch(setBackgroundImage(dataUrl));
    };
    reader.onerror = () => {
      setUploadError('Error reading the image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUseDefaultBackground = () => {
    dispatch(setUseCustomBackground(false));
  };

  const handleUseCustomBackground = () => {
    if (backgroundImage) {
      dispatch(setUseCustomBackground(true));
    }
  };

  const handleOpacityChange = (e) => {
    dispatch(setBackgroundOpacity(parseFloat(e.target.value)));
  };

  const handleBlurChange = (e) => {
    dispatch(setBackgroundBlur(parseInt(e.target.value)));
  };

  const handleResetToDefault = () => {
    dispatch(resetBackgroundToDefault());
    setUploadError(null);
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Settings</h2>
        <button 
          className="btn btn-close"
          onClick={handleClose}
          title="Close Settings"
        >
          <IoClose size={22} />
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3>Background</h3>
          
          {/* Background Options */}
          <div className="background-options">
            <div className="background-option">
              <label className="radio-option">
                <input
                  type="radio"
                  name="background"
                  checked={!useCustomBackground}
                  onChange={handleUseDefaultBackground}
                />
                <span className="radio-label">Default Background</span>
              </label>
            </div>
            
            {backgroundImage && (
              <div className="background-option">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="background"
                    checked={useCustomBackground}
                    onChange={handleUseCustomBackground}
                  />
                  <span className="radio-label">Custom Background</span>
                </label>
              </div>
            )}
          </div>

          {/* Image Upload Area */}
          <div 
            className={`image-upload-area ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            
              {backgroundImage ? (
              <div className="uploaded-image-preview">
                <img 
                  src={backgroundImage} 
                  alt="Background preview" 
                  className="background-preview"
                />
                <div className="upload-overlay">
                  <IoRefresh size={24} />
                  <p>Click or drag to replace</p>
                </div>
                {useCustomBackground && (
                  <div className="active-background-badge">
                    <IoCheckmark size={12} />
                    Active
                  </div>
                )}
              </div>
            ) : (
              <div className="upload-placeholder">
                <IoCloudUpload size={48} />
                <h4>Upload Background Image</h4>
                <p>Click here or drag an image to upload</p>
                <p className="upload-hint">Supported formats: JPG, PNG, WebP (max 5MB)</p>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="error-message">
              {uploadError}
            </div>
          )}

          {/* Apply Background Button - show when image is uploaded but not active */}
          {backgroundImage && !useCustomBackground && (
            <div className="apply-background-section">
              <p className="status-text">Image uploaded! Click below to apply it as your background.</p>
              <button 
                className="btn btn-primary apply-btn"
                onClick={handleUseCustomBackground}
              >
                <IoCheckmark size={16} />
                Apply This Background
              </button>
            </div>
          )}

          {/* Status when custom background is active */}
          {backgroundImage && useCustomBackground && (
            <div className="apply-background-section">
              <p className="status-text success">✓ Custom background is currently active</p>
            </div>
          )}

          {/* Background Controls - only show if custom background is available */}
          {backgroundImage && (
            <div className="background-controls">
              <div className="control-group">
                <label htmlFor="opacity-slider">
                  Background Opacity: {Math.round(backgroundOpacity * 100)}%
                </label>
                <input
                  id="opacity-slider"
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={backgroundOpacity}
                  onChange={handleOpacityChange}
                  className="slider"
                />
              </div>

              <div className="control-group">
                <label htmlFor="blur-slider">
                  Background Blur: {backgroundBlur}px
                </label>
                <input
                  id="blur-slider"
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={backgroundBlur}
                  onChange={handleBlurChange}
                  className="slider"
                />
              </div>

              <button 
                className="btn btn-secondary reset-btn"
                onClick={handleResetToDefault}
              >
                <IoRefresh size={16} />
                Reset to Default
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
