import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      '/med': {
        target: 'https://s92t9ee2c1.execute-api.ap-northeast-2.amazonaws.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
