# Plano 003 - Versão mobile responsiva

## Tarefa

Executar o PRD `PRD-003` para entregar uma experiência mobile consistente para os perfis `usuario`, `admin` e `superAdmin` do Curriculos Vulcano.

O plano cobre navegação mobile, bottom sheets, tabelas como cards, formulários touch-friendly, vagas, relatórios, usuários, currículo e autenticação. Não altera rotas, permissões, API ou banco de dados.

Este arquivo é somente o planejamento da execução. Nenhuma implementação da feature é feita nesta etapa.

## Referências consultadas

- `docs/prd-mobile-responsivo.md`: requisitos, escopo, critérios de aceite, riscos e sequência sugerida.
- `docs/07-ui-ux-responsivo.md`: padrões de layout, cards, tabelas, drawers, safe area e acessibilidade.
- `docs/03-frontend-guidelines.md`: stack, organização, Styled Components, hooks, formulários e validações.
- `docs/README.md`: arquitetura documental e convenções do projeto.
- `agents/README.md`: seleção e composição de agentes.
- `agents/ui-ux-designer.md`: padrões visuais e responsividade.
- `agents/frontend-engineer.md`: implementação React/TypeScript.
- `agents/tech-lead.md`: decisões de arquitetura e revisão de regressão.
- `agents/qa-engineer.md`: matriz de testes e regressão.
- `web/curriculos_project/src/components/AdminLayout/index.tsx`: bottom navigation administrativa existente e painel “Mais”.
- `web/curriculos_project/src/components/AdminLayout/styles.ts`: sidebar, bottom navigation, `Main`, breakpoint e safe area.
- `web/curriculos_project/src/components/UserLayout/index.tsx`: layout do candidato, ainda sem bottom navigation mobile.

## Agentes recomendados

Agente principal: `Tech Lead`.

Justificativa: a feature atravessa dois layouts, um componente global de modal e diversas páginas. O Tech Lead deve manter o contrato do `BottomSheet`, preservar permissões/rotas e coordenar a ordem de implementação.

Agentes de apoio:

- `UI UX Designer`: bottom tab, bottom sheet, animações, estados, toque e acessibilidade.
- `Frontend Engineer`: hooks, componentes, layouts, estilos e páginas React/TypeScript.
- `QA Engineer`: cenários por perfil e viewport, incluindo regressão desktop.
- `Technical Writer`: atualização das guidelines e do padrão reutilizável.

## Diagnóstico atual

### O que já existe

- Frontend em React 19, TypeScript, Vite, Styled Components, React Router e Axios.
- `AdminLayout` com sidebar desktop, `BottomNav` mobile, itens condicionais por perfil e `BottomMorePanel`.
- Breakpoint principal do layout administrativo em `@media (max-width: 767px)`.
- `Main` compartilhado pelos layouts com espaço inferior responsivo e `env(safe-area-inset-bottom)`.
- Sidebar desktop abre/fecha pelo botão; o estado aberto já é preservado durante a navegação da sessão e não deve regredir.
- `ConfirmModal` existente, com callbacks, loading e comportamento desktop que precisam ser preservados.

### Lacunas

- `UserLayout` não possui bottom tab nem painel “Mais” no mobile.
- O candidato precisa de uma variante visual própria, sem herdar acidentalmente o fundo escuro do admin.
- `ConfirmModal`, filtros avançados do dashboard e detalhes de candidatos ainda são centralizados no mobile.
- Dashboard, vagas, relatórios e usuários precisam de conversão explícita de tabela para cards.
- Formulários longos precisam de touch targets, fonte de input e empilhamento padronizados.
- Ainda não existem `useMediaQuery`, `useBottomSheet` ou `BottomSheet` global.
- QA visual ainda precisa cobrir 360px, 375px, 390px, 767px, 768px e desktop.

## Objetivo técnico

Criar uma camada reutilizável que:

1. ofereça navegação mobile para candidato e administração;
2. transforme modais em bottom sheets abaixo de 768px, mantendo o modal centralizado no desktop;
3. preserve rotas, permissões, callbacks, loading e services existentes;
4. transforme tabelas/grids operacionais em cards legíveis;
5. garanta safe area, targets de pelo menos 44px e foco acessível;
6. mantenha o desktop sem regressão visual ou funcional.

## Escopo

### Incluído

- Bottom tab do `UserLayout`.
- Refinamento do `BottomNav` administrativo existente.
- `BottomSheet`, `useMediaQuery` e `useBottomSheet`.
- Migração do `ConfirmModal`, filtros, detalhes de candidatura e confirmações aplicáveis.
- Adaptação mobile do dashboard, formulários, vagas, relatórios, usuários, view/edit e autenticação.
- Atualização de `docs/07-ui-ux-responsivo.md` e `docs/03-frontend-guidelines.md`.
- QA manual nos perfis e viewports do PRD.

### Fora de escopo

- Alterar rotas, autenticação, permissões JWT, API, Prisma ou banco.
- Migrar para Tailwind, shadcn/ui ou outra biblioteca.
- Aplicativo nativo, PWA, offline ou notificações push.
- Novos filtros, fluxos de negócio ou redesign completo da identidade visual.
- Automação Playwright/Cypress; a entrega terá QA manual.

## Arquivos prováveis

### Novos

- `web/curriculos_project/src/components/BottomSheet/index.tsx`
- `web/curriculos_project/src/components/BottomSheet/styles.ts`
- `web/curriculos_project/src/hooks/useMediaQuery.ts`
- `web/curriculos_project/src/hooks/useBottomSheet.ts`

### Compartilhados

- `web/curriculos_project/src/components/UserLayout/index.tsx`
- `web/curriculos_project/src/components/AdminLayout/index.tsx`
- `web/curriculos_project/src/components/AdminLayout/styles.ts`
- `web/curriculos_project/src/components/ConfirmModal.tsx`

### Páginas

- `web/curriculos_project/src/pages/dashboard/`
- `web/curriculos_project/src/pages/jobs/`
- `web/curriculos_project/src/pages/newJob/`
- `web/curriculos_project/src/pages/reports/`
- `web/curriculos_project/src/pages/users/`
- `web/curriculos_project/src/pages/view/`
- `web/curriculos_project/src/pages/edit/`
- `web/curriculos_project/src/pages/newCurriculum/`, `newAddress/`, `newEducation/`, `newExperience/`
- `web/curriculos_project/src/pages/newSkill/`, `NewCertification/`, `Profile/`
- `web/curriculos_project/src/pages/Login/`, `register/`, `ForgotPassword/`, `ResetPassword/`, `RecoverAccess/`

> Antes de editar, confirmar quais arquivos de estilo existem e mapear componentes reutilizados. Não criar estilos duplicados sem necessidade.

## Decisões técnicas

### Breakpoint e layouts

- Usar `@media (max-width: 767px)` como breakpoint mobile; 768px continua sendo desktop/tablet com sidebar.
- Manter React Router, `useNavigate`, `activeSection`, `aria-current` e permissões atuais.
- O botão de menu continua sendo o único controle para abrir/fechar a sidebar desktop; navegar por um item não deve fechá-la.

### Bottom tab do candidato

- Exibir somente abaixo de 768px.
- Itens visíveis: `Início` (`/profile`), `Vagas` (`/vagas`), `Currículo` (`/newCurriculum`), `Formação` (`/new-education`) e `Mais`.
- “Mais”: `Endereço`, `Upload PDF`, `Experiência`, `Habilidades` e `Certificações`.
- Usar ícones, labels, `aria-current="page"`, foco visível e targets de pelo menos 44px.
- Respeitar safe area e reservar espaço no `Main`.
- Criar variante de estilo do candidato, sem alterar o tema administrativo.

### Bottom sheet

API esperada:

```ts
type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};
```

- Desktop: modal centralizado, preservando o comportamento atual.
- Mobile: painel preso ao bottom, cantos superiores arredondados, handle, animação de aproximadamente 300ms e safe area.
- O gesto inicia somente no handle; acima de 80px para baixo fecha, abaixo disso retorna à posição inicial.
- Backdrop e Escape fecham quando permitido pelo fluxo.
- Conteúdo alto rola internamente.
- Dialog deve ter `role="dialog"`, `aria-modal="true"`, nome acessível e foco preso/restaurado.
- Manter callbacks, textos, loading e estados atuais dos consumidores.

### Hooks e CSS

- `useMediaQuery` deve registrar/remover listeners de `matchMedia` e ter valor inicial seguro.
- `useBottomSheet` deve encapsular refs, drag, estado e cleanup, sem biblioteca externa.
- Usar Styled Components, props de estilo com prefixo `$` e breakpoint de 767px.
- Em mobile, inputs/selects/textareas têm `min-height: 48px` e `font-size: 16px`.
- Tabelas mantêm estrutura desktop e viram cards com `data-label` no mobile.
- Status importantes não podem ser cortados por `text-overflow: ellipsis`.

## Plano de execução

### Fase 0 — Preparação

1. Confirmar branch, worktree e alterações preexistentes.
2. Mapear usos de `ConfirmModal`, filtros, detalhes, painéis “Mais”, tabelas e formulários.
3. Confirmar estilos existentes e contratos que não podem mudar: rotas, services, permissões, callbacks e loading.

**Saída:** inventário página → componente/layout/modal → ajuste previsto.

### Fase 1 — Fundação compartilhada

1. Criar `useMediaQuery.ts`.
2. Criar `useBottomSheet.ts` com drag no handle, limiar de 80px e cleanup.
3. Criar `BottomSheet/index.tsx` e `styles.ts`.
4. Implementar backdrop, handle, scroll interno, safe area, animação, Escape, semântica e foco.
5. Validar o componente isoladamente em desktop e mobile antes da migração.

**Saída:** componente reutilizável com contrato estável.

### Fase 2 — Migração de modais

1. Refatorar `ConfirmModal` para usar `BottomSheet` internamente, sem mudar props/callbacks.
2. Migrar filtro avançado do dashboard.
3. Migrar detalhes de candidatos em `newJob`.
4. Migrar confirmações de usuários e demais modais identificados.
5. Testar confirmar, cancelar, loading, backdrop, Escape, foco e drag em cada consumidor.

### Fase 3 — Navegação mobile

1. Criar bottom tab do `UserLayout` e painel “Mais”.
2. Reutilizar/extrair tokens do admin com variante visual do candidato.
3. Garantir item ativo, labels, acessibilidade, targets e safe area.
4. Revisar o `BottomNav` administrativo sem alterar permissões, overflow ou logout.
5. Confirmar sidebar em 768px ou mais e conteúdo não coberto no mobile.

### Fase 4 — Dashboard

1. Fazer chips quebrarem com segurança em 360–390px.
2. Tornar busca e botão de filtros utilizáveis em largura estreita.
3. Transformar tabela em cards com `data-label` e ações abaixo dos dados.
4. Remover ellipsis de badges importantes.
5. Ajustar paginação mobile para prev/next + página atual/total.

### Fase 5 — Formulários do candidato

Aplicar a mesma regra em `newCurriculum`, `newAddress`, `newEducation`, `newExperience`, `newSkill`, `NewCertification` e `Profile`:

1. Empilhar grupos e remover larguras fixas.
2. Aplicar altura mínima, fonte de 16px, labels acima e mensagens sem overflow.
3. Ajustar botões de salvar/cancelar para toque.
4. Usar `scrollIntoView` ao abrir edição inline, quando aplicável.
5. Testar teclado, foco, iOS zoom e landscape.

### Fase 6 — Vagas

1. Fazer cards de `/vagas` ocuparem 100% da largura.
2. Ajustar localização, contrato, descrição, status e botão de candidatura.
3. Transformar tabela de `/newJob` em cards e empilhar formulário.
4. Migrar modal de candidatos inscritos para bottom sheet.
5. Validar visualização, descarte e retorno de currículo sem mudar regra de negócio.

### Fase 7 — Relatórios e usuários

1. Tornar gráficos responsivos ao container.
2. Usar totais em duas colunas e uma abaixo de 360px.
3. Transformar tabela de relatórios em cards e exportação em ação de largura adequada.
4. Transformar tabela de usuários em cards e formulário em uma coluna.
5. Migrar confirmação de exclusão para bottom sheet e preservar restrição de super admin.

### Fase 8 — View, edit e autenticação

1. Adaptar seções de view/edit para coluna única e ações visíveis.
2. Garantir select de status e action bar com targets adequados.
3. Ajustar Login, Registro, Recuperação, Reset e RecoverAccess para max-width 420px, padding lateral e submit de 48px.
4. Validar logo/título, mensagens e inputs em 375px sem overflow.

### Fase 9 — Documentação e entrega

1. Atualizar `docs/07-ui-ux-responsivo.md` com bottom tab do candidato, BottomSheet, gesto, safe area e tabela→card.
2. Atualizar `docs/03-frontend-guidelines.md` com hooks, foco, targets e regras de mobile.
3. Atualizar `docs/README.md` apenas se o índice exigir.
4. Rodar build, lint, diff check e QA manual.
5. Revisar diff para garantir ausência de alterações em API, banco, rotas, permissões e desktop.

## Critérios de aceite

### Navegação

- [ ] Abaixo de 768px, `UserLayout` exibe bottom tab com ícones e labels.
- [ ] Abaixo de 768px, a sidebar não ocupa a tela; em 768px ou mais, continua funcionando.
- [ ] O candidato vê Início, Vagas, Currículo, Formação e Mais.
- [ ] Os demais itens do candidato aparecem em Mais.
- [ ] `BottomNav` admin continua funcional e itens excedentes ficam acessíveis.
- [ ] Item ativo usa laranja e possui `aria-current="page"`.
- [ ] Bottom nav e conteúdo respeitam safe area.
- [ ] Sidebar aberta não fecha ao navegar; somente o botão do menu a fecha.

### Bottom sheet e acessibilidade

- [ ] `ConfirmModal` fica centralizado no desktop e vira bottom sheet no mobile.
- [ ] Filtro, detalhes de candidatura e confirmações usam o padrão global.
- [ ] Há handle, animação, cantos superiores e scroll interno.
- [ ] Arrastar o handle mais de 80px fecha; arrastar menos não fecha.
- [ ] Backdrop e Escape fecham quando permitido.
- [ ] Dialogs têm role, aria-modal, nome acessível e foco gerenciado.
- [ ] Botões de ícone têm label, foco visível e target mínimo de 44x44px.

### Responsividade

- [ ] Chips não estouram em 375px.
- [ ] Tabelas de dashboard, vagas, relatórios e usuários viram cards com `data-label`.
- [ ] Badges não cortam o texto.
- [ ] Paginação mobile exibe prev/next e página atual/total.
- [ ] Campos têm 48px de altura mínima e 16px de fonte no mobile.
- [ ] Formulários ficam em uma coluna sem overflow.
- [ ] Cards, gráficos e totais se adaptam a 360–390px.
- [ ] Login e recuperação são legíveis em 375px.
- [ ] Landscape 667x375 não quebra o layout.

### Qualidade

- [ ] `npm run build` passa.
- [ ] `npm run lint` passa ou pendências antigas são documentadas.
- [ ] Não há alteração em rotas, API, banco, autenticação ou permissões.
- [ ] Nenhuma tela desktop é degradada.
- [ ] Documentação está atualizada.

## Plano de testes

### Viewports

| Ambiente | Viewport | Expectativa |
| --- | ---: | --- |
| iPhone SE aproximado | 375x667 | bottom tab, cards, sheets e inputs sem zoom |
| iPhone moderno | 390x844 | safe area, scroll e formulários |
| Android compacto | 360x800 | chips, cards, totais e ações |
| Limite mobile | 767px | mobile ainda ativo |
| Limite desktop | 768x1024 | sidebar desktop ativa |
| Desktop | 1440x900 | regressão visual e funcional |

### Perfis e fluxos

- `usuario`: navegar por tabs, abrir Mais, acessar vaga, candidatar-se, editar currículo, abrir formulários e sair com confirmação.
- `admin`: dashboard, filtros, currículo, edição, vagas, relatórios, logout e navegação sem fechar sidebar desktop.
- `superAdmin`: fluxo de admin mais gestão de usuários, criação/edição e exclusão com confirmação.

### Casos específicos

- Bottom tab: item ativo, painel Mais, backdrop, Escape, safe area e último botão não coberto.
- Bottom sheet: confirmar/cancelar/loading, drag acima/abaixo de 80px, scroll longo, Tab/Shift+Tab/Enter/Space/Escape e leitor de tela quando disponível.
- Dashboard: chips, cards, filtros, badges e paginação em 375px.
- Formulários: teclado iOS sem zoom, coluna única, botões de 48px e scroll até edição.
- Regressão: callbacks/services/payloads inalterados, retorno do visualizador preservado e sidebar fechando somente pelo botão.

## Checks técnicos

```bash
cd web/curriculos_project
npm run build
npm run lint
git diff --check
```

Se necessário, executar lint focado:

```bash
cd web/curriculos_project
npx eslint src/components/BottomSheet src/components/AdminLayout src/components/UserLayout src/hooks/useMediaQuery.ts src/hooks/useBottomSheet.ts
```

Também verificar os viewports no DevTools, roles/labels/foco com inspeção de acessibilidade e ausência de artefatos indevidos em `dist`.

## Dependências e ordem de revisão

1. `Tech Lead`: validar inventário, contrato e limites.
2. `UI UX Designer`: definir tema do candidato, handle, estados e feedback.
3. `Frontend Engineer`: implementar por fases.
4. `Tech Lead`: revisar `BottomSheet` antes da migração dos consumidores.
5. `QA Engineer`: testar cada fase em mobile e desktop.
6. `Technical Writer`: consolidar documentação.
7. `Tech Lead`: revisar diff, aceite e prontidão para commit/deploy.

## Riscos e mitigações

| Risco | Mitigação |
| --- | --- |
| Estilo do admin contaminar o candidato | Criar variantes/estilos explícitos para o bottom tab do candidato. |
| Refatorar `ConfirmModal` quebrar callbacks | Manter a API atual e testar confirmar, cancelar e loading antes de migrar tudo. |
| Drag conflitar com scroll | Iniciar gesto apenas no handle. |
| Foco escapar do sheet | Implementar foco inicial, trap de Tab e restauração. |
| Bottom nav cobrir conteúdo | Padding inferior com altura da barra + safe area e teste do último elemento. |
| Tabelas continuarem ilegíveis | Cards com `data-label`, ações separadas e quebra segura. |
| 767/768 gerar inconsistência | Testar os dois limites explicitamente e centralizar a regra. |
| Regressão desktop | Isolar media queries e testar 1440x900. |
| Navegação perder estado ativo | Derivar ativo de `location.pathname`/`activeSection` e testar retornos. |

## Checklist de conclusão

- [ ] Inventário de componentes concluído.
- [ ] API de `BottomSheet` revisada.
- [ ] Hooks e componente global concluídos.
- [ ] `ConfirmModal` migrado sem regressão desktop.
- [ ] Bottom tab do candidato concluído.
- [ ] Bottom nav admin revisado.
- [ ] Dashboard, formulários, vagas, relatórios e usuários concluídos.
- [ ] View, edit e autenticação concluídos.
- [ ] Documentação atualizada.
- [ ] Build, lint e `git diff --check` concluídos.
- [ ] QA manual executado nos viewports e perfis do PRD.
- [ ] Pendências residuais registradas antes do commit/deploy.

## Status da execução — 17/08/2026

### Implementado

- `useMediaQuery`, `useBottomSheet` e `BottomSheet` reutilizável criados.
- `ConfirmModal` migrado para o padrão global, com modal centralizado no desktop, drawer no mobile, handle, drag de 80px, backdrop, Escape e gerenciamento de foco.
- Filtro avançado do dashboard, edição de usuário, recuperação de acesso no login e política de privacidade do cadastro migrados para `BottomSheet`.
- Bottom tab do candidato criada com `Início`, `Vagas`, `Currículo`, `Formação`, `Mais` e logout no painel secundário.
- Navegação administrativa preservada; sidebar desktop continua sendo controlada pelo botão e não fecha ao trocar de item.
- Tabelas de dashboard, vagas, relatórios e usuários ajustadas para cards até 767px, com `data-label` já existente preservado.
- Inputs mobile padronizados com 16px e altura mínima de 48px; grids de formulários, ações, paginação, cards de vagas, relatórios, view/edit e telas de upload ajustados.
- Documentação de UI/UX e guidelines de frontend atualizadas.

### Validações executadas

- `npm run lint`: passou.
- `npm run build`: passou.
- `git diff --check`: passou.
- Navegador local em 375px: login e cadastro renderizados; política de privacidade abriu como `role="dialog"` com bottom sheet e foco inicial em `Fechar`.
- Navegador local em 1440px: política de privacidade abriu como dialog centralizado.
- Console sem erros de aplicação; apenas avisos existentes de future flags do React Router.

### Pendências de QA manual

- Fluxos autenticados de candidato, admin e superAdmin dependem de sessão local para validar visualmente todas as rotas.
- Teste em dispositivos físicos iOS/Android e validação real de `safe-area-inset-bottom` continuam pendentes.
- O warning de chunks maiores que 500 kB no build já existia e não bloqueia a entrega.
