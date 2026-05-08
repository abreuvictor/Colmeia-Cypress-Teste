import SidebarPage from '../../support/pages/SidebarPage'
import DatabasePage from '../../support/pages/DatabasePage'

/**
 * BUG-POS-09 — Aceita caracteres especiais no nome do banco sem validação.
 *
 * Comportamento observado:
 *   O sistema permite criar bancos com nomes contendo caracteres
 *   especiais (ex: "Teste@#$%"), sem nenhuma validação ou sanitização.
 *
 * Comportamento esperado:
 *   Restringir a um conjunto seguro de caracteres (alfanuméricos
 *    + espaço + alguns símbolos como hífen e underscore)
 *
 */
describe('BUG-POS-09 - Aceita caracteres especiais sem validação adequada', () => {
  beforeEach(() => {
    cy.loginToApp()
    SidebarPage.goToBancoDeDados()
  })

  it('Não deveria executar scripts inseridos como nome (proteção XSS)', () => {
    cy.fixture('databases').then(({ withTags }) => {
      const alertStub = cy.stub()
      cy.on('window:alert', alertStub)

      DatabasePage.createDatabase(withTags)

      // Esperado: nenhum alert disparado (front sanitizou corretamente).
      cy.then(() => {
        expect(
          alertStub,
          'Tag <script> não deveria ter sido executada — XSS armazenado'
        ).to.not.have.been.called
      })
    })
  })

  it('Tag <script> renderizada deveria estar escapada como texto', () => {
    cy.fixture('databases').then(({ withTags }) => {
      DatabasePage.createDatabase(withTags)

      // Esperado: a tag aparece como texto literal,
      // Não como elemento.
      cy.contains(withTags).should('be.visible')
      cy.get('script').filter(`:contains("alert('xss')")`).should('not.exist')
    })
  })

  it('Não deveria permitir criar banco com aspas/SQL-injection no nome', () => {
    cy.fixture('databases').then(({ withSqlInjection }) => {
      DatabasePage.createDatabase(withSqlInjection)

      // Esperado: validação OU criação segura sem quebrar o app.
      // Se foi criado, valida que a aplicação ainda funciona normalmente.
      cy.contains(/erro\s*interno|database\s*error|sql/i).should('not.exist')
      cy.reload()
      cy.url().should('not.match', /\/login\/?$/)
    })
  })
})
