import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// We use a unique ID to prevent conflicts with WordPress themes
const rootElement = document.getElementById('sales-intelligence-core-root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
