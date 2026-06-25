import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config — proxy /api to the local backend in dev to avoid CORS hassle.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
