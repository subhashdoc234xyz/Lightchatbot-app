import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // base: './' ensures relative paths so assets load correctly in Electron file:// and Capacitor local web view
  base: './',
  server: {
    port: 5173,
  },
});
