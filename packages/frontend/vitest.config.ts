// https://stackoverflow.com/questions/72146352/vitest-defineconfig-test-does-not-exist-in-type-userconfigexport

import { defineProject } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from "path"


export default defineProject({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/testSetup.ts',
  },
  plugins: [react()],
  resolve: {
    alias:{
      '@': path.resolve(__dirname, './src'),
      "@repetition/frontend": path.resolve(__dirname, "../frontend/src"),
      "@repetition/core": path.resolve(__dirname, "../core/src"),
      "@repetition/functions": path.resolve(__dirname, "../functions/src"),
    }
  },
})
