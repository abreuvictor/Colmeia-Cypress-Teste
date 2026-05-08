import './commands'

/**
 * Limpa TODO o estado de autenticação antes de cada teste.
 */
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
})
