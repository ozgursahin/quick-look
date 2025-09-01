import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const BackgroundManager = () => {
  const { backgroundImage, useCustomBackground, backgroundOpacity, backgroundBlur } = useSelector(
    state => state.settings
  );

  useEffect(() => {
    const applyBackground = () => {
      const body = document.body;
      
      if (useCustomBackground && backgroundImage) {
        // Apply custom background
        body.style.background = `url(${backgroundImage})`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundAttachment = 'fixed';
        
        // Apply overlay for opacity and blur effect
        let overlay = document.getElementById('background-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'background-overlay';
          overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -2;
          `;
          body.appendChild(overlay);
        }
        
        overlay.style.background = `rgba(0, 0, 0, ${1 - backgroundOpacity})`;
        overlay.style.backdropFilter = `blur(${backgroundBlur}px)`;
        overlay.style.webkitBackdropFilter = `blur(${backgroundBlur}px)`;
      } else {
        // Apply default background - use the same gradient as TasksPage but on body
        body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
        body.style.backgroundSize = 'auto';
        body.style.backgroundPosition = 'initial';
        body.style.backgroundRepeat = 'initial';
        body.style.backgroundAttachment = 'initial';
        
        // Remove overlay if it exists
        const overlay = document.getElementById('background-overlay');
        if (overlay) {
          overlay.remove();
        }
      }
    };

    applyBackground();
    
    // Cleanup function
    return () => {
      // Optional: Reset to default when component unmounts
      // This might not be necessary depending on your app's behavior
    };
  }, [backgroundImage, useCustomBackground, backgroundOpacity, backgroundBlur]);

  return null; // This component doesn't render anything visible
};

export default BackgroundManager;
