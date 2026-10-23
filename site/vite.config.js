import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' keeps asset paths relative, so dist/ works from any folder or host.
// Fonts are inlined so the build has no font requests to block.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { assetsInlineLimit: 200000, chunkSizeWarningLimit: 800 },
})
