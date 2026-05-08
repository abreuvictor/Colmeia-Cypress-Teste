import LoginPage from '../../support/pages/LoginPage'

/**
 * Cenários de login com sucesso.
 *
 * Observação: o CT01 valida o "happyday — sem popup intermediário.
 * Enquanto o BUG-LOGIN-01 estiver ativo, este teste falha.
 * O teste documenta o comportamento esperado e
 * automaticamente passa a passar quando o bug for corrigido.
 *
 */
describe('Login - Cenários de sucesso', () => {
  it('CT01 - Deve fazer login com credenciais válidas e ir direto para a área autenticada', () => {
    cy.fixture('users').then(({ valid }) => {
      LoginPage.visit().login(valid.email, valid.password)

      // Esperado: usuário sai da tela de login imediatamente, sem popups.
      LoginPage.shouldNotShowFakeErrorPopup()
      cy.url({ timeout: 15000 }).should('not.match', /\/login\/?$/)
    })
  })

  it('CT02 - Deve persistir a sessão após reload da página', () => {
    // Usa o comando customizado que ignora o popup falso (workaround).
    cy.loginToApp()
    cy.url({ timeout: 15000 }).should('not.match', /\/login\/?$/)

    cy.reload()

    // Esperado: após reload, o usuário continua autenticado.
    cy.url().should('not.match', /\/login\/?$/)
  })
})
