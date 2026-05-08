import LoginPage from '../../support/pages/LoginPage'

describe('Login - Validações de campos e credenciais inválidas', () => {
  beforeEach(() => {
    LoginPage.visit()
  })

  it('CT03 - Deve bloquear login com e-mail inexistente', () => {
    cy.fixture('users').then(({ invalid }) => {
      LoginPage.login(invalid.wrongEmail.email, invalid.wrongEmail.password)

      // Esperado: mensagem de erro visível e usuário permanece na tela de login.
      LoginPage.shouldBeOnLoginPage()
      LoginPage.shouldShowErrorMessage()
    })
  })

  it('CT04 - Deve bloquear login com senha incorreta', () => {
    cy.fixture('users').then(({ invalid }) => {
      LoginPage.login(invalid.wrongPassword.email, invalid.wrongPassword.password)

      LoginPage.shouldBeOnLoginPage()
      LoginPage.shouldShowErrorMessage()
    })
  })

  it('CT05 - Deve bloquear login com e-mail e senha incorretos', () => {
    cy.fixture('users').then(({ invalid }) => {
      LoginPage.login(invalid.bothWrong.email, invalid.bothWrong.password)

      LoginPage.shouldBeOnLoginPage()
      LoginPage.shouldShowErrorMessage()
    })
  })

  it('CT06 - Deve impedir submit com campo de e-mail vazio', () => {
    cy.fixture('users').then(({ invalid }) => {
      LoginPage.fillPassword(invalid.emptyEmail.password)
      LoginPage.submit()

      // Esperado: validação HTML5 (campo obrigatório) OU mensagem custom.
      // O usuário deve permanecer na tela de login.
      LoginPage.shouldBeOnLoginPage()
      LoginPage.elements.emailInput().then(($input) => {
        const isInvalid = $input[0].validity && !$input[0].validity.valid
        if (isInvalid) {
          expect($input[0].validationMessage).to.not.be.empty
        }
      })
    })
  })

  it('CT07 - Deve impedir submit com campo de senha vazio', () => {
    cy.fixture('users').then(({ invalid }) => {
      LoginPage.fillEmail(invalid.emptyPassword.email)
      LoginPage.submit()

      LoginPage.shouldBeOnLoginPage()
      LoginPage.elements.passwordInput().then(($input) => {
        const isInvalid = $input[0].validity && !$input[0].validity.valid
        if (isInvalid) {
          expect($input[0].validationMessage).to.not.be.empty
        }
      })
    })
  })

  it('CT08 - Deve impedir submit com ambos os campos vazios', () => {
    LoginPage.submit()

    LoginPage.shouldBeOnLoginPage()
    LoginPage.elements.emailInput().then(($input) => {
      const isInvalid = $input[0].validity && !$input[0].validity.valid
      if (isInvalid) {
        expect($input[0].validationMessage).to.not.be.empty
      }
    })
  })

  it('CT09 - Deve rejeitar e-mail em formato inválido (sem @)', () => {
    cy.fixture('users').then(({ invalid }) => {
      LoginPage.login(invalid.malformedEmail.email, invalid.malformedEmail.password)

      // Esperado: o input com type="email" rejeita o formato OU
      // o backend retorna erro específico de formato.
      LoginPage.shouldBeOnLoginPage()
    })
  })

  it('CT10 - Deve fazer trim de espaços em branco no e-mail (boa prática)', () => {
    cy.fixture('users').then(({ valid }) => {
      LoginPage.fillEmail(`  ${valid.email}  `)
      LoginPage.fillPassword(valid.password)
      LoginPage.submit()

      // Esperado: o sistema deveria normalizar (trim) o e-mail e autenticar.
      // Se não normalizar, este teste evidencia uma possível falha de UX.
      cy.url({ timeout: 15000 }).should('not.match', /\/login\/?$/)
    })
  })
})
