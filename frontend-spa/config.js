// ---------------------------------------------------------------------------
// API base URL configuration (no build step — just edit this file).
//
// Local development falls back to the CodeIgniter dev server on :8080.
// In production (any non-localhost host, e.g. Vercel) it uses the deployed
// backend below. After deploying the backend to Render, replace the URL with
// your real service URL (no trailing slash), then redeploy the frontend.
// ---------------------------------------------------------------------------
window.API_BASE_URL =
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://REPLACE-WITH-YOUR-RENDER-URL.onrender.com';
