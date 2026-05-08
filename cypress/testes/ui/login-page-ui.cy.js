import LoginPage from '../../support/pages/LoginPage'

describe('Login - Validação de elementos da UI', () => {
  beforeEach(() => {
    LoginPage.visit()
  })

  it('CT17 - Deve exibir o logo da Colmeia', () => {
    LoginPage.elements.logo().should('be.visible')
  })

  it('CT18 - Deve exibir os campos de e-mail e senha', () => {
    LoginPage.elements.emailInput()
      .should('be.visible')
      .and('have.attr', 'type', 'email')

    LoginPage.elements.passwordInput()
      .should('be.visible')
      .and('have.attr', 'type', 'password')
  })

  it('CT19 - Deve exibir o botão "Entrar"', () => {
    LoginPage.elements.submitButton()
      .should('be.visible')
      .and('not.be.disabled')
  })

  it('CT20 - Deve exibir o link "Esqueceu sua senha?"', () => {
    LoginPage.elements.forgotPasswordLink()
      .should('be.visible')
      .and('have.attr', 'href')
  })

  it('CT21 - Deve permitir interação com todos os campos via teclado (acessibilidade)', () => {
    LoginPage.elements.emailInput().focus().should('be.focused')
    LoginPage.elements.passwordInput().focus().should('be.focused')
    LoginPage.elements.submitButton().focus().should('be.focused')
  })

  it('CT22 - Deve permitir submit do form pressionando Enter', () => {
    cy.fixture('users').then(({ valid }) => {
      LoginPage.fillEmail(valid.email)
      LoginPage.fillPassword(valid.password)
      LoginPage.elements.passwordInput().type('{enter}', { log: false })

      // Esperado: o Enter dispara o login.
      cy.url({ timeout: 15000 }).should('not.match', /\/login\/?$/)
    })
  })

  it('CT23 - Deve ser responsivo em viewport mobile', () => {
    cy.viewport('iphone-x')
    LoginPage.elements.emailInput().should('be.visible')
    LoginPage.elements.passwordInput().should('be.visible')
    LoginPage.elements.submitButton().should('be.visible')
  })

  it('CT24 - Deve ser responsivo em viewport tablet', () => {
    cy.viewport('ipad-2')
    LoginPage.elements.emailInput().should('be.visible')
    LoginPage.elements.passwordInput().should('be.visible')
    LoginPage.elements.submitButton().should('be.visible')
  })

  it('CT25 - Título da página deve ser informativo', () => {
    cy.title().should('not.be.empty').and('match', /colmeia|login|qa/i)
  })
})
