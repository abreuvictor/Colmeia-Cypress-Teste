import SidebarPage from '../../support/pages/SidebarPage'
import DatabasePage from '../../support/pages/DatabasePage'

/**
 * BUG-POS-05 — Bancos arquivados não aparecem em "Ver bancos arquivados".
 *
 * Comportamento observado:
 *   Após arquivar um banco, ao acessar a opção "Ver bancos arquivados"
 *   a lista aparece vazia, mesmo que tenha bancos arquivados.
 *
 * Comportamento esperado:
 *   Os bancos previamente arquivados deveriam aparecer na visualização
 *   de arquivados, idealmente com opções de restaurar ou excluir
 *   permanentemente.
 *
 */
describe('BUG-POS-05 - Bancos arquivados não aparecem na listagem de arquivados', () => {
  beforeEach(() => {
    cy.loginToApp()
    SidebarPage.goToBancoDeDados()
  })

  it('Banco arquivado deveria aparecer na visualização "Ver bancos arquivados"', () => {
    const nome = `Arquivado-${Date.now()}` // nome único para evitar colisão entre execuções

    // 1. Cria e arquiva o banco
    DatabasePage.createDatabase(nome)
    DatabasePage.shouldShowDatabase(nome)
    DatabasePage.archiveDatabase(nome)

    // 2. Após arquivar, o banco não deve aparecer na lista principal
    DatabasePage.shouldNotShowDatabase(nome)

    // 3. Acessa visualização de arquivados
    DatabasePage.elements.viewArchivedOption().click()
    cy.wait(1000)

    // Esperado: o banco arquivado aparece nesta listagem.
    DatabasePage.shouldShowDatabase(nome)
  })

  it('Visualização de arquivados deveria ter botão para retornar/desarquivar', () => {
    DatabasePage.elements.viewArchivedOption().click()
    cy.wait(1000)

    // Esperado: existir alguma ação de "desarquivar" / "restaurar".
    cy.contains('button, a, [role="menuitem"]', /desarquivar|restaurar|reativar/i)
      .should('exist')
  })
})
