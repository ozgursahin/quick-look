import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import TasksPage from './components/TasksPage/TasksPage';
import SessionStorageProvider from './providers/SessionStorageProvider';
import { usePomodoroTimer } from './hooks/usePomodoroTimer';
import './App.css';

const AppContent = () => {
  // Initialize Pomodoro timer effects
  usePomodoroTimer();
  
  return (
    <div className="App">
      <TasksPage />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <SessionStorageProvider>
        <AppContent />
      </SessionStorageProvider>
    </Provider>
  );
}

export default App;
