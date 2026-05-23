import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { TodoProvider } from './context/TodoContext.jsx';
import './index.css';

// Wrapping the entire app in TodoProvider makes data available to all components
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TodoProvider>
      <App />
    </TodoProvider>
  </React.StrictMode>
);