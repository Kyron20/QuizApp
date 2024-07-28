import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';  // Use the correct file name here
import './index.css';  // Ensure this file exists


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))

