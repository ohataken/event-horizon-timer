import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  build: {
    outDir: "../src/dest",
    rollupOptions: {
      input: {
        appIndex: resolve(__dirname, './index.html'),
        appOptionsPage: resolve(__dirname, './options_page.html'),
      }
    },    
  },
})
