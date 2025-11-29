// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this section to configure path aliases
  resolve: {
    alias: {
      // Map '@' to the 'src' directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Optional: Configure the dev server if needed (e.g., proxy for API calls)
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://127.0.0.1:8000', // Your Django backend URL
  //       changeOrigin: true,
  //       secure: false, // Set to true if your Django backend uses HTTPS
  //     },
  //   },
  // },
})