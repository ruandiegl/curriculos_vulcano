# Plano 002 - Status não visualizado em currículos

## Tarefa

Implementar o PRD-002, adicionando o status `nao_visualizado` ao funil de currículos, usando-o como default para novos cadastros e promovendo-o automaticamente para `visualizado` quando um admin ou superAdmin abrir o detalhe administrativo em `/view/:id`.

> Premissa: o campo `Tarefa: [DESCREVA SUA TAREFA AQUI]` veio sem descrição concreta. Este plano considera como tarefa a implementação integral do PRD `docs/prd-status-nao-visualizado.md`.

## Referências consultadas

- `docs/README.md`: stack, índice de documentação, PRDs e regra de atualização documental junto com mudanças de comportamento.
- `docs/01-visao-geral.md`: perfis, módulos administrativos e convenção de idioma.
- `docs/02-arquitetura.md`: fluxo page -> service -> API -> controller -> repository -> Prisma e organização dos módulos.
- `docs/03-frontend-guidelines.md`: tipos de domínio, services, estado remoto, rotas, formulários e checks de frontend.
- `docs/04-api-guidelines.md`: Express, Zod, controllers, repositories, filtros, erros e Swagger.
- `docs/05-banco-de-dados.md`: schema Prisma, migrations incrementais, geração do client e preservação de dados antigos.
- `docs/06-autenticacao-e-permissoes.md`: perfis `usuario`, `admin` e `superAdmin`, além do middleware `adminRoutes`.
- `docs/07-ui-ux-responsivo.md`: pills/badges sem ellipsis, cards mobile, drawers, acessibilidade e responsividade.
- `docs/08-desenvolvimento-local.md`: comandos e portas locais de API/frontend.
- `docs/09-qualidade-seguranca-deploy.md`: build, lint, checks de sintaxe, Prisma e procedimento de migration/deploy.
- `agents/README.md`: seleção, composição e responsabilidades dos agentes.
- `agents/tech-lead.md`: coordenação de mudanças que cruzam frontend, API e banco.
- `agents/database-engineer.md`: migration, default Prisma e preservação dos dados existentes.
- `agents/backend-api-engineer.md`: validators Zod, contrato HTTP, filtro e Swagger.
- `agents/frontend-engineer.md`: páginas React, services, tipos e integração com a API.
- `agents/ui-ux-designer.md`: ordem, cor, responsividade e acessibilidade dos status.
- `agents/qa-engineer.md`: matriz de testes por perfil, regressão, mobile e validações técnicas.
- `agents/technical-writer.md`: atualização de `docs/` e documentação do contrato.
- `docs/prd-status-nao-visualizado.md`: objetivo, escopo, decisões, critérios de aceite, riscos e sequência recomendada.

## Agente de IA recomendado

Agente principal: `Tech Lead`.

Justificativa: a tarefa altera simultaneamente o modelo Prisma, o contrato Zod/Swagger, o filtro da API, tipos e helpers TypeScript, dashboard, detalhe, edição, relatórios, PDF, UX mobile e documentação. Conforme `agents/README.md` e `agents/tech-lead.md`, o Tech Lead é o agente adequado para decidir os limites entre camadas, coordenar a ordem de implementação, evitar duplicação de regras de status e exigir as validações proporcionais ao risco.

Agentes de apoio:

- `Database Engineer`: default do campo `Curriculo.status`, migration incremental e verificação de que registros antigos não sofram backfill.
- `Backend API Engineer`: enum Zod, proteção do schema do candidato, filtro `status`, contrato de update e Swagger.
- `Frontend Engineer`: tipos, helper central, dashboard, `/view/:id`, `/edit/:id`, relatórios, PDF e integração com `updateCurriculo`.
- `UI UX Designer`: cor âmbar/laranja, ordem pendente-primeiro, pills/cards mobile, overflow e acessibilidade.
- `QA Engineer`: cenários por perfil, idempotência, regressão de filtros/relatórios/PDF, mobile e checks de build.
- `Technical Writer`: atualização de `docs/01-visao-geral.md`, `docs/05-banco-de-dados.md` e referências do contrato quando necessário.

## Objetivo e resultado esperado

Permitir que a área administrativa diferencie currículos novos ainda não lidos dos currículos já visualizados ou em etapas posteriores do funil.

O funil esperado é:

```txt
nao_visualizado -> visualizado -> entrevistado -> selecionado
                                 \\-> desconsiderado
```

O campo existente `Curriculo.status` deve continuar sendo a única fonte de verdade. Não criar boolean paralelo e não reutilizar `NovidadeUsuario.visualizado`.

## Perfis afetados

| Perfil | Comportamento esperado |
| --- | --- |
| `usuario` | Cria/edita o próprio currículo sem enviar `status`; novos currículos nascem `nao_visualizado`; abrir ou editar o próprio currículo não o promove. |
| `admin` | Filtra, lista, visualiza, edita e altera status; abrir `/view/:id` promove somente `nao_visualizado` para `visualizado`. |
| `superAdmin` | Mesmo comportamento do admin nesta feature; permissões de gestão de usuários permanecem inalteradas. |

## Diagnóstico atual

- `Curriculo.status` é `String` com `@default("visualizado")` em `API/prisma/schema.prisma`.
- A migration inicial também registra o default antigo; a mudança deve ser feita por nova migration, sem editar migration aplicada.
- O enum atual aparece em `API/src/app/validators/curriculoValidator.js`, `API/src/swagger.js` e `web/curriculos_project/src/types/curriculo.ts`.
- O schema do candidato já remove `status` por meio de `curriculoUserCreateSchema` e `curriculoUserUpdateSchema`; essa proteção deve ser preservada.
- `API/src/app/DTO/curriculoSearch.js` já transforma `query.status` em igualdade no campo, portanto a tendência é não exigir filtro novo.
- `web/curriculos_project/src/utils/status.ts` centraliza labels e cores, mas ainda não contém `nao_visualizado`.
- O dashboard já deriva filtros, chips, select e contagens de `statusLabels`, mas possui objetos `statusTotals` hardcoded que precisam da nova chave.
- A tela `/view/:id` atualiza status apenas quando o select é alterado manualmente; será necessário inserir promoção automática após o load bem-sucedido, restrita ao admin.
- A tela `/edit/:id`, relatórios, `newJob` e `curriculoPdf` dependem direta ou indiretamente do tipo/helper de status.
- `NovidadeUsuario.visualizado` é outro conceito e deve permanecer booleano e inalterado.

## Escopo

Incluído:

- Alterar o default Prisma de `visualizado` para `nao_visualizado`.
- Criar migration incremental sem atualizar registros antigos.
- Aceitar `nao_visualizado` nos schemas administrativos de create/update.
- Manter `status` omitido nos schemas de create/update do candidato.
- Manter o filtro existente `GET /api/curriculos?status=nao_visualizado` com paginação e combinações atuais.
- Atualizar o enum do Swagger e os exemplos de criação.
- Atualizar `CurriculoStatus`, `statusLabels`, `getStatusLabel` e `getStatusColor` no frontend.
- Exibir o novo status nos chips, contagens, modal de filtros, tabela/card mobile, detalhe, edição, relatórios e PDF.
- Promover automaticamente `nao_visualizado -> visualizado` uma vez após o carregamento bem-sucedido de `/view/:id` para admin/superAdmin.
- Atualizar a documentação do funil e do default.
- Executar validações técnicas e cenários manuais definidos neste plano.

Fora de escopo:

- Criar boolean separado de lido/não lido.
- Alterar `NovidadeUsuario`.
- Histórico de visualização, usuário que visualizou ou timestamp da primeira visualização.
- Badge global de navegação ou notificação de pendências.
- Ordenar a lista por não visualizados; manter `createdAt desc`.
- Fazer backfill de currículos existentes.
- Alterar permissões JWT ou criar rota nova.
- Promover ao listar, editar, passar o mouse ou baixar PDF sem abrir `/view/:id`.

## Decisões técnicas

- Reutilizar `Curriculo.status` como fonte única de verdade.
- Manter o campo como `String`, seguindo o schema atual e o contrato já existente; apenas ampliar os valores válidos.
- Fazer migration apenas do default da coluna. O banco deve manter os valores existentes e não executar `UPDATE` de dados históricos.
- Centralizar label e cor em `web/curriculos_project/src/utils/status.ts`, para dashboard, view, edit, reports, `newJob` e PDF não divergirem.
- Exibir `Nao visualizado` primeiro em `statusLabels`, chips e selects, para destacar a fila pendente.
- Usar cor distinta de pendência, preferencialmente âmbar/laranja, validando contraste e leitura nos temas/estados existentes.
- Implementar a promoção automática no `useEffect` de carregamento da página de view, somente depois de receber o currículo com sucesso e verificar `isAdmin` e `status === 'nao_visualizado'`.
- Reutilizar `updateCurriculo(id, { status: 'visualizado' })`; não adicionar efeito colateral ao `GET /api/curriculos/:id` ou ao controller `show`.
- Atualizar o estado local com a resposta do update ou com a promoção equivalente, evitando uma segunda chamada desnecessária.
- Tratar falha na promoção automática sem impedir a visualização do currículo; registrar mensagem de erro de forma compatível com o feedback existente e permitir nova tentativa segura, se necessário.
- Não alterar status posteriores (`entrevistado`, `selecionado`, `desconsiderado`) ao abrir o detalhe.
- Preservar o padrão page -> service -> controller -> repository -> Prisma e não criar DTO/filtro novo sem evidência de necessidade.

## Módulos e arquivos afetados

### Banco e API

- `API/prisma/schema.prisma`
- `API/prisma/migrations/<nova-migration>/migration.sql`
- `API/src/app/validators/curriculoValidator.js`
- `API/src/app/DTO/curriculoSearch.js` — revisar; alterar somente se a validação do query exigir.
- `API/src/app/Repositories/CurriculoRepository.js` — revisar list/count para garantir filtro idêntico.
- `API/src/app/controllers/CurriculoController.js` — revisar para manter `show` sem side effect e candidato sem acesso ao campo.
- `API/src/swagger.js`

### Frontend

- `web/curriculos_project/src/types/curriculo.ts`
- `web/curriculos_project/src/utils/status.ts`
- `web/curriculos_project/src/services/curriculos.ts` — revisar tipos e assinatura de update/list.
- `web/curriculos_project/src/pages/dashboard/index.tsx`
- `web/curriculos_project/src/pages/dashboard/styles.ts` — ajustar somente se a nova label/cor exigir.
- `web/curriculos_project/src/pages/view/index.tsx`
- `web/curriculos_project/src/pages/edit/index.tsx`
- `web/curriculos_project/src/pages/reports/index.tsx`
- `web/curriculos_project/src/utils/curriculoPdf.ts` — indireto via `getStatusLabel`, revisar saída.
- `web/curriculos_project/src/pages/newJob/index.tsx` — revisar label de candidaturas.

### Documentação

- `docs/01-visao-geral.md`
- `docs/05-banco-de-dados.md`
- `docs/prd-status-nao-visualizado.md` — já é a referência; atualizar apenas se decisões de implementação divergirem do PRD.

## Plano de implementação

### 1. Preparação e inventário

- Confirmar branch/worktree e preservar alterações preexistentes.
- Mapear todos os usos de `CurriculoStatus`, `statusLabels`, `getStatusLabel`, `getStatusColor` e objetos `Record<CurriculoStatus, ...>`.
- Confirmar a rota e o método usados por `getCurriculo` e `updateCurriculo`.
- Confirmar como `useAuth` expõe `user.tipo` e que a tela de view diferencia candidato de admin.
- Registrar qualquer ocorrência fora dos arquivos previstos antes de alterar o contrato.

### 2. Banco de dados

- Alterar `@default("visualizado")` para `@default("nao_visualizado")` no modelo `Curriculo`.
- Gerar migration incremental com nome descritivo, sem editar `000001_init` nem migrations já aplicadas.
- Verificar que o SQL gerado altera apenas o default da coluna.
- Não executar backfill nem alterar seed, pois o seed não cria currículo.
- Rodar `npm run prisma:generate` e revisar o client gerado apenas como artefato local, sem incluir arquivos gerados indevidos no commit.

### 3. Contrato da API

- Acrescentar `nao_visualizado` ao `z.enum` compartilhado de currículo.
- Confirmar que `curriculoUserCreateSchema` e `curriculoUserUpdateSchema` continuam omitindo `status`.
- Confirmar que admin/superAdmin podem enviar status explícito em create/update.
- Confirmar que payload sem `status` delega o default ao Prisma.
- Verificar que update do candidato com `status` falha por validação e que o controller não reintroduz o campo.
- Manter `GET /api/curriculos/:id` sem atualização automática.
- Validar que `buildCurriculoWhere` e repository `list`/`count` usam o mesmo filtro de status e preservam paginação.
- Atualizar `CurriculoStatus` no Swagger para listar `nao_visualizado` e atualizar exemplo de create quando aplicável.
- Não mudar middleware: o comportamento continua usando `adminRoutes` e permissões atuais.

### 4. Tipos e helper compartilhado do frontend

- Ampliar `CurriculoStatus` com `nao_visualizado`.
- Adicionar `{ label: 'Nao visualizado', status: 'nao_visualizado' }` no início de `statusLabels`.
- Adicionar cor pendente distinta em `getStatusColor`.
- Conferir que nenhuma função assume implicitamente quatro status.
- Garantir que o helper continue sendo a origem dos labels do dashboard, view, edit, reports, `newJob` e PDF.

### 5. Dashboard e filtros

- Fazer o chip `Nao visualizado` aparecer automaticamente a partir de `statusLabels`.
- Adicionar a chave inicial `nao_visualizado: 0` nos objetos `statusTotals`, inclusive no fallback de erro.
- Confirmar que o cálculo de totais continua cobrindo todos os status e não duplica registros.
- Confirmar que o filtro do chip envia `status=nao_visualizado` e que o filtro `Todos` não envia status.
- Confirmar que o select do modal de filtros usa a mesma lista e ordem.
- Preservar combinação com busca textual, cidade, estado, atuação, CNH e curso ativo.
- Preservar estado em URL e `sessionStorage`; `isCurriculoStatus` deve aceitar o novo valor por meio do helper atualizado.
- Revisar pills da tabela desktop e cards mobile para que `Nao visualizado` não seja cortado por ellipsis.
- Verificar contagem exibida contra `meta.total` retornado para cada status.

### 6. Marcação automática na tela de visualização

- Após `getCurriculo(id)` retornar com sucesso, verificar se o usuário é `admin` ou `superAdmin` e se o status é `nao_visualizado`.
- Executar uma única chamada `updateCurriculo(id, { status: 'visualizado' })` para esse caso.
- Atualizar `curriculo` com o retorno do update para que label, select e PDF reflitam o valor persistido.
- Evitar chamada para candidato, status já visualizado ou qualquer status posterior.
- Não executar a promoção no `/edit/:id`, no download de PDF ou em outras telas.
- Evitar loop de `useEffect` e chamadas duplicadas em re-render; usar dependências e fluxo de load cuidadosamente.
- Se a promoção falhar, manter o currículo carregado e sinalizar o problema sem mascarar falha de carregamento do detalhe.
- Confirmar concorrência: duas promoções simultâneas continuam idempotentes porque ambas resultam em `visualizado`.

### 7. Edição, relatórios, PDF e vaga

- Incluir o novo status no select administrativo de `/edit/:id` via `statusLabels`.
- Confirmar que candidato não recebe controle de status no formulário.
- Atualizar `STATUS_TONES` e qualquer `Record<CurriculoStatus, number>` em reports.
- Incluir `nao_visualizado` na contagem, gráfico, legenda, filtros e detalhes dos relatórios.
- Confirmar que `curriculoPdf.ts` imprime `Nao visualizado` via `getStatusLabel`.
- Confirmar que `newJob` usa o helper e não mantém labels hardcoded.
- Validar que os status existentes mantêm labels, cores e transições manuais atuais.

### 8. Documentação

- Atualizar `docs/01-visao-geral.md` para documentar o funil e o comportamento de abertura administrativa.
- Atualizar `docs/05-banco-de-dados.md` para registrar o default novo e a regra de preservação de dados antigos.
- Se a implementação modificar algum detalhe do contrato, refletir a decisão no PRD ou em documentação relacionada.
- Não documentar `NovidadeUsuario.visualizado` como parte desta feature.

### 9. Validação e entrega

- Executar checks técnicos listados abaixo.
- Executar os cenários manuais por perfil, fluxo e viewport.
- Revisar diff procurando status hardcoded, backfill acidental, chamada de update em GET e regressões de permissão.
- Registrar no plano ou no PR/entrega qualquer check não executado e seu motivo.

## Critérios de aceite

- [ ] Currículo criado por candidato sem status nasce `nao_visualizado`.
- [ ] Currículo criado por admin sem status nasce `nao_visualizado`.
- [ ] Admin pode criar currículo com status explícito, por exemplo `selecionado`, sem ser sobrescrito pelo default.
- [ ] Candidato não consegue enviar ou alterar `status` no próprio currículo.
- [ ] `GET /api/curriculos?status=nao_visualizado` retorna somente os registros correspondentes, com paginação correta.
- [ ] Busca e filtros avançados continuam combináveis com o novo status.
- [ ] Dashboard exibe chip, contagem, select, pill desktop e card mobile de `Nao visualizado`.
- [ ] Badge/pill não sofre ellipsis nem estoura o layout mobile.
- [ ] Admin/superAdmin que abre `/view/:id` de um currículo não visualizado o vê persistido como `visualizado` após o update.
- [ ] Reabrir currículo visualizado, entrevistado, selecionado ou desconsiderado não o regride nem gera promoção indevida.
- [ ] Candidato abrir ou editar o próprio currículo não altera o status.
- [ ] `/edit/:id` permite ao admin selecionar `nao_visualizado` manualmente.
- [ ] Relatórios, gráfico, contagem, cores, PDF e `newJob` exibem a nova label.
- [ ] Swagger lista `nao_visualizado` no enum `CurriculoStatus`.
- [ ] Migration não altera status de currículos existentes.
- [ ] Não há mudança em permissões JWT nem em `NovidadeUsuario.visualizado`.
- [ ] `npm run build` do frontend, `npm run lint` e checks de API/Prisma passam ou têm pendências explicitamente registradas.

## Plano de testes

### API e dados

| Cenário | Resultado esperado |
| --- | --- |
| Criar currículo como candidato sem status | HTTP 201 e registro `nao_visualizado`. |
| Criar currículo como admin sem status | HTTP 201 e registro `nao_visualizado`. |
| Criar currículo como admin com `selecionado` | HTTP 201 e status `selecionado`. |
| Atualizar como admin para `nao_visualizado` | HTTP 200 e valor persistido. |
| Atualizar como candidato com `status` | Rejeição de validação; status não é alterado. |
| Status fora do enum | Rejeição Zod/HTTP 400 conforme error handler. |
| Listar com `status=nao_visualizado` | Apenas pendentes e `meta` consistente. |
| Listar com status + filtros avançados | Interseção correta dos filtros e paginação preservada. |
| Aplicar migration sobre dados antigos | Valores existentes permanecem inalterados. |

### Frontend e perfis

- Admin abre currículo `nao_visualizado`: uma promoção para `visualizado` após load e reload confirma persistência.
- SuperAdmin reproduz o mesmo fluxo.
- Candidato abre o próprio currículo: nenhuma chamada de update de status.
- Admin abre currículo `entrevistado`, `selecionado` ou `desconsiderado`: status permanece igual.
- Admin muda manualmente de `nao_visualizado` para `desconsiderado` e de status posterior para `nao_visualizado`.
- Re-render ou reload da tela não cria chamadas repetidas além do fluxo necessário.
- Falha na chamada automática deixa o detalhe utilizável e mostra feedback compatível.

### Dashboard, relatórios e regressão

- Chip `Nao visualizado` lista somente pendentes.
- Chip `Visualizado` não inclui novos currículos.
- Modal com `Nao visualizado` + cidade funciona.
- `Todos` continua somando todos os status.
- URL `?status=nao_visualizado` e filtro persistido reabrem corretamente.
- Relatórios contam e coloreiam a nova categoria.
- PDF do sistema imprime a label correta.
- Lista de candidatos em vaga mostra a label correta.
- Status antigos continuam funcionando em lista, detalhe, edição, filtro e relatório.

### Responsividade e acessibilidade

- Validar desktop e mobile nos viewports aproximados de 375x667, 390x844, 412x915, 767px, 768px e desktop.
- Confirmar chips, drawer/modal, tabela convertida em cards e pills sem overflow.
- Confirmar contraste da cor pendente, foco visível e leitura da label completa.
- Confirmar que loading, erro e estado vazio continuam claros.

## Checks técnicos

Frontend:

```bash
cd web/curriculos_project
npm run build
npm run lint
```

Backend e Prisma:

```bash
cd API
node --check src/index.js
npm run prisma:generate
```

Migration/deploy local, quando houver banco disponível:

```bash
cd API
npm run prisma:migrate
npm run prisma:deploy
```

Checks focados recomendados:

- `node --check` nos controllers, validators, DTOs e repositories JS alterados.
- ESLint nos arquivos TypeScript/TSX alterados caso o lint completo revele débitos preexistentes.
- Verificação manual do SQL da migration e de um registro antigo antes/depois da aplicação.
- Verificação do JSON de Swagger em `/api/docs.json` quando a API estiver em execução.

## Dependências e ordem de execução

1. `Tech Lead`: confirmar contrato, arquivos, restrições de permissão e sequência.
2. `Database Engineer`: schema, migration e geração do Prisma client.
3. `Backend API Engineer`: Zod, revisão do filtro, controller e Swagger.
4. `Frontend Engineer`: tipos/helper, dashboard, view, edit, reports, PDF e `newJob`.
5. `UI UX Designer`: revisar cor, ordem, overflow, mobile e acessibilidade.
6. `Technical Writer`: atualizar documentação de visão geral e banco.
7. `QA Engineer`: executar matriz, regressão e checks finais.
8. `Tech Lead`: revisar diff final, riscos residuais e critérios de aceite.

## Riscos e mitigações

| Risco | Mitigação |
| --- | --- |
| Backfill acidental de currículos antigos | Migration somente para default; revisar SQL e testar dados antes/depois. |
| Candidato alterando status | Manter `status` omitido nos schemas de usuário e testar payload malicioso. |
| GET com side effect | Promoção somente no frontend de `/view/:id`; não alterar `CurriculoController.show`. |
| Status divergente entre telas | Centralizar label/cor em `utils/status.ts` e eliminar listas paralelas. |
| Objeto `Record` incompleto | Buscar e atualizar todos os objetos tipados de totais/cores. |
| Chamada automática em loop | Controlar dependências do efeito, estado de loading e condição exata `nao_visualizado`. |
| Falha de promoção bloqueando a leitura | Tratar update como etapa complementar; manter currículo carregado e exibir feedback. |
| Dois admins abrindo simultaneamente | Aceitar concorrência; ambos gravam o mesmo destino idempotente. |
| Label cortada no mobile | Seguir `docs/07-ui-ux-responsivo.md`, sem ellipsis em badges e com validação em cards/chips. |
| Confusão com `NovidadeUsuario.visualizado` | Não alterar o booleano nem reutilizar o campo no código/documentação. |
| Swagger ou docs desatualizados | Atualizar contrato e documentação na mesma entrega. |

## Checklist de conclusão

- [ ] Premissa sobre a tarefa placeholder confirmada no histórico/entrega.
- [x] Migration incremental criada e revisada.
- [ ] Default novo validado contra banco para candidato e admin; validação estática dos schemas concluída.
- [ ] Dados antigos preservados em banco; SQL revisado e sem backfill.
- [x] Enum Zod, TypeScript e Swagger sincronizados.
- [x] Proteção de status do candidato validada no parser (campo omitido).
- [x] Filtro, dashboard e contagens atualizados; validação integrada depende do banco local.
- [x] Auto-promoção restrita a admin/superAdmin em `/view/:id`.
- [x] Edição, relatórios, PDF e `newJob` revisados por helper compartilhado.
- [ ] Mobile e acessibilidade revisados manualmente.
- [x] Documentação atualizada.
- [x] Build, lint, sintaxe API e Prisma generate validados.
- [x] Critérios de aceite e riscos residuais registrados.

## Execução realizada em 13/08/2026

- Default de `Curriculo.status` alterado para `nao_visualizado`.
- Migration criada em `API/prisma/migrations/20260813120000_add_curriculo_status_nao_visualizado_default/migration.sql`, contendo somente `ALTER COLUMN ... SET DEFAULT`; não houve backfill.
- Enum Zod, Swagger e tipo `CurriculoStatus` atualizados.
- `statusLabels` passou a usar a ordem pendente-primeiro e `getStatusColor` recebeu cor âmbar para o status pendente.
- Dashboard e relatórios passaram a contabilizar o novo status; relatórios reutilizam o helper central de cores.
- Tela `/view/:id` promove o status somente para admin/superAdmin, após load bem-sucedido e somente quando o status inicial é `nao_visualizado`.
- Documentação de visão geral e banco atualizada.

Validações executadas:

- `npm.cmd run prisma:generate`: passou.
- `npm.cmd run build` em `web/curriculos_project`: passou.
- `npm.cmd run lint` em `web/curriculos_project`: passou.
- `node --check` no entrypoint e módulos JS afetados: passou.
- Parser Zod testado para aceitar `nao_visualizado` no schema administrativo e remover `status` dos schemas do candidato: passou.
- `git diff --check`: passou.

Pendências de ambiente:

- `prisma migrate status` não concluiu porque PostgreSQL não está disponível em `localhost:5432`.
- `prisma migrate deploy` e testes integrados com dados reais ficaram pendentes até o banco local estar disponível.
- Validação visual/manual mobile ficou pendente.
