import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { tick, completePhase, resetDailyStats } from '../store/slices/pomodoroSlice';

/**
 * Custom hook for managing Pomodoro timer effects
 * Handles the timer countdown and daily stats reset
 */
export const usePomodoroTimer = () => {
  const dispatch = useDispatch();
  const pomodoro = useSelector(state => state.pomodoro);
  const intervalRef = useRef(null);
  const lastDateRef = useRef(new Date().toDateString());

  // Timer effect
  useEffect(() => {
    if (pomodoro.isRunning && pomodoro.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        dispatch(tick());
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pomodoro.isRunning, pomodoro.timeRemaining, dispatch]);

  // Phase completion effect
  useEffect(() => {
    if (pomodoro.isRunning && pomodoro.timeRemaining === 0) {
      dispatch(completePhase());
    }
  }, [pomodoro.isRunning, pomodoro.timeRemaining, dispatch]);

  // Daily stats reset effect
  useEffect(() => {
    const currentDate = new Date().toDateString();
    if (lastDateRef.current !== currentDate) {
      dispatch(resetDailyStats());
      lastDateRef.current = currentDate;
    }
  }, [dispatch]);

  // Document title effect
  useEffect(() => {
    if (pomodoro.isRunning && pomodoro.timeRemaining > 0) {
      const minutes = Math.floor(pomodoro.timeRemaining / 60);
      const seconds = pomodoro.timeRemaining % 60;
      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      let phaseEmoji = '⏱️';
      switch (pomodoro.currentPhase) {
        case 'work':
          phaseEmoji = '🍅';
          break;
        case 'short_break':
          phaseEmoji = '☕';
          break;
        case 'long_break':
          phaseEmoji = '🏖️';
          break;
        default:
          phaseEmoji = '⏱️';
          break;
      }
      
      document.title = `${phaseEmoji} ${timeString} - Quick Look`;
    } else {
      document.title = 'Quick Look';
    }

    // Cleanup on unmount
    return () => {
      document.title = 'Quick Look';
    };
  }, [pomodoro.isRunning, pomodoro.timeRemaining, pomodoro.currentPhase]);

  return {
    isRunning: pomodoro.isRunning,
    timeRemaining: pomodoro.timeRemaining,
    currentPhase: pomodoro.currentPhase,
    completedSessions: pomodoro.completedSessions,
  };
};

/**
 * Hook for formatting time display
 */
export const useTimeFormatter = () => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return { formatTime, formatDuration };
};
