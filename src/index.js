import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './AuthContext'; 
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Log environment for debugging
console.log('Environment:', process.env.NODE_ENV);
console.log('Public URL:', process.env.PUBLIC_URL);

// Error handling for the root render
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Failed to find the root element');
  document.body.innerHTML = '<div style="padding: 20px; color: red; font-family: sans-serif;">Failed to find the root element. Check if there\'s an element with id="root" in your HTML.</div>';
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render React app:', error);
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h2>Application Error</h2>
        <p>Failed to initialize the application.</p>
        <pre style="color: red;">${error.toString()}</pre>
      </div>
    `;
  }
}
