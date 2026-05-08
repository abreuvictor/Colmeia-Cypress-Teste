/**
 * Page Object da tela de Login
 */
class LoginPage {
  // ---------- Seletores ----------
  elements = {
    logo: () => cy.get('img[alt*="logo" i], img[src*="logo"]'),

    emailInput: () =>
      cy.get('input[type="email"], input[name="email"], input[id*="email" i]').first(),

    passwordInput: () =>
      cy.get('input[type="password"], input[name="password"], input[id*="password" i]').first(),

    submitButton: () =>
      cy.contains('button', /^\s*(entrar|login|sign\s*in)\s*$/i),

    forgotPasswordLink: () =>
      cy.contains('a, button', /esqueci\s*minha\s*senha|esqueceu\s*sua\s*senha|forgot/i),

    // Mensagens genéricas de erro (toasts, alerts inline)
    errorMessage: () =>
      cy.get('[role="alert"], .error, .alert, .toast, [class*="error" i]'),

    // Mensagem específica de credenciais inválidas
    invalidCredentialsMessage: () =>
      cy.contains(/usu[áa]rio\s*ou\s*senha\s*inv[áa]lidos/i).first(),

    // ---------- Popup falso de erro (BUG-LOGIN-01) ----------
    fakeErrorPopupText: () =>
      cy.contains(/seu\s*login\s*est[áa]\s*incorreto/i),

    fakeErrorPopupContinueButton: () =>
      cy.contains('button', /^\s*continuar\s*$/i)
  }

  // ---------- Ações ----------
  visit() {
    cy.visit('/')
    return this
  }

  fillEmail(email) {
    if (email !== '') {
      this.elements.emailInput().clear().type(email, { delay: 0 })
    } else {
      this.elements.emailInput().clear()
    }
    return this
  }

  fillPassword(password) {
    if (password !== '') {
      this.elements.passwordInput().clear().type(password, { delay: 0, log: false })
    } else {
      this.elements.passwordInput().clear()
    }
    return this
  }

  submit() {
    this.elements.submitButton().click()
    return this
  }

  /**
   * Login simples - NÃO trata o popup falso.
   */
  login(email, password) {
    this.fillEmail(email)
    this.fillPassword(password)
    this.submit()
    return this
  }

  /**
   * Login que ignora o popup falso (BUG-LOGIN-01).
   */
  loginIgnoringFakePopup(email, password) {
    this.login(email, password)
    cy.get('body', { timeout: 5000 }).then(($body) => {
      if (/seu\s*login\s*est[áa]\s*incorreto/i.test($body.text())) {
        this.elements.fakeErrorPopupContinueButton().click()
      }
    })
    return this
  }

  // ---------- Validações ----------
  shouldBeOnLoginPage() {
    cy.url().should('match', /\/(login)?\/?$/)
    this.elements.emailInput().should('be.visible')
    this.elements.passwordInput().should('be.visible')
    return this
  }

  shouldShowErrorMessage() {
    // Tenta primeiro a mensagem específica de credenciais inválidas observada
    // no site ("Usuário ou senha inválidos").
    cy.get('body').then(($body) => {
      const hasInvalidCredsMsg = /usu[áa]rio\s*ou\s*senha\s*inv[áa]lidos/i.test($body.text())
      const hasGenericError = $body.find('[role="alert"]:visible, .error:visible, .alert:visible, .toast:visible').length > 0

      expect(
        hasInvalidCredsMsg || hasGenericError,
        'Esperado: mensagem de erro visível na tela. Obtido: nenhum erro renderizado.'
      ).to.be.true
    })
    return this
  }

  shouldShowInvalidCredentialsMessage() {
    this.elements.invalidCredentialsMessage().should('be.visible')
    return this
  }

  shouldNotShowFakeErrorPopup() {
    this.elements.fakeErrorPopupText().should('not.exist')
    this.elements.fakeErrorPopupContinueButton().should('not.exist')
    return this
  }
}

export default new LoginPage()
