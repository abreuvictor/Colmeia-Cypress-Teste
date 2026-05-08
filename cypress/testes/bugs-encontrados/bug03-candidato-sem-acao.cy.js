import DashboardPage from '../../support/pages/DashboardPage'

/**
 * BUG-POS-01 — Botão "Candidato" na barra superior sem ação.
 *
 * Comportamento observado:
 *   Após o login, há um campo "Candidato" no header, mas clicar nele
 *   não produz nenhum efeito: não redireciona, não abre menu dropdown,
 *   não exibe opções de perfil/logout.
 *
 * Comportamento esperado:
 *   Clicar no campo deveria abrir um menu dropdown com opções como
 *   "Perfil", "Configurações", "Sair", OU redirecionar para uma página
 *   de gerenciamento de candidato.
 *
 */
describe('BUG-POS-01 - Botão "Candidato" no header não tem ação', () => {
  beforeEach(() => {
    cy.loginToApp()
  })

  it('Botão "Candidato" deveria estar visível no header', () => {
    DashboardPage.elements.candidatoButton().should('be.visible')
  })

  it('Clique no botão "Candidato" deveria produzir alguma ação (redirect ou dropdown)', () => {
    DashboardPage.candidatoShouldHaveAction()
  })

  it('Deveria existir uma forma de fazer logout pela UI', () => {
    // Tenta acionar o botão Candidato pra abrir menu (caminho mais provável)
    DashboardPage.elements.candidatoButton().click()
    cy.wait(500)

    // Esperado: opção de "Sair" / "Logout" disponível em algum lugar da UI.
    cy.contains(/^\s*(sair|logout|log\s*out|encerrar\s*sess[ãa]o)\s*$/i)
      .should('be.visible')
  })
})
