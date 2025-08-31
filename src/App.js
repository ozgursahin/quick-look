import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import TasksPage from './components/TasksPage/TasksPage';
import SessionStorageProvider from './providers/SessionStorageProvider';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <SessionStorageProvider>
        <div className="App">
          <TasksPage />
        </div>
      </SessionStorageProvider>
    </Provider>
  );
}

export default App;
