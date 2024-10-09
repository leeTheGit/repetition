import { defineProject } from 'vitest/config'
import path from "path"

// https://stackoverflow.com/questions/77249074/how-do-i-use-typescript-path-aliases-in-vite
export default defineProject({
  test: {
    // globals: true,
    environment: 'node',
    setupFiles: ['dotenv/config'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      "@repetition/frontend": path.resolve(__dirname, "../frontend/src"),
      "@repetition/core": path.resolve(__dirname, "../core/src"),
      "@repetition/functions": path.resolve(__dirname, "../functions/src"),

    },
  },
})
