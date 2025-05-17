import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mi-app/', // 👈 esto es importante para GitHub Pages
  plugins: [react()],
})
