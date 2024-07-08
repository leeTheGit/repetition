import path from 'path'

export default {
  test: {
    globals: true,
    setupFiles: ['dotenv/config'],
    // environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    },
  },
}
