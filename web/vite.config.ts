import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the built files load from https://cfx-nui-<resource>/web/dist/.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
  },
  server: {
    host: '127.0.0.1',
    port: 5174,
  },
})
