import { call, put, take, fork, cancel, delay, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { 
  startTimer, 
  pauseTimer, 
  tick, 
  completePhase, 
  resetDailyStats,
  POMODORO_PHASES 
} from '../slices/pomodoroSlice';

// Create a timer channel that emits every second
function createTimerChannel() {
  return eventChannel(emitter => {
    const interval = setInterval(() => {
      emitter('TICK');
    }, 1000);

    // Return unsubscribe function
    return () => {
      clearInterval(interval);
    };
  });
}

// Get current pomodoro state
function* getPomodoroState() {
  return yield select(state => state.pomodoro);
}

// Timer saga that handles the countdown
function* timerSaga() {
  const channel = yield call(createTimerChannel);
  
  try {
    while (true) {
      yield take(channel);
      const pomodoroState = yield* getPomodoroState();
      
      if (pomodoroState.isRunning) {
        if (pomodoroState.timeRemaining > 0) {
          yield put(tick());
        } else {
          // Time's up!
          yield put(completePhase());
          
          // Play notification sound if enabled
          if (pomodoroState.soundEnabled) {
            yield call(playNotificationSound);
          }
          
          // Show browser notification if supported
          yield call(showBrowserNotification, pomodoroState.currentPhase);
        }
      }
    }
  } finally {
    channel.close();
  }
}

// Play notification sound
function playNotificationSound() {
  try {
    // Create a simple beep sound using Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // 800 Hz tone
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
}

// Show browser notification
function showBrowserNotification(currentPhase) {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      let title, message;
      
      switch (currentPhase) {
        case POMODORO_PHASES.WORK:
          title = '🍅 Work Session Complete!';
          message = 'Time for a break. Great job staying focused!';
          break;
        case POMODORO_PHASES.SHORT_BREAK:
          title = '☕ Short Break Complete!';
          message = 'Ready to get back to work?';
          break;
        case POMODORO_PHASES.LONG_BREAK:
          title = '🏖️ Long Break Complete!';
          message = 'Refreshed and ready for the next session!';
          break;
        default:
          title = '🍅 Pomodoro Complete!';
          message = 'Phase completed successfully.';
      }
      
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'pomodoro-timer',
        requireInteraction: false,
        silent: false,
      });
    }
  } catch (error) {
    console.warn('Could not show notification:', error);
  }
}

// Request notification permission
function* requestNotificationPermission() {
  try {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = yield call([Notification, 'requestPermission']);
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  } catch (error) {
    console.warn('Could not request notification permission:', error);
    return false;
  }
}

// Daily stats reset saga - runs when date changes
function* dailyStatsResetSaga() {
  while (true) {
    const pomodoroState = yield* getPomodoroState();
    const today = new Date().toDateString();
    
    if (pomodoroState.todayStats.date !== today) {
      yield put(resetDailyStats());
    }
    
    // Check every hour
    yield delay(60 * 60 * 1000);
  }
}

// Main pomodoro saga
function* pomodoroSaga() {
  // Start the timer saga
  const timerTask = yield fork(timerSaga);
  
  // Start daily stats reset saga
  const dailyStatsTask = yield fork(dailyStatsResetSaga);
  
  // Request notification permission on startup
  yield fork(requestNotificationPermission);
  
  try {
    // Listen for start/pause actions
    while (true) {
      const action = yield take([startTimer.type, pauseTimer.type]);
      
      if (action.type === startTimer.type) {
        // Timer is started, timerSaga will handle the countdown
        continue;
      } else if (action.type === pauseTimer.type) {
        // Timer is paused, timerSaga will stop counting
        continue;
      }
    }
  } finally {
    // Clean up on saga cancellation
    yield cancel(timerTask);
    yield cancel(dailyStatsTask);
  }
}

export default pomodoroSaga;
