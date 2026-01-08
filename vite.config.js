import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  // REMOVIDO O '1' DO FINAL PARA BATER COM A URL DO SEU PRINT
  base: command === 'build' ? '/portfolio-oficial/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 2000,
  }
}))