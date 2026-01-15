import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Import Bootstrap CSS and JavaScript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Get the root element from HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside React.StrictMode (helps find potential problems)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
