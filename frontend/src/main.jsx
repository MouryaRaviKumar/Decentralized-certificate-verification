// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BlockchainProvider } from './BlockchainContext'; // Import the Context Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* CRITICAL: Wrap the entire application in the BlockchainProvider. */}
    {/* This makes the current wallet, contract instance, and connection status available to all components. */}
    <BlockchainProvider> 
      <App />
    </BlockchainProvider>
  </React.StrictMode>,
);