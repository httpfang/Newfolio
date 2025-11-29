import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'gsap-vendor': ['gsap', '@gsap/react'],
          'animation-vendor': ['lenis', 'motion'],
          // Separate heavy UI libraries
          'ui-vendor': [
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            'lucide-react',
            'react-icons',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase limit slightly for better chunking
  },
})
