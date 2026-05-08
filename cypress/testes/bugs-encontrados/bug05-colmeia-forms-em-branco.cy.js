import SidebarPage from '../../support/pages/SidebarPage'

/**
 * BUG-POS-03 — Submenu "Colmeia Forms" leva a tela em branco.
 *
 * Comportamento observado:
 *   Ao acessar /dashboard/campanha e selecionar "Colmeia Forms",
 *   a página fica completamente em branco. Apenas a sidebar é exibida,
 *   sem conteúdo, opções, ou indicação de carregamento.
 *
 * Comportamento esperado:
 *   Deveria carregar a tela do módulo "Colmeia Forms" com sua interface
 *   correspondente (lista de formulários, botão de criar, filtros, etc.).
 *
 */
describe('BUG-POS-03 - "Colmeia Forms" abre tela em branco', () => {
  beforeEach(() => {
    cy.loginToApp()
  })

  it('Opção "Colmeia Forms" deveria estar disponível na tela de Campanha', () => {
    SidebarPage.goToCampanha()
    SidebarPage.elements.colmeiaFormsOption().should('be.visible')
  })

  it('Ao clicar em "Colmeia Forms", a página NÃO deveria ficar em branco', () => {
    SidebarPage.goToColmeiaForms()
    cy.wait(2000)

    // Esperado: alguma tela funcional do módulo Forms é renderizada.
    cy.get('main, [role="main"], [class*="content" i]').first().then(($main) => {
      const text = $main.text().trim().replace(/\s/g, '')
      expect(
        text.length,
        'Tela do Colmeia Forms está em branco — esperado conteúdo do módulo'
      ).to.be.greaterThan(20)
    })
  })

  it('Deveria existir indicador visual da tela ativa de Forms (título, breadcrumb, etc.)', () => {
    SidebarPage.goToColmeiaForms()
    cy.wait(2000)

    // Esperado: algum título ou header identificando a tela.
    cy.contains(/colmeia\s*forms|formul[áa]rios/i).should('be.visible')
  })
})
