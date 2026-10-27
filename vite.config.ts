import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'production' && !loadEnv(mode, '.', '').VITE_TURNSTILE_SITE_KEY) {
    throw new Error('VITE_TURNSTILE_SITE_KEY is required for a production build')
  }
  return {
    plugins: [react(), tailwindcss()],
  }
})
