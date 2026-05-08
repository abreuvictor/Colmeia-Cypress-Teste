import LoginPage from '../../support/pages/LoginPage'

/**
 * BUG-LOGIN-02 — Link "Esqueci minha senha" não funciona.
 *
 * Comportamento observado:
 *   Ao clicar no link "Esqueci minha senha", nada acontece. A página
 *   permanece na tela de login, sem redirecionamento e sem modal aberto.
 *
 * Comportamento esperado:
 *   O clique deveria redirecionar para uma tela/modal de recuperação
 *   de senha, onde o usuário pode informar seu e-mail para receber
 *   instruções de redefinição.
 *
 */
describe('BUG-LOGIN-02 - Link "Esqueci minha senha" não funciona', () => {
  beforeEach(() => {
    LoginPage.visit()
  })

  it('Link "Esqueci minha senha" deveria estar visível e clicável', () => {
    LoginPage.elements.forgotPasswordLink()
      .should('be.visible')
      .and('not.be.disabled')
  })

  it('Clique no link deveria redirecionar para tela de recuperação OU abrir modal', () => {
    cy.url().then((urlBefore) => {
      LoginPage.elements.forgotPasswordLink().click()

      // Esperado: URL muda (redirecionamento para tela de recuperação)
      cy.wait(1000)

      cy.url().then((urlAfter) => {
        cy.get('body').then(($body) => {
          const modalOpen =
            $body.find('[role="dialog"], .modal, [class*="modal" i]:visible').length > 0
          const urlChanged = urlAfter !== urlBefore

          expect(
            urlChanged || modalOpen,
            'Esperado: redirecionamento de recuperação. Obtido: nada acontece.'
          ).to.be.true
        })
      })
    })
  })

  it('Após clicar, deveria existir campo para informar e-mail de recuperação', () => {
    LoginPage.elements.forgotPasswordLink().click()
    cy.wait(1000)

    // Esperado: campo de e-mail visível na tela de recuperação.
    cy.get('input[type="email"], input[name*="email" i]')
      .filter(':visible')
      .should('have.length.at.least', 1)
  })
})
