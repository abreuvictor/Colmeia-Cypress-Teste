import LoginPage from './pages/LoginPage'

/**
 * Faz login completo e entra na área autenticada.
 */
Cypress.Commands.add('loginToApp', () => {
  const { email, password } = Cypress.env('validUser')
  LoginPage.visit().loginIgnoringFakePopup(email, password)
  // Garante que saiu da tela de login antes de prosseguir
  cy.url({ timeout: 15000 }).should('not.match', /\/login\/?$/)
})

/**
 * Cc.session — cacheia o login entre testes para acelerar a execução.
 */
Cypress.Commands.add('loginToAppViaSession', () => {
  const { email, password } = Cypress.env('validUser')
  cy.session(
    [email, password],
    () => {
      LoginPage.visit().loginIgnoringFakePopup(email, password)
      cy.url({ timeout: 15000 }).should('not.match', /\/login\/?$/)
    },
    {
      cacheAcrossSpecs: true
    }
  )
  cy.visit('/')
})

/**
 * Captura erros não tratados do app.
 */
Cypress.on('uncaught:exception', (err) => {
  Cypress.log({
    name: 'uncaught:exception',
    message: err.message,
    consoleProps: () => ({ error: err })
  })
  return false
})
