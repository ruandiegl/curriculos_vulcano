# PRD: Status Nao visualizado em curriculos

**ID:** PRD-002  
**Data:** 2026-08-13  
**Produto:** Curriculos Vulcano  
**Agente principal:** Product Manager (`agents/product-manager.md`)  
**Agentes de apoio:** Tech Lead, Database Engineer, Backend API Engineer, Frontend Engineer, UI UX Designer, QA Engineer, Technical Writer  

## Objetivo

Permitir que administradores distingam curriculos ainda nao lidos dos ja vistos no funil de recrutamento.

Hoje todo curriculo nasce com `status = visualizado` (`Curriculo.status` no Prisma, default no schema). Esse valor permanece ate o admin alterar manualmente. Com isso, curriculos novos se misturam aos ja conferidos e o filtro de status nao consegue destacar a fila de pendentes.

A feature adiciona o status `nao_visualizado`, define-o como default de cadastros novos e inclui essa opcao nos filtros de pesquisa da area administrativa.

## Perfis afetados

| Perfil | Impacto |
| --- | --- |
| Candidato (`usuario`) | Nenhum controle de status. Continua sem enviar `status` no create/update. O curriculo criado ou recriado nasce como `nao_visualizado`. |
| Admin | Ve o novo status na lista, nos filtros, no detalhe, na edicao e nos relatorios. Ao abrir o curriculo, o status passa de `nao_visualizado` para `visualizado`. |
| Super admin | Mesmo comportamento do admin nesta feature. Gestao de usuarios nao muda. |

## Diagnostico do sistema atual

Referencias: `docs/01-visao-geral.md`, `docs/02-arquitetura.md`, `docs/04-api-guidelines.md`, `docs/05-banco-de-dados.md`, `docs/06-autenticacao-e-permissoes.md`, `docs/07-ui-ux-responsivo.md`.

- `Curriculo.status` e um campo `String` com default `"visualizado"`.
- Enum de negocio (Zod, TypeScript, Swagger): `visualizado`, `entrevistado`, `selecionado`, `desconsiderado`.
- Candidato nao envia `status` (`curriculoUserCreateSchema` omite o campo). O default do banco preenche `visualizado`.
- Dashboard filtra por query `status` (`buildCurriculoWhere` + chips + modal de filtros).
- Detalhe administrativo (`/view/:id`) so muda status no select manual. Abrir o curriculo nao altera o valor.
- Relatorios e PDF do sistema usam `statusLabels` / `getStatusLabel`.
- `NovidadeUsuario.visualizado` e boolean de vagas novas para o candidato. **Nao reutilizar** esse campo para curriculo.

## Decisao de produto

Reusar o campo `status` do curriculo, adicionando `nao_visualizado` ao funil existente.

Nao criar um boolean paralelo (`visualizado: true/false`) porque:

- os filtros de pesquisa ja operam em `status`;
- relatorios, pills e selects ja tratam um unico funil;
- dois conceitos de "visualizado" no mesmo registro aumentariam ambiguidade.

Funil resultante:

```txt
nao_visualizado -> visualizado -> entrevistado -> selecionado
                                 \-> desconsiderado
```

O admin pode pular etapas pelo select (ex.: `nao_visualizado` direto para `entrevistado`).

## Escopo

### Banco

- Alterar o default de `Curriculo.status` de `"visualizado"` para `"nao_visualizado"`.
- Migration incremental. Curriculos ja existentes **permanecem** com o status atual (em geral `visualizado`). Sem backfill para `nao_visualizado`.
- Seed do super admin nao precisa mudar (nao cria curriculo).

### API

- Incluir `nao_visualizado` no enum Zod de create/update.
- Manter `status` omitido no schema do candidato.
- No create, se `status` nao vier no payload, persistir `nao_visualizado` (default Prisma).
- Admin pode enviar `status` explicitamente no create/update.
- Filtro `GET /api/curriculos?status=nao_visualizado` deve funcionar pelo `buildCurriculoWhere` atual (igualdade no campo).
- Swagger: enum `CurriculoStatus` e exemplos de create.
- Candidato **nao** pode marcar o proprio curriculo como visualizado.

### Marcacao automatica como visualizado

Quando um **admin ou superAdmin** abre o curriculo em `/view/:id` e o status atual e `nao_visualizado`, o frontend deve chamar `PATCH`/`PUT` de update com `{ status: 'visualizado' }` uma vez, apos o load com sucesso.

Regras:

- So promove `nao_visualizado` -> `visualizado`.
- Nao altera `entrevistado`, `selecionado` ou `desconsiderado`.
- Nao dispara no GET da listagem.
- Nao dispara quando o candidato abre o proprio curriculo.
- Abrir `/edit/:id` **nao** promove automaticamente (edicao e acao distinta; o admin ainda pode mudar o status no formulario).
- GET da API permanece sem efeito colateral (sem update em `show`).

### Frontend

- Tipo `CurriculoStatus` e `statusLabels` passam a incluir `nao_visualizado` com label **Nao visualizado**.
- Cor distinta das demais (sugestao: tom ambar/laranja, ex. `#d97706`), para a fila pendente destacar na lista.
- Ordem sugerida nos chips e no select: Nao visualizado, Visualizado, Entrevistado, Selecionado, Desconsiderado (pendente primeiro).
- Dashboard: chip de filtro, badge de total por status, select do modal de filtros, pill da tabela (desktop e card mobile).
- Totais iniciais em `statusTotals` incluem a nova chave.
- Tela de visualizacao: select e label.
- Tela de edicao administrativa: select.
- Relatorios: contagem, cores do grafico e PDF.
- PDF gerado pelo sistema: label do novo status.
- Lista de candidatos em vaga (`newJob`): label via `getStatusLabel` (ja cobre se o helper for atualizado).

### Documentacao

- Este PRD.
- Atualizar `docs/01-visao-geral.md` na implementacao (status do funil).
- Atualizar `docs/05-banco-de-dados.md` se o default do modelo for citado.
- Swagger na mesma entrega da API.

## Fora de escopo

- Boolean separado de "lido/nao lido".
- Historico de quem visualizou ou data da primeira visualizacao.
- Notificacao/badge na navegacao (contador global de nao visualizados).
- Ordenacao forcada da lista por nao visualizados (a lista continua `createdAt desc`).
- Recalcular curriculos antigos para `nao_visualizado`.
- Alterar `NovidadeUsuario`.
- Permissoes novas. Continua `adminRoutes` para listagem/gestao.
- Filtro extra independente do status (cidade, CNH, etc. permanecem iguais).
- Auto-promocao ao apenas passar o mouse ou ao baixar PDF sem abrir `/view/:id`.

## Criterios de aceite

1. **Default de cadastro:** curriculo criado pelo candidato nasce com `status = nao_visualizado`.
2. **Default administrativo:** curriculo criado pelo admin sem `status` no body tambem nasce `nao_visualizado`.
3. **Filtro dashboard (chips):** existe o filtro "Nao visualizado" com contagem correta, combinavel com busca textual e filtros avancados (cidade, estado, atuacao, CNH, curso ativo).
4. **Filtro dashboard (modal):** o select de Status inclui "Nao visualizado".
5. **Query API:** `GET /api/curriculos?status=nao_visualizado` retorna apenas esses registros, com paginacao correta.
6. **Lista:** a pill/card mostra "Nao visualizado" com cor propria; badges de status nao sofrem ellipsis (guideline de `docs/07-ui-ux-responsivo.md`).
7. **Abertura admin:** ao abrir `/view/:id` de um curriculo `nao_visualizado`, o status vira `visualizado` e persiste apos reload.
8. **Idempotencia:** reabrir um curriculo ja `visualizado` (ou posterior) nao regride o status.
9. **Candidato:** visualizar ou editar o proprio curriculo nao altera `status`.
10. **Select manual:** admin pode mudar de/para `nao_visualizado` no detalhe e na edicao.
11. **Relatorios:** o grafico/contagem inclui Nao visualizado.
12. **Dados antigos:** curriculos existentes nao mudam de status na migration.
13. **Mobile:** chips, modal drawer e cards da lista exibem e filtram o novo status sem estourar layout.
14. **Contrato:** Zod rejeita status fora do enum atualizado; Swagger lista `nao_visualizado`.
15. **Checks:** `npm run build` no frontend e `node --check src/index.js` + `prisma:generate` na API passam para os arquivos desta feature.

## Riscos

| Risco | Mitigacao |
| --- | --- |
| Confundir `status` do curriculo com `NovidadeUsuario.visualizado` | Nao reutilizar o boolean de novidades. Nome do valor: `nao_visualizado`. |
| GET com side effect | Promocao so no frontend, na tela `/view/:id`, via update ja existente. |
| Race: dois admins abrem o mesmo curriculo | Ambos enviam `visualizado`; resultado final correto. |
| Relatorios e totais hardcoded | Atualizar todos os `Record<CurriculoStatus, number>` e `STATUS_TONES`. |
| Admin cria curriculo ja "visto" | Permitir `status` no payload admin; default so quando omitido. |
| Filtro persistido em `sessionStorage` / URL | Valor novo e um `CurriculoStatus` valido; `isCurriculoStatus` precisa aceitar o enum atualizado. |
| Labels longos no chip mobile | Usar "Nao visualizado"; validar wrap dos chips existentes. |

## Dependencias entre camadas

1. Database Engineer: default Prisma + migration.
2. Backend API Engineer: Zod, Swagger. Filtro de listagem ja funciona por igualdade.
3. Frontend Engineer: tipos, helpers, dashboard, view, edit, reports, PDF.
4. UI UX Designer: cor, ordem dos chips, mobile.
5. QA Engineer: cenarios abaixo.
6. Technical Writer: docs e Swagger textual.

Nao ha mudanca de permissao JWT.

## Direcao tecnica (Tech Lead)

- Preservar o padrao page -> service -> controller -> repository -> Prisma.
- Nao criar DTO/filtro novo; estender o enum e o default.
- Nao marcar visualizado no `CurriculoController.show`.
- Garantir que `curriculoUserCreateSchema` / `curriculoUserUpdateSchema` continuem omitindo `status`.
- Centralizar label/cor em `web/curriculos_project/src/utils/status.ts` para dashboard, view, edit, reports e PDF nao divergirem.

### Modulos afetados

- `API/prisma/schema.prisma`
- `API/prisma/migrations/` (nova)
- `API/src/app/validators/curriculoValidator.js`
- `API/src/swagger.js`
- `web/curriculos_project/src/types/curriculo.ts`
- `web/curriculos_project/src/utils/status.ts`
- `web/curriculos_project/src/pages/dashboard/index.tsx`
- `web/curriculos_project/src/pages/view/index.tsx`
- `web/curriculos_project/src/pages/edit/index.tsx`
- `web/curriculos_project/src/pages/reports/index.tsx`
- `web/curriculos_project/src/utils/curriculoPdf.ts` (indireto via helper)
- `docs/01-visao-geral.md` (na implementacao)

`curriculoSearch.js` e `listCurriculos` tendem a nao precisar de logica extra se o query param continuar sendo `status`.

## Sequencia de implementacao

1. Migration: default `nao_visualizado`.
2. Zod + Swagger + tipos TypeScript + `statusLabels`/`getStatusColor`.
3. Dashboard (chips, totais, modal).
4. Auto-promocao em `/view/:id` para admin.
5. Edit + reports + conferir PDF e `newJob`.
6. Docs de visao geral.
7. Build, lint focado e cenario manual de QA.

## Plano de teste (QA)

### Cadastro

- Candidato cria curriculo: status `nao_visualizado` no banco e na lista admin.
- Admin cria curriculo sem status: `nao_visualizado`.
- Admin cria curriculo com `status: selecionado`: permanece `selecionado`.

### Filtros

- Chip "Nao visualizado" lista so esses.
- Chip "Visualizado" nao inclui os novos.
- Modal Status = Nao visualizado + cidade funciona.
- "Todos" continua somando todos os status.
- Contagens dos badges batem com `meta.total` da API por status.
- URL `?status=nao_visualizado` reabre o filtro correto.

### Visualizacao

- Admin abre `/view/:id` pendente: vira Visualizado; reload confirma.
- Admin abre curriculo entrevistado: status nao muda sozinho.
- Candidato abre o proprio curriculo: status permanece `nao_visualizado`.
- Select manual `nao_visualizado` -> `desconsiderado` funciona.

### Regressao

- Entrevistado, selecionado e desconsiderado inalterados.
- Paginacao, busca textual e filtros avancados.
- Relatorio e exportacao PDF.
- Mobile: chips, drawer de filtros, cards da tabela.

### Dados

- Apos migrate, um curriculo antigo `visualizado` continua `visualizado`.

## Proxima acao recomendada

Implementar na ordem da sequencia acima, com o Frontend Engineer e o Database Engineer como executores imediatos, revisao do Tech Lead no contrato do enum e no efeito de auto-promocao restrito a `/view/:id`.
