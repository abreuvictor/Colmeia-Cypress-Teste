import SidebarPage from '../../support/pages/SidebarPage'
import DatabasePage from '../../support/pages/DatabasePage'

/**
 * BUG-POS-04 — Permite criação de bancos com nomes duplicados.
 *
 * Comportamento observado:
 *   É possível criar dois ou mais bancos com exatamente o mesmo nome.
 *   Nenhuma validação é exibida e ambos os registros aparecem na lista,
 *   tornando impossível diferenciá-los.
 *
 * Comportamento esperado:
 *   O sistema deveria validar a unicidade do nome e exibir mensagem de
 *   erro (ex: "Já existe um banco com este nome") impedindo a criação
 *   duplicada.
 *
 */
describe('BUG-POS-04 - Banco de dados permite nomes duplicados', () => {
  beforeEach(() => {
    cy.loginToApp()
    SidebarPage.goToBancoDeDados()
  })

  it('Não deveria permitir criar dois bancos com o mesmo nome', () => {
    cy.fixture('databases').then(({ duplicateName }) => {
      // 1. Cria o primeiro banco
      DatabasePage.createDatabase(duplicateName)
      DatabasePage.shouldShowDatabase(duplicateName)

      // 2. Tenta criar o segundo com o mesmo nome
      DatabasePage.createDatabase(duplicateName)

      // Esperado: erro de validação e nenhum segundo banco criado.
      DatabasePage.shouldShowValidationError()

      // Verifica que só existe UM banco com aquele nome (e não dois).
      cy.contains(duplicateName).should('have.length', 1)
    })
  })

  it('Mensagem de erro deveria ser clara sobre o motivo da rejeição', () => {
    cy.fixture('databases').then(({ duplicateName }) => {
      DatabasePage.createDatabase(duplicateName)
      DatabasePage.createDatabase(duplicateName)

      // Esperado: mensagem informativa, não genérica.
      cy.contains(/j[áa]\s*existe|duplicad|nome\s*em\s*uso|already\s*exists/i)
        .should('be.visible')
    })
  })
})
