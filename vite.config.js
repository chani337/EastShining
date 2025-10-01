import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // 프론트 서버 포트
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // 백엔드 서버
        changeOrigin: true,
        secure: false
      }
    }
  }
})