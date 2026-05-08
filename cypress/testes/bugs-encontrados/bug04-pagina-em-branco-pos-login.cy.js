import DashboardPage from '../../support/pages/DashboardPage'

/**
 * BUG-POS-02 — Página inicial pós-login está em branco.
 *
 * Comportamento observado:
 *   Após o login, o usuário é redirecionado para uma página em branco.
 *   Apenas a barra lateral (com ícone de megafone e logo) é renderizada,
 *   sem conteúdo principal, dashboard, mensagem de boas-vindas, nem
 *   navegação visível.
 *
 * Comportamento esperado:
 *   A página inicial deveria exibir um dashboard, página de apresentação,
 *   tela de boas-vindas ou pelo menos um menu/cards de navegação para
 *   as funcionalidades do sistema.
 *
 */
describe('BUG-POS-02 - Página inicial pós-login está em branco', () => {
  beforeEach(() => {
    cy.loginToApp()
  })

  it('Área principal deveria conter conteúdo significativo (não estar em branco)', () => {
    DashboardPage.shouldNotBeBlank()
  })

  it('Deveria existir uma área <main> ou conteúdo principal renderizado', () => {
    // Esperado: a aplicação deveria ter um <main> com conteúdo.
    DashboardPage.elements.mainContent()
      .should('exist')
      .and('not.be.empty')
  })

  it('Deveria haver elementos navegáveis além do ícone de megafone', () => {
    // Esperado: mais elementos clicáveis na UI (links/botões além do megafone).
    cy.get('a:visible, button:visible')
      .should('have.length.greaterThan', 2)
  })

  it('Não deveria haver erros JavaScript no console após carregamento da página', () => {
    // Captura erros JS como evidência adicional do bug.
    cy.window().then((win) => {
      cy.spy(win.console, 'error').as('consoleError')
    })

    cy.reload()
    cy.loginToApp()
    cy.wait(2000)

    cy.get('@consoleError').should('not.have.been.called')
  })
})
