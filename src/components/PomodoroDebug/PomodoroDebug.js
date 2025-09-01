import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { completePhase, resetAllPomodoro, POMODORO_PHASES } from '../../store/slices/pomodoroSlice';

const PomodoroDebug = () => {
  const dispatch = useDispatch();
  const pomodoro = useSelector(state => state.pomodoro);
  
  const testCycle = () => {
    console.log('=== POMODORO CYCLE TEST ===');
    
    // Simulate completing phases
    for (let i = 0; i < 10; i++) {
      console.log(`Step ${i + 1}:`);
      console.log(`  Current Phase: ${pomodoro.currentPhase}`);
      console.log(`  Completed Sessions: ${pomodoro.completedSessions}`);
      console.log(`  Sessions until long break: ${pomodoro.sessionsUntilLongBreak - (pomodoro.completedSessions % pomodoro.sessionsUntilLongBreak)}`);
      
      dispatch(completePhase());
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', margin: '20px', borderRadius: '8px' }}>
      <h3>Pomodoro Debug Panel</h3>
      <div>
        <p><strong>Current Phase:</strong> {pomodoro.currentPhase}</p>
        <p><strong>Completed Sessions:</strong> {pomodoro.completedSessions}</p>
        <p><strong>Sessions Until Long Break:</strong> {pomodoro.sessionsUntilLongBreak - (pomodoro.completedSessions % pomodoro.sessionsUntilLongBreak)}</p>
        <p><strong>Is Running:</strong> {pomodoro.isRunning ? 'Yes' : 'No'}</p>
      </div>
      <div style={{ marginTop: '15px' }}>
        <button 
          onClick={testCycle}
          style={{ 
            padding: '8px 16px', 
            marginRight: '10px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Test Cycle (Check Console)
        </button>
        <button 
          onClick={() => dispatch(resetAllPomodoro())}
          style={{ 
            padding: '8px 16px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default PomodoroDebug;
