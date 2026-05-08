import LoginPage from '../../support/pages/LoginPage'

/**
 * BUG-LOGIN-01 — Popup falso de erro com credenciais válidas.
 *
 * Comportamento observado:
 *   Ao fazer login com credenciais corretas, o sistema exibe um popup
 *   com a mensagem "Seu login está incorreto, quer continuar?" e um
 *   botão "Continuar". Ao clicar em Continuar, o login se completa
 *   normalmente.
 *
 * Comportamento esperado:
 *   Login com credenciais válidas deve autenticar o usuário diretamente,
 *   sem exibir mensagem de erro alguma.
 *
 */
describe('BUG-LOGIN-01 - Popup falso de erro com login válido', () => {
  it('Não deveria exibir popup de erro ao fazer login com credenciais válidas', () => {
    cy.fixture('users').then(({ valid }) => {
      LoginPage.visit().login(valid.email, valid.password)

      // Esperado: nenhum popup de erro aparece após submit do login válido.
      // Obtido: popup com mensagem "Seu login está incorreto, quer continuar?"
      // é exibido junto com botão "Continuar".
      LoginPage.shouldNotShowFakeErrorPopup()

      // Esperado: usuário é redirecionado direto pra área autenticada.
      cy.url({ timeout: 10000 }).should('not.match', /\/login\/?$/)
    })
  })

  it('Mensagem de erro NÃO deveria conter o texto "Seu login está incorreto" com credenciais válidas', () => {
    cy.fixture('users').then(({ valid }) => {
      LoginPage.visit().login(valid.email, valid.password)

      // Validação granular: o texto específico do bug não deve existir
      // em lugar nenhum da página após login com credenciais válidas.
      cy.contains(/seu\s*login\s*est[áa]\s*incorreto/i).should('not.exist')
    })
  })

  it('Botão "Continuar" NÃO deveria estar presente após login válido', () => {
    cy.fixture('users').then(({ valid }) => {
      LoginPage.visit().login(valid.email, valid.password)

      // Não deveria existir nenhum botão "Continuar" — afinal, o login
      // é válido, o usuário não precisa "continuar" nada.
      cy.contains('button', /^\s*continuar\s*$/i).should('not.exist')
    })
  })
})
