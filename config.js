
// For local development - this will be overridden by environment variables in production
window.APP_CONFIG = {
  API_KEY: import.meta.env?.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'
};
