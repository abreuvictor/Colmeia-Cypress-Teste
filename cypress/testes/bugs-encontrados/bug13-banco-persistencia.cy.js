import SidebarPage from '../../support/pages/SidebarPage'
import DatabasePage from '../../support/pages/DatabasePage'

/**
 * BUG-POS-11 — Bancos não persistem após recarregar a página.
 *
 * Comportamento observado:
 *   Após criar um banco, ao recarregar a página o registro desaparece.
 *   Os dados parecem estar somente em memória / state do front-end,
 *   sem persistência no backend ou storage.
 *
 * Comportamento esperado:
 *   Os bancos criados deveriam persistir no backend e estar disponíveis
 *   após reload da página, em uma nova sessão, ou em um novo navegador.
 *
 */
describe('BUG-POS-11 - Bancos criados não persistem após reload', () => {
  beforeEach(() => {
    cy.loginToApp()
    SidebarPage.goToBancoDeDados()
  })

  it('Banco criado deveria continuar visível após F5 (reload)', () => {
    const nome = `Persistencia-${Date.now()}`

    // 1. Cria o banco e confirma que apareceu
    DatabasePage.createDatabase(nome)
    DatabasePage.shouldShowDatabase(nome)

    // 2. Recarrega a página
    cy.reload()
    cy.wait(2000)

    // 3. Re-navega até banco de dados
    cy.get('body').then(($body) => {
      if (!$body.text().match(new RegExp(nome))) {
        SidebarPage.goToBancoDeDados()
      }
    })

    // Esperado: banco continua visível após reload.
    DatabasePage.shouldShowDatabase(nome)
  })

  it('Banco criado deveria persistir entre sessões diferentes', () => {
    const nome = `Sessao-${Date.now()}`

    // 1. Cria o banco
    DatabasePage.createDatabase(nome)
    DatabasePage.shouldShowDatabase(nome)

    // 2. Limpa cookies e storage (simulando nova sessão)
    cy.clearCookies()
    cy.clearLocalStorage()

    // 3. Loga novamente e navega até banco de dados
    cy.loginToApp()
    SidebarPage.goToBancoDeDados()

    // Esperado: banco continua existindo na nova sessão.
    DatabasePage.shouldShowDatabase(nome)
  })
})
