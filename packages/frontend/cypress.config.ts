import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localtest.me:3000',
    env: {
      email: 'test@email.com',
      password: '111111',
      loginUrl: '/auth/signin',
    },
  },
});
