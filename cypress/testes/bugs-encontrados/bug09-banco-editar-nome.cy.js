import SidebarPage from '../../support/pages/SidebarPage'
import DatabasePage from '../../support/pages/DatabasePage'

/**
 * BUG-POS-07 — Não é possível editar o nome do banco após criação.
 *
 * Comportamento observado:
 *   Após criar um banco, não há nenhuma opção de edição do nome
 *   disponível na UI (sem botão "Editar", sem opção em menu de
 *   contexto, sem inline-edit).
 *
 * Comportamento esperado:
 *   Operações de CRUD devem ser completas. Deve existir uma forma de
 *   editar o nome do banco — seja via botão "Editar", menu de ações,
 *   ou edição inline no nome.
 *
 */
describe('BUG-POS-07 - Não há opção para editar nome do banco', () => {
  beforeEach(() => {
    cy.loginToApp()
    SidebarPage.goToBancoDeDados()
  })

  it('Deveria existir alguma opção de edição do nome do banco', () => {
    const nome = `BancoEditar-${Date.now()}`
    DatabasePage.createDatabase(nome)
    DatabasePage.shouldShowDatabase(nome)

    // Tenta abrir as ações do item
    DatabasePage.openDatabaseActions(nome)

    // Esperado: alguma opção de "Editar" / "Renomear" deve existir.
    cy.contains('button, a, [role="menuitem"]', /^\s*(editar|renomear|edit|rename)\s*$/i)
      .should('be.visible')
  })

  it('Editar deveria permitir alterar o nome para um novo valor', () => {
    const nomeOriginal = `Original-${Date.now()}`
    const nomeNovo = `Renomeado-${Date.now()}`

    DatabasePage.createDatabase(nomeOriginal)
    DatabasePage.openDatabaseActions(nomeOriginal)

    cy.contains('button, a, [role="menuitem"]', /editar|renomear|edit|rename/i).click()

    // Esperado: input habilitado pra digitar o novo nome.
    cy.get('input[type="text"]:visible, input:not([type]):visible')
      .first()
      .clear()
      .type(nomeNovo)

    cy.contains('button', /^\s*(salvar|confirmar|ok)\s*$/i).click()

    // Validação final: o nome novo aparece, o antigo não.
    DatabasePage.shouldShowDatabase(nomeNovo)
    DatabasePage.shouldNotShowDatabase(nomeOriginal)
  })
})
