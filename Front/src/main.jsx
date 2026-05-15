import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './pages/dashboard/Dashboard';
import './styles.css';

function App() {
  return (
    <Dashboard />
  );
}

createRoot(document.getElementById('root')).render(<App />);
