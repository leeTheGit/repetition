import path from 'path'

export default {
  test: {
    // globals: true,
    setupFiles: ['dotenv/config'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
}
