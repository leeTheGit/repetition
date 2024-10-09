import { defineWorkspace } from 'vitest/config'

// defineWorkspace provides a nice type hinting DX
export default defineWorkspace([
  // matches every folder and file inside the `packages` folder
  'packages/*',
  {
    // add "extends" to merge two configs together
    extends: './vitest.config.ts',
    test: {
      include: ['**/*.testpoo.{ts,js}'],
      // it is recommended to define a name when using inline configs
      name: 'frontend',
      environment: 'jsdom',
    }
  },
  // {
  //   test: {
  //     include: ['**/*.test.{ts,js}'],
  //     name: 'core',
  //     environment: 'node',
  //   }
  // }
])
