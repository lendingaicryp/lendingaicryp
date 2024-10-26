// File: assets/js/vercel-analytics.js
import { inject } from 'https://unpkg.com/@vercel/analytics';

function initVercelAnalytics() {
  inject();
  console.log('Vercel Analytics initialized');
}

// Initialize analytics when the script loads
initVercelAnalytics();

