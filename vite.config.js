import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': '',
      'X-Content-Type-Options': '',
      'X-Frame-Options': '',
      'Referrer-Policy': '',
      'Permissions-Policy': ''
    },
    middleware: [
      (req, res, next) => {
        // Remove all security headers
        res.setHeader('Content-Security-Policy', '');
        res.setHeader('X-Content-Type-Options', '');
        res.setHeader('X-Frame-Options', '');
        res.setHeader('Referrer-Policy', '');
        res.setHeader('Permissions-Policy', '');
        next();
      }
    ],
    hmr: {
      overlay: false
    }
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    exclude: ['@vitejs/plugin-react']
  }
})
