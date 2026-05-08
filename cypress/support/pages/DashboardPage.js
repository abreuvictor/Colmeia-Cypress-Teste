/**
 * Page Object da área autenticada principal (pós-login).
 */
class DashboardPage {
  elements = {
    // Header / barra superior
    header: () =>
      cy.get('header, [class*="header" i], [class*="topbar" i], [role="banner"]').first(),

    candidatoButton: () =>
      cy.contains(/^\s*candidato\s*$/i),

    // Área principal de conteúdo
    mainContent: () =>
      cy.get('main, [role="main"], [class*="main-content" i], [class*="content" i]').first(),

    // Qualquer elemento de conteúdo significativo na área principal
    mainContentChildren: () =>
      cy.get('main *, [role="main"] *').filter(':visible')
  }

  // ---------- Validações ----------

  /**
   * Valida que a área pós-login NÃO está em branco (BUG-POS-02).
   */
  shouldNotBeBlank() {
    cy.get('body').then(($body) => {
      const visibleText = $body.text().trim()
      // Conta caracteres alfanuméricos (ignora whitespace e ícones)
      const meaningfulChars = visibleText.replace(/\s/g, '').length
      expect(
        meaningfulChars,
        'Página pós-login não deveria estar em branco — esperado conteúdo significativo'
      ).to.be.greaterThan(20)
    })
    return this
  }

  /**
   * Valida que o botão "Candidato" tem alguma ação ao ser clicado.
   */
  candidatoShouldHaveAction() {
    // Captura URL antes do clique
    cy.url().then((urlBefore) => {
      this.elements.candidatoButton().click()

      // Esperado: alguma das ações abaixo deve acontecer
      cy.wait(500)

      cy.url().then((urlAfter) => {
        cy.get('body').then(($body) => {
          const dropdownVisible =
            $body.find('[role="menu"], [class*="dropdown" i], [class*="menu" i]:visible').length > 0
          const urlChanged = urlAfter !== urlBefore

          expect(
            urlChanged || dropdownVisible,
            'Clique em "Candidato" deveria redirecionar OU abrir menu — nada aconteceu'
          ).to.be.true
        })
      })
    })
    return this
  }
}

export default new DashboardPage()
