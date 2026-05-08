/**
 * Page Object da página "Banco de dados"
 */

const colmeiaBtn = (textRegex) =>
  cy.get('button[btn]').filter(':visible').contains(textRegex)

class DatabasePage {
  elements = {
    // Botão pra abrir o modal de criação de banco
    createButton: () =>
      colmeiaBtn(/^\s*(criar|novo|adicionar|\+\s*novo)/i).first(),

    // Input para o nome do banco
    nameInput: () =>
      cy.get('input[placeholder="Nome do item"], input[placeholder*="nome" i], input[autofocus]')
        .filter(':visible').first(),

    // Botão "Salvar" dentro do modal
    saveButton: () =>
      colmeiaBtn(/^\s*salvar\s*$/i).first(),

    // Mantemos o alias antigo para compatibilidade com specs que já existem
    confirmCreateButton: () =>
      colmeiaBtn(/^\s*(salvar|criar|confirmar|ok)\s*$/i).first(),

    // Botão "Cancelar" / "Fechar" do modal
    cancelButton: () =>
      colmeiaBtn(/^\s*cancelar\s*$/i).first(),

    panel: () =>
      cy.contains('h2, h3', /^\s*adicionar\s*novo\s*item\s*$/i)
        .parent()
        .filter(':visible'),

    // Lista/grid de bancos criados
    databaseList: () =>
      cy.get('[class*="list" i], [class*="grid" i], table, ul').filter(':visible'),

    // Item de banco específico — buscado por texto do nome
    databaseItem: (name) => cy.contains(name).filter(':visible'),

    // Toast / mensagens de validação
    validationMessage: () =>
      cy.get('[role="alert"], .toast, .error, [class*="error" i], [class*="validation" i]')
        .filter(':visible'),

    // Opções de "Ver arquivados" e "Ver deletados"
    viewArchivedOption: () =>
      cy.contains('button[btn], a, button', /arquivados|arquivado/i).filter(':visible'),

    viewDeletedOption: () =>
      cy.contains('button[btn], a, button', /deletados|exclu[ií]dos|lixeira/i).filter(':visible'),

    // Modal de confirmação (que deveria existir pra exclusão - BUG-POS-06)
    confirmationModal: () =>
      cy.contains(/tem\s*certeza|confirma|deseja\s*(excluir|deletar)/i).filter(':visible')
  }

  // ---------- Ações ----------

  /**
   * Cria um banco com o nome especificado.
   */
  createDatabase(name) {
    this.elements.createButton().click()
    this.elements.nameInput().should('be.visible').clear().type(name)
    this.elements.saveButton().click()
    return this
  }

  /**
   * Localiza o item de banco e clica no botão/menu de ação dele.
   */
  openDatabaseActions(name) {
    this.elements.databaseItem(name)
      .closest('tr, li, [class*="row" i], [class*="item" i], [class*="card" i]')
      .first()
      .within(() => {
        cy.get('button[btn], button, [role="button"]').then(($btns) => {
          if ($btns.length > 0) {
            cy.wrap($btns).last().click()
          }
        })
      })
    return this
  }

  archiveDatabase(name) {
    this.openDatabaseActions(name)
    cy.contains('button, a, [role="menuitem"]', /arquivar/i).click()
    return this
  }

  deleteDatabase(name) {
    this.openDatabaseActions(name)
    cy.contains('button, a, [role="menuitem"]', /excluir|deletar|remover/i).click()
    return this
  }

  // ---------- Validações ----------

  shouldShowDatabase(name) {
    this.elements.databaseItem(name).should('be.visible')
    return this
  }

  shouldNotShowDatabase(name) {
    cy.contains(name).should('not.exist')
    return this
  }

  shouldShowValidationError() {
    this.elements.validationMessage().should('be.visible')
    return this
  }

  shouldShowConfirmationModal() {
    this.elements.confirmationModal().should('be.visible')
    return this
  }
}

export default new DatabasePage()
