import SidebarPage from '../../support/pages/SidebarPage'
import DatabasePage from '../../support/pages/DatabasePage'

/**
 * BUG-POS-10 — Não há funcionalidade para visualizar/recuperar bancos deletados.
 *
 * Comportamento observado:
 *   Uma vez excluído, o banco é perdido permanentemente. Não há opção
 *   "Lixeira", "Bancos deletados", "Recuperar", etc.
 *
 * Comportamento esperado:
 *   Operações destrutivas devem ser reversíveis. Soft delete (com
 *   possibilidade de restauração por algum período, ex: 30 dias) é
 *   o padrão da indústria para sistemas profissionais.
 *
 */
describe('BUG-POS-10 - Não há funcionalidade de lixeira / recuperação de deletados', () => {
  beforeEach(() => {
    cy.loginToApp()
    SidebarPage.goToBancoDeDados()
  })

  it('Deveria existir opção "Ver bancos deletados" / "Lixeira" na UI', () => {
    DatabasePage.elements.viewDeletedOption().should('exist')
  })

  it('Banco excluído deveria aparecer na visualização de deletados', () => {
    const nome = `BancoDeletado-${Date.now()}`

    // 1. Cria e exclui o banco
    DatabasePage.createDatabase(nome)
    DatabasePage.shouldShowDatabase(nome)
    DatabasePage.deleteDatabase(nome)

    // Confirma se houver modal
    cy.get('body').then(($body) => {
      if ($body.find(':contains("Tem certeza")').length > 0) {
        cy.contains('button', /excluir|confirmar/i).click()
      }
    })

    // 2. Acessa visualização de deletados
    DatabasePage.elements.viewDeletedOption().click()
    cy.wait(1000)

    // Esperado: banco deletado aparece nesta listagem.
    DatabasePage.shouldShowDatabase(nome)
  })

  it('Deveria permitir restaurar um banco deletado', () => {
    DatabasePage.elements.viewDeletedOption().click()
    cy.wait(1000)

    // Esperado: ação de "Restaurar" disponível na lista de deletados.
    cy.contains('button, a, [role="menuitem"]', /restaurar|recuperar|reverter/i)
      .should('exist')
  })
})
