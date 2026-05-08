/**
 * Page Object da navegação principal: sidebar (com ícone de megafone)
 * e seus submenus "Banco de dados" e "Colmeia Forms".
 */

const ROUTES = {
  CAMPANHA: '/dashboard/campanha',
  BANCO_DE_DADOS: '/dashboard/campanha/bancos-de-dados',
  COLMEIA_FORMS: '/dashboard/campanha/colmeia-forms'
}

class SidebarPage {
  elements = {
    sidebar: () =>
      cy.get('aside, nav, [role="navigation"], [class*="sidebar" i]').first(),

    // Ícone de megafone — para testes que validam o clique especificamente.
    megaphoneIcon: () =>
      cy.get(
        [
          '[aria-label*="megafone" i]',
          '[aria-label*="megaphone" i]',
          '[aria-label*="campanha" i]',
          '[aria-label*="campaign" i]',
          'a[href*="/campanha"]',
          'button[title*="megafone" i]',
          'button[title*="campanha" i]',
          'mat-icon:contains("campaign")'
        ].join(', ')
      ).first(),

    // Opções do submenu da área de campanha (usadas em testes de UI/clique)
    bancoDeDadosOption: () =>
      cy.get('a[href*="bancos-de-dados"], a[href*="banco-de-dados"]')
        .filter(':visible')
        .first(),

    colmeiaFormsOption: () =>
      cy.get('a[href*="colmeia-forms"]').filter(':visible').first()
  }

  // ---------- Ações (navegação direta — método principal) ----------

  goToCampanha() {
    cy.visit(ROUTES.CAMPANHA)
    return this
  }

  goToBancoDeDados() {
    cy.visit(ROUTES.BANCO_DE_DADOS)
    return this
  }

  goToColmeiaForms() {
    cy.visit(ROUTES.COLMEIA_FORMS)
    return this
  }

  // ---------- Ações (via clique — para testes específicos da sidebar) ----------

  clickMegaphoneIcon() {
    this.elements.megaphoneIcon().click()
    return this
  }

  clickBancoDeDadosOption() {
    this.elements.bancoDeDadosOption().click()
    return this
  }

  clickColmeiaFormsOption() {
    this.elements.colmeiaFormsOption().click()
    return this
  }
}

export default new SidebarPage()
export { ROUTES }
