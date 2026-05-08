import SidebarPage from '../../support/pages/SidebarPage'
import DatabasePage from '../../support/pages/DatabasePage'

/**
 * BUG-POS-08 — Permite criar banco com nome excessivamente longo.
 *
 * Comportamento observado:
 *   Não há limite de caracteres no nome do banco. É possível criar
 *   bancos com nomes muito longos, que quebram o
 *   layout da interface (overflow, quebras visuais, alinhamento etc).
 *
 * Comportamento esperado:
 *   O sistema deveria limitar o tamanho do nome com `maxlength` 
 *   no input e/ou validação no backend,
 *   exibindo mensagem clara quando o limite for excedido.
 *
 */
describe('BUG-POS-08 - Permite criar banco com nome excessivamente longo', () => {
  beforeEach(() => {
    cy.loginToApp()
    SidebarPage.goToBancoDeDados()
  })

  it('Input de nome deveria ter atributo maxlength definido', () => {
    DatabasePage.elements.createButton().click()
    DatabasePage.elements.nameInput().should('be.visible')

    // Esperado: input com maxlength razoável.
    DatabasePage.elements.nameInput()
      .should('have.attr', 'maxlength')
      .then((maxlength) => {
        expect(parseInt(maxlength, 10)).to.be.within(1, 200)
      })
  })

  it('Não deveria permitir criar banco com 100 caracteres', () => {
    cy.fixture('databases').then(({ longName }) => {
      DatabasePage.elements.createButton().click()
      DatabasePage.elements.nameInput().should('be.visible').clear().type(longName)
      DatabasePage.elements.saveButton().click()

      // Esperado: validação visível impedindo a criação.
      DatabasePage.shouldShowValidationError()
    })
  })

  it('Quando exibido, nome NÃO deveria quebrar o layout', () => {
    cy.fixture('databases').then(({ longName }) => {
      // Mesmo que a criação seja permitida (bug presente), o teste valida
      // que o layout da página não fica quebrado.
      DatabasePage.createDatabase(longName)

      // Esperado: nenhum elemento com overflow horizontal além da viewport.
      cy.window().then((win) => {
        cy.document().then((doc) => {
          const viewportWidth = win.innerWidth
          const bodyWidth = doc.body.scrollWidth

          expect(
            bodyWidth,
            `Nome muito longo causou overflow horizontal (body: ${bodyWidth}px, viewport: ${viewportWidth}px)`
          ).to.be.lte(viewportWidth + 5) // 5px de tolerância
        })
      })
    })
  })
})
