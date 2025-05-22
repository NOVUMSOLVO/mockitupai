import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './AuthContext'; 
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Debug logging
console.log('=== APP INITIALIZING ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('Public URL:', process.env.PUBLIC_URL);
console.log('Node Env:', process.env.NODE_ENV);

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error || event.message || event);
  // Display error in the UI if root is available
  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; color: red;">
        <h2>Application Error</h2>
        <p>${event.message || 'An error occurred'}</p>
        <pre>${event.error?.stack || 'No stack trace available'}</pre>
      </div>
    `;
  }
});

// Error handling for the root render
const rootElement = document.getElementById('root');

if (!rootElement) {
  const errorMsg = 'Failed to find the root element. Check if there\'s an element with id="root" in your HTML.';
  console.error(errorMsg);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: sans-serif;">
      <h2>Fatal Error</h2>
      <p>${errorMsg}</p>
    </div>`;
} else {
  try {
    console.log('Creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('Rendering application...');
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
            <AuthProvider>
              <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
                <p>Rendering App component...</p>
                <App />
              </div>
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('Render complete');
  } catch (error) {
    console.error('Fatal error during render:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; color: red;">
        <h2>Fatal Error During Render</h2>
        <p>${error.message || 'An unknown error occurred'}</p>
        <pre>${error.stack || 'No stack trace available'}</pre>
      </div>`;
  }
}

// Log when the app is fully loaded
window.addEventListener('load', () => {
  console.log('=== APP FULLY LOADED ===');
  console.log('Root element:', document.getElementById('root'));
});
