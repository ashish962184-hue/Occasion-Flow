import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  document.body.innerHTML = '<div style="padding: 2rem; color: #ef4444; font-family: system-ui, sans-serif; text-align: center; margin-top: 20vh;"><h1>Deployment Configuration Error</h1><p><b>VITE_API_URL</b> is missing from Vercel Environment Variables.</p><p>Please configure it in Vercel Settings and redeploy.</p></div>';
  throw new Error("FATAL: VITE_API_URL is missing from production environment variables.");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
