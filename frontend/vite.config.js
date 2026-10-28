import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dev server proxies `/api/*` to the Express backend so the browser only
// ever talks to a single origin (no CORS issues, no hard-coded host in code).
const API_TARGET = process.env.VITE_PROXY_TARGET || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
  },
});
