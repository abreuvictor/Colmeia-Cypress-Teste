# Colmeia — Suite de Testes Automatizados (Cypress)

Suite de testes para o ambiente de QA da Colmeia (`teste-colmeia-qa.colmeia-corp.com`), construída em **Cypress** seguindo Page Object Model, fixtures, comandos customizados e isolamento entre testes.

A suite cobre tanto **caminhos felizes** quanto **13 bugs reais identificados manualmente**, em forma de testes que documentam o comportamento esperado.

## Estrutura do Projeto

```
cypress-colmeia/
├── cypress/
│   ├── testes/
│   │   ├── login/
│   │   │   ├── login-success.cy.js
│   │   │   ├── login-validation.cy.js
│   │   │   └── login-security.cy.js
│   │   ├── ui/
│   │   │   └── login-page-ui.cy.js
│   │   └── bugs-encontrados/                ← 13 specs, um por bug
│   │       ├── bug01-login-popup-falso.cy.js
│   │       ├── bug02-esqueci-senha.cy.js
│   │       ├── bug03-candidato-sem-acao.cy.js
│   │       ├── bug04-pagina-em-branco-pos-login.cy.js
│   │       ├── bug05-colmeia-forms-em-branco.cy.js
│   │       ├── bug06-banco-nomes-duplicados.cy.js
│   │       ├── bug07-banco-arquivados-vazio.cy.js
│   │       ├── bug08-banco-exclusao-sem-confirmacao.cy.js
│   │       ├── bug09-banco-editar-nome.cy.js
│   │       ├── bug10-banco-nome-longo.cy.js
│   │       ├── bug11-banco-caracteres-especiais.cy.js
│   │       ├── bug12-banco-recuperar-deletados.cy.js
│   │       └── bug13-banco-persistencia.cy.js
│   ├── fixtures/
│   │   ├── users.json                       Dados de credenciais
│   │   └── databases.json                   Dados de teste pra módulo de bancos
│   └── support/
│       ├── commands.js                      cy.loginToApp() e etc.
│       ├── setup.js                         Hooks globais
│       └── pages/
│           ├── LoginPage.js
│           ├── DashboardPage.js
│           ├── SidebarPage.js               (ícones + submenus)
│           └── DatabasePage.js              (CRUD de bancos)
├── cypress.config.js
├── package.json
└── README.md
```

## Pré-requisitos

- Node.js >= 18
- npm >= 9

## Instalação

```bash
npm install
```

## Como rodar

```bash
# Rodar todos os testes (headless)
npx cypress run

# Abrir a interface interativa
npx cypress open

# Rodar apenas os bugs
npx cypress run --spec "cypress/testes/bugs-encontrados/**"

# Rodar apenas login
npx cypress run --spec "cypress/testes/login/**"
```

> Screenshots e vídeos são salvos automaticamente em `cypress/screenshots/` e `cypress/videos/` após cada execução.

---

## Mapa de bugs cobertos

### Tela de Login

| ID | Bug | Spec |
|----|-----|------|
| BUG-LOGIN-01 | Popup falso "Seu login está incorreto, quer continuar?" aparece com credenciais válidas | `bug01-login-popup-falso.cy.js` |
| BUG-LOGIN-02 | Link "Esqueci minha senha" não tem ação | `bug02-esqueci-senha.cy.js` |

### Pós-Login — Navegação geral

| ID | Bug | Spec |
|----|-----|------|
| BUG-POS-01 | Botão "Candidato" no header não tem ação (sem dropdown, sem logout) | `bug03-candidato-sem-acao.cy.js` |
| BUG-POS-02 | Página inicial pós-login está em branco (apenas sidebar visível) | `bug04-pagina-em-branco-pos-login.cy.js` |
| BUG-POS-03 | "Colmeia Forms" no menu do megafone abre tela em branco | `bug05-colmeia-forms-em-branco.cy.js` |

### Pós-Login — Módulo Banco de Dados

| ID | Bug | Spec |
|----|-----|------|
| BUG-POS-04 | Permite criar bancos com nomes duplicados sem validação | `bug06-banco-nomes-duplicados.cy.js` |
| BUG-POS-05 | "Ver bancos arquivados" não exibe os arquivados | `bug07-banco-arquivados-vazio.cy.js` |
| BUG-POS-06 | Excluir banco não pede confirmação | `bug08-banco-exclusao-sem-confirmacao.cy.js` |
| BUG-POS-07 | Não há opção de editar nome do banco | `bug09-banco-editar-nome.cy.js` |
| BUG-POS-08 | Permite nome muito longo, quebra layout | `bug10-banco-nome-longo.cy.js` |
| BUG-POS-09 | Aceita caracteres especiais sem validação/sanitização | `bug11-banco-caracteres-especiais.cy.js` |
| BUG-POS-10 | Sem funcionalidade de lixeira / recuperar deletados | `bug12-banco-recuperar-deletados.cy.js` |
| BUG-POS-11 | Bancos não persistem após reload (sem persistência no backend) | `bug13-banco-persistencia.cy.js` |

---

## Cenários de validação positiva (happyday)

Além dos bugs, a suite mantém os cenários de validação funcional padrão da tela de login:

### Login - Sucesso (`login/login-success.cy.js`)
- CT01 — Login com credenciais válidas redireciona direto (sem popup)
- CT02 — Sessão persiste após reload

### Login - Validações (`login/login-validation.cy.js`)
- CT03–CT09 — Credenciais inválidas, campos vazios, formato de e-mail
- CT10 — Trim de espaços no e-mail (boa prática)

### Login - Segurança (`login/login-security.cy.js`)
- CT11 — Resistência a SQL Injection
- CT12 — Sanitização contra XSS
- CT13 — Senha mascarada (`type="password"`)
- CT14 — Strings excessivamente longas
- CT15 — Proteção de rota autenticada
- CT16 — Mensagens não permitem enumeração de usuários

### UI / Acessibilidade (`ui/login-page-ui.cy.js`)
- CT17–CT25 — Logo, campos, botão, link, navegação por teclado, Enter, responsividade mobile/tablet, title

---

## Boas práticas adotadas

- **Page Object Model** — seletores e ações centralizados, facilita manutenção
- **Fixtures externas** — dados de teste em JSON, separados da lógica
- **Comandos customizados** — `cy.loginToApp()` ignora o popup falso pra desbloquear testes pós-login; `cy.loginToAppViaSession()` cacheia a sessão pra performance
- **Isolamento entre testes** — `clearCookies` e `clearLocalStorage` no `beforeEach` global
- **Retries automáticos em CI** — 2 tentativas, evita flakiness
- **Vídeos + screenshots** — capturados em falha pra evidência
- **Seletores defensivos** — múltiplos fallbacks (texto, role, aria-label, classe) já que o front não expõe `data-cy`
- **Comentários estruturados** — cada bug tem cabeçalho com observado/esperado/severidade pra alimentar relatório de QA

---