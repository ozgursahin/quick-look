import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import TasksPage from './components/TasksPage/TasksPage';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <TasksPage />
      </div>
    </Provider>
  );
}

export default App;
