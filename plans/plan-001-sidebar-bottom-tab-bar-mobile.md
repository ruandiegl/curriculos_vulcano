# Plano 001 - Sidebar responsiva como bottom tab bar mobile

## Tarefa

Implementar a evolucao da navegacao administrativa mobile para substituir a sidebar por uma bottom tab bar fixa em viewports abaixo de 768px, mantendo a sidebar no desktop e centralizando a configuracao dos itens de navegacao para evitar divergencia entre as duas versoes.

## Referencias consultadas

- `docs/README.md`: stack do projeto e principio de manutencao.
- `docs/03-frontend-guidelines.md`: React 19, TypeScript, Vite, Styled Components, React Router e validacoes de frontend.
- `docs/06-autenticacao-e-permissoes.md`: perfis `usuario`, `admin` e `superAdmin`.
- `docs/07-ui-ux-responsivo.md`: bottom navigation administrativo mobile, fundo escuro, item ativo em laranja e padding inferior responsivo.
- `docs/08-desenvolvimento-local.md`: comandos locais do frontend.
- `docs/09-qualidade-seguranca-deploy.md`: build, lint e checks antes da entrega.
- `agents/README.md`: criterio para selecao do agente.
- `agents/ui-ux-designer.md`: agente principal para ajustes mobile, bottom navigation, acessibilidade e overflow.
- `agents/frontend-engineer.md`: agente de apoio para implementacao React/TypeScript.
- `agents/qa-engineer.md`: agente de apoio para plano de teste e regressao.
- PRD anexado: "Sidebar Responsiva: Transformacao em Bottom Tab Bar (Mobile)".

## Agente de IA recomendado

Agente principal: `UI UX Designer`.

Justificativa: a tarefa e centrada em experiencia mobile, responsividade, bottom navigation, safe area, area de toque, estado ativo e garantia de que a navegacao nao cubra o conteudo. Conforme `agents/README.md`, este agente e o mais adequado para experiencia mobile/desktop, drawers, estados responsivos, acessibilidade e consistencia visual.

Agentes de apoio:

- `Frontend Engineer`: necessario para extrair a configuracao de navegacao, ajustar `AdminLayout`, `styles.ts`, React Router e tipagens.
- `QA Engineer`: necessario para cobrir regressao mobile/desktop, perfis `admin` e `superAdmin`, build e lint.

## Diagnostico atual

- O projeto real e `Curriculos Vulcano`, com frontend em React, TypeScript, Vite, Styled Components e React Router.
- O PRD menciona `PodePedir`, Tailwind e shadcn/ui, mas esses detalhes nao devem ser importados automaticamente porque conflitam com `docs/README.md`.
- O layout administrativo atual esta em `web/curriculos_project/src/components/AdminLayout/`.
- Ja existe uma bottom navigation em `AdminLayout`, mas ela:
  - usa breakpoint `max-width: 640px`, enquanto o PRD pede abaixo de `768px`;
  - duplica itens e rotas entre sidebar e bottom nav;
  - nao possui config unica compartilhada de navegacao;
  - nao possui estrategia generica de ate 5 itens com agrupamento em "Mais";
  - usa item "Sair" dentro da bottom nav, o que precisa ser validado como acao fixa ou mover para menu/mais conforme o limite de itens;
  - ja respeita parcialmente safe area via `env(safe-area-inset-bottom)`.

## Escopo

Incluido:

- Ajustar navegacao administrativa mobile em `AdminLayout`.
- Criar uma fonte unica de itens de navegacao administrativa.
- Garantir exibicao correta para `admin` e `superAdmin`.
- Trocar breakpoint mobile de 640px para abaixo de 768px.
- Garantir bottom nav fixa no rodape, com conteudo principal sem ficar coberto.
- Preservar comportamento desktop da sidebar.
- Validar acessibilidade minima: labels, foco, area de toque e contraste.

Fora de escopo:

- Migrar o projeto para Tailwind ou shadcn/ui.
- Redesenhar toda a hierarquia de navegacao.
- Alterar rotas, permissoes da API ou regras de autenticacao.
- Criar sidebar icon-only nova alem do comportamento ja existente.
- Alterar a navegacao do candidato (`UserLayout`), salvo se algum estilo global interferir.

## Arquivos provaveis

- `web/curriculos_project/src/components/AdminLayout/index.tsx`
- `web/curriculos_project/src/components/AdminLayout/styles.ts`
- `web/curriculos_project/src/components/AdminLayout/navigation.tsx` ou `navItems.tsx` (novo)
- `web/curriculos_project/src/routes/routes.tsx` somente se for necessario alinhar algum `href`
- `docs/07-ui-ux-responsivo.md` somente se a decisao final mudar a guideline existente

## Decisoes tecnicas

- Usar Styled Components, nao Tailwind/shadcn, para aderir a stack do projeto.
- Manter navegacao por `useNavigate` ou evoluir para um helper central que receba `path`, preservando React Router.
- Extrair itens para um array tipado com:
  - `id`
  - `label`
  - `shortLabel`
  - `path`
  - `section`
  - `icon`
  - `roles`
  - `showInBottomNav`
- Filtrar itens pelo perfil do usuario antes de renderizar.
- Determinar estado ativo por `activeSection`, mantendo compatibilidade com as paginas atuais.
- Usar 768px como breakpoint padrao para sidebar/bottom nav.
- Manter altura minima de toque em pelo menos 44px.
- Usar fundo escuro e ativo laranja, conforme `docs/07-ui-ux-responsivo.md`.
- Adicionar padding inferior no `Main` em mobile considerando altura da bottom nav e safe area.

## Plano de execucao

### 1. Inventario da navegacao atual

- Mapear itens existentes na sidebar:
  - Curriculos: `/dashboard`, `admin` e `superAdmin`.
  - Vagas: `/newJob`, `admin` e `superAdmin`.
  - Relatorios: `/reports`, `admin` e `superAdmin`.
  - Usuarios: `/users`, apenas `superAdmin`.
  - Sair: acao, nao rota.
- Confirmar quais paginas passam `activeSection` para `AdminLayout`.
- Confirmar se ha outras navegacoes administrativas fora de `AdminLayout`.

### 2. Criar config unica de navegacao

- Criar arquivo novo em `AdminLayout/navItems.tsx` ou nome equivalente.
- Mover icones atuais para esse arquivo ou para componentes internos exportados.
- Definir tipo `AdminNavItem`.
- Criar helper `getAdminNavItems(userTipo)` para aplicar permissoes.
- Evitar duplicacao de rotas e labels entre sidebar e bottom nav.

### 3. Refatorar sidebar desktop

- Atualizar `AdminLayout/index.tsx` para renderizar a sidebar a partir da config.
- Preservar layout visual atual.
- Preservar comportamento do botao de abrir/fechar sidebar.
- Manter `title`, label longa e icone.
- Garantir que `Usuarios` continue visivel somente para `superAdmin`.

### 4. Refatorar bottom tab bar

- Renderizar bottom nav a partir da mesma config filtrada.
- Aplicar limite de ate 5 itens visiveis.
- Como o projeto atual tem ate 4 itens de rota + sair, tratar `Sair` como acao separada:
  - Opcao recomendada: manter `Sair` como item fixo se o total continuar dentro de 5.
  - Se novas rotas elevarem o total acima de 5, criar item "Mais" para excedentes e incluir "Sair" no painel de acoes.
- Se necessario implementar "Mais":
  - Criar painel bottom simples com Styled Components, `role="dialog"` e `aria-modal="true"`;
  - fechar ao clicar fora e ao selecionar item;
  - respeitar safe area.
- Garantir labels curtas:
  - Curriculos
  - Vagas
  - Relatorios
  - Usuarios
  - Sair ou Mais

### 5. Ajustar responsividade e safe area

- Alterar media query de `640px` para `767px` ou `max-width: 767px`.
- Garantir:
  - sidebar oculta abaixo de 768px;
  - bottom nav visivel abaixo de 768px;
  - desktop/tablet landscape com largura >= 768px mantendo sidebar.
- Ajustar `Main` com padding inferior mobile suficiente:
  - base da barra;
  - `env(safe-area-inset-bottom)`;
  - folga para botoes no fim de listas e formularios.

### 6. Acessibilidade e interacao

- Manter `aria-label` em botoes de icone/acao.
- Adicionar `aria-current="page"` no item ativo, se aplicavel.
- Garantir foco visivel em `NavButton` e `BottomNavButton`.
- Garantir area de toque minima de 44x44px.
- Verificar contraste do ativo laranja sobre fundo escuro e do inativo cinza.
- Evitar labels quebrando layout com `text-overflow: ellipsis`.

### 7. Validacao manual

- Testar como `admin`:
  - `/dashboard`
  - `/newJob`
  - `/reports`
  - ausencia de `/users`
  - logout.
- Testar como `superAdmin`:
  - `/dashboard`
  - `/newJob`
  - `/reports`
  - `/users`
  - logout.
- Testar viewports:
  - 375x667 (iPhone SE aproximado)
  - 390x844 (iPhone moderno)
  - 412x915 (Android medio)
  - 767px de largura
  - 768px de largura
  - desktop >= 1024px
- Confirmar que o conteudo nao fica escondido atras da bottom nav.
- Confirmar que a sidebar desktop permanece igual.

### 8. Validacao tecnica

Executar:

```bash
cd web/curriculos_project
npm run build
npm run lint
```

Se o lint completo falhar por debitos antigos, executar check focado nos arquivos alterados e registrar a pendencia.

## Criterios de aceite

- [ ] Em viewport menor que 768px, a sidebar administrativa nao aparece.
- [ ] Em viewport menor que 768px, a bottom tab bar aparece fixa no rodape.
- [ ] Em viewport maior ou igual a 768px, a sidebar permanece funcionando como hoje.
- [ ] Itens de sidebar e bottom nav saem da mesma configuracao.
- [ ] Item ativo e indicado corretamente ao navegar.
- [ ] `Usuarios` aparece somente para `superAdmin`.
- [ ] Bottom nav respeita safe area do iOS.
- [ ] Conteudo principal nao fica coberto pela bottom nav.
- [ ] Itens tem area de toque minima adequada.
- [ ] Labels longas nao quebram o layout.
- [ ] Logout continua usando confirmacao existente.
- [ ] Build do frontend passa.
- [ ] Lint passa ou pendencias antigas sao documentadas.

## Riscos e mitigacoes

| Risco | Mitigacao |
| --- | --- |
| Duplicacao de itens entre sidebar e bottom nav voltar a ocorrer | Centralizar config em um unico arquivo tipado |
| PRD pedir Tailwind/shadcn e projeto usar Styled Components | Seguir `docs/README.md` e adaptar comportamento, nao a biblioteca |
| Bottom nav cobrir botoes no fim da pagina | Ajustar padding inferior do `Main` em mobile |
| Quebra de permissao do item Usuarios | Filtrar por `roles` e testar `admin` e `superAdmin` |
| Regressao no desktop | Usar media query isolada e testar 768px+ |
| Labels ficarem espremidas em telas pequenas | Usar `shortLabel`, ellipsis e grid com colunas estaveis |

## Pendencias para validacao com produto/design

- Confirmar se `Sair` deve permanecer como item da bottom nav ou migrar para area de usuario/menu.
- Confirmar se o limite de 5 itens deve contar a acao `Sair` ou somente rotas principais.
- Confirmar se o breakpoint oficial do projeto deve mudar de 640px para 768px em todos os pontos do `AdminLayout`.

## Execucao realizada em 30/07/2026

- Skill `shadcn` instalada a partir de `shadcn-ui/ui`, caminho `skills/shadcn`.
- `npx.cmd shadcn@latest info --json` executado no frontend:
  - framework detectado: Vite;
  - TypeScript: sim;
  - configuracao shadcn: ausente (`config: null`);
  - Tailwind: ausente;
  - componentes shadcn instalados: nenhum.
- Decisao aplicada: executar o comportamento do PRD sem inicializar shadcn/Tailwind, para evitar migracao de design system fora do escopo e preservar Styled Components conforme `docs/README.md`.
- Navegacao administrativa extraida para config unica em `AdminLayout/navItems.ts`.
- Icones separados em `AdminLayout/navIcons.tsx`.
- `AdminLayout/index.tsx` refatorado para renderizar sidebar e bottom nav a partir da mesma config.
- Breakpoint mobile do `AdminLayout` ajustado para abaixo de `768px`.
- Bottom nav passou a calcular quantidade de itens, suportar estado ativo por config e manter acao `Sair`.
- Estrutura de "Mais opcoes" adicionada para overflow futuro da bottom nav, com dialog bottom e fechamento por backdrop/Escape.
- `Main` recebeu padding inferior mobile com `env(safe-area-inset-bottom)`.
- Foco visivel adicionado aos botoes de navegacao.

Validacoes:

- `npm.cmd install`: executado porque `node_modules` nao existia.
- `npm.cmd run build`: passou.
- `./node_modules/.bin/eslint.cmd src/components/AdminLayout/index.tsx src/components/AdminLayout/styles.ts src/components/AdminLayout/navItems.ts src/components/AdminLayout/navIcons.tsx`: passou.
- `npm.cmd run lint`: passou apos corrigir debitos existentes em:
  - `src/pages/newCurriculum/index.tsx`: `formFromCurriculo` movido para fora do componente antes do uso;
  - `src/utils/email.ts`: removido escape desnecessario da regex.
- Servidor Vite iniciado em `http://localhost:5180` e validado com HTTP `200`.
- Observacao de dependencia: `npm install` reportou 9 vulnerabilidades na arvore atual, nao tratadas nesta tarefa.
