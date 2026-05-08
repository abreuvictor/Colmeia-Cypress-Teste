const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://teste-colmeia-qa.colmeia-corp.com',
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0
    },
    setupNodeEvents(on, config) {
      // implementar listeners de eventos aqui se necessário
    },
    specPattern: 'cypress/testes/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/setup.js'
  },
  env: {
    validUser: {
      email: 'qa@test.com',
      password: '123456'
    }
  }
})
