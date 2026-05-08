import SidebarPage from '../../support/pages/SidebarPage'
import DatabasePage from '../../support/pages/DatabasePage'

/**
 * BUG-POS-06 — Exclusão de banco sem confirmação.
 *
 * Comportamento observado:
 *   Ao clicar em "Excluir" em um banco, ele é removido imediatamente,
 *   sem nenhum modal de confirmação ou aviso.
 *
 * Comportamento esperado:
 *   Operações destrutivas (exclusão) devem exigir confirmação explícita
 *   do usuário. Um modal com mensagem "Tem certeza que deseja excluir
 *   este banco?" e botões "Cancelar" / "Excluir".
 *
 */
describe('BUG-POS-06 - Exclusão de banco não exige confirmação', () => {
  beforeEach(() => {
    cy.loginToApp()
    SidebarPage.goToBancoDeDados()
  })

  it('Clique em "Excluir" deveria exibir um modal de confirmação ANTES de excluir', () => {
    const nome = `BancoExclusao-${Date.now()}`
    DatabasePage.createDatabase(nome)
    DatabasePage.shouldShowDatabase(nome)

    DatabasePage.deleteDatabase(nome)

    // Esperado: modal de confirmação aparece.
    DatabasePage.shouldShowConfirmationModal()

    // Esperado: o banco AINDA EXISTE na lista, pois a exclusão não foi
    // confirmada ainda.
    cy.contains(nome).should('be.visible')
  })

  it('Modal de confirmação deveria oferecer botão de "Cancelar"', () => {
    const nome = `BancoCancelar-${Date.now()}`
    DatabasePage.createDatabase(nome)
    DatabasePage.deleteDatabase(nome)

    cy.contains('button', /^\s*cancelar\s*$/i).should('be.visible')
  })

  it('Cancelar a exclusão deveria manter o banco na lista', () => {
    const nome = `BancoMantido-${Date.now()}`
    DatabasePage.createDatabase(nome)
    DatabasePage.deleteDatabase(nome)

    cy.contains('button', /^\s*cancelar\s*$/i).click()

    // Esperado: banco continua existindo após cancelar.
    DatabasePage.shouldShowDatabase(nome)
  })
})
