import LoginPage from '../../support/pages/LoginPage'

describe('Login - Cenários de segurança', () => {
  beforeEach(() => {
    LoginPage.visit()
  })

  it('CT11 - Deve resistir a tentativa de SQL Injection', () => {
    cy.fixture('users').then(({ security }) => {
      LoginPage.login(security.sqlInjection.email, security.sqlInjection.password)

      // Esperado: o sistema NÃO deve autenticar e NÃO deve expor erros internos
      // Permanecer na tela com erro genérico.
      LoginPage.shouldBeOnLoginPage()
      cy.contains(/sql|syntax|database|stack|exception/i).should('not.exist')
    })
  })

  it('CT12 - Deve sanitizar tentativa de XSS no campo de e-mail', () => {
    cy.fixture('users').then(({ security }) => {
      // Listener para detectar alert() executado (indicaria XSS bem-sucedido)
      const alertStub = cy.stub()
      cy.on('window:alert', alertStub)

      LoginPage.login(security.xss.email, security.xss.password)

      // Esperado: nenhum alert disparado e usuário permanece na tela de login.
      cy.then(() => {
        expect(alertStub).to.not.have.been.called
      })
      LoginPage.shouldBeOnLoginPage()
    })
  })

  it('CT13 - Deve mascarar a senha (input type="password")', () => {
    LoginPage.elements.passwordInput().should('have.attr', 'type', 'password')
  })

  it('CT14 - Deve aceitar/rejeitar strings excessivamente longas sem quebrar', () => {
    cy.fixture('users').then(({ security }) => {
      LoginPage.login(security.longStrings.email, security.longStrings.password)

      // Esperado: o app não deve crashar com inputs longos.
      // Deve permanecer na tela de login com erro tratado.
      LoginPage.shouldBeOnLoginPage()
    })
  })

  it('CT15 - Deve impedir acesso a área autenticada sem login', () => {
    // Garante estado totalmente deslogado antes do teste
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.window().then((win) => win.sessionStorage.clear())

    // Tenta acessar diretamente uma rota protegida
    cy.visit('/dashboard/campanha', { failOnStatusCode: false })

    // Esperado: ALGUMA das duas situações deve ocorrer:
    //   (1) URL é redirecionada para a tela de login
    //   (2) o formulário de login é renderizado na tela
    cy.url({ timeout: 10000 }).then((url) => {
      const isOnLogin = /\/(login)?\/?$/.test(url)

      cy.get('body').then(($body) => {
        const hasLoginForm =
          $body.find('input[type="email"]:visible').length > 0 &&
          $body.find('input[type="password"]:visible').length > 0

        expect(
          isOnLogin || hasLoginForm,
          `Acesso direto a rota protegida sem autenticação. URL: ${url}. ` +
          `Esperado: redirect para login OU formulário de login visível.`
        ).to.be.true
      })
    })
  })

  it('CT16 - Mensagem de erro NÃO deve revelar se o e-mail existe (enumeração de usuários)', () => {
    cy.fixture('users').then(({ invalid }) => {
      // Captura a mensagem com e-mail inexistente
      LoginPage.login(invalid.wrongEmail.email, invalid.wrongEmail.password)
      LoginPage.elements.invalidCredentialsMessage()
        .invoke('text')
        .then((msgInexistente) => {
          // Volta e tenta com e-mail válido + senha errada
          LoginPage.visit()
          LoginPage.login(invalid.wrongPassword.email, invalid.wrongPassword.password)
          LoginPage.elements.invalidCredentialsMessage()
            .invoke('text')
            .then((msgSenhaErrada) => {
              // Esperado: mensagens equivalentes (não revelam qual campo está errado)
              expect(
                msgInexistente.trim().toLowerCase(),
                'Mensagens de erro de e-mail inexistente e senha errada devem ser idênticas'
              ).to.equal(msgSenhaErrada.trim().toLowerCase())
            })
        })
    })
  })
})
