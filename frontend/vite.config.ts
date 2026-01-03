import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: 'featuremanager', // Use relative paths for easy deployment on GitHub Pages
  plugins: [vue()],
})
