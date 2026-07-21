# Guidelines da API

## Stack

- Node.js com ES Modules.
- Express 5.
- Prisma ORM.
- PostgreSQL.
- Zod para validacao.
- JWT para autenticacao.
- Swagger para documentacao publica da API.

## Entrada da aplicacao

- `API/src/index.js`: configura Express, CORS, Helmet, Swagger, JSON e error handler.
- `API/src/routes.js`: declara as rotas e middlewares de permissao.

## Convencoes de rota

- Todas as rotas ficam sob `/api`.
- Rotas publicas de autenticacao ficam antes de `router.use(privateRoutes)`.
- Rotas administrativas usam `adminRoutes`.
- Rotas de super admin usam `superAdminRoutes`.
- Controllers devem ser envolvidos por `asyncHandler`.

## Controllers

Controllers devem:

- Ler dados de `req.params`, `req.query` e `req.body`.
- Validar payloads com Zod.
- Chamar repositories.
- Retornar JSON ou status HTTP adequado.
- Registrar auditoria quando a acao alterar dados relevantes.

Controllers nao devem:

- Conter SQL manual sem motivo forte.
- Repetir regras de query que pertencem ao repository/DTO.
- Fazer validacao manual extensa se houver schema Zod aplicavel.

## Repositories

Repositories devem concentrar acesso ao Prisma. Ao criar uma query nova:

- Mantenha includes reutilizaveis no DTO quando forem compartilhados.
- Preserve paginacao em listagens.
- Use transacoes para operacoes que alteram entidade principal e relacoes.
- Evite duplicar filtros complexos entre `list` e `count`.

## DTO e busca

- Filtros de listagem ficam em `API/src/app/DTO`.
- Curriculos usam `curriculoSearch.js`.
- Vagas usam `vagaSearch.js`.
- Busca textual deve considerar normalizacao sem acento usando `API/src/app/utils/textSearch.js`.
- Quando houver filtro textual em memoria, aplique paginacao depois do filtro.

## Usuarios administrativos

- A listagem de usuarios e exclusiva para `superAdmin`.
- O escopo `admins` deve incluir `admin` e `superAdmin`.
- O escopo `usuarios` deve listar apenas usuarios comuns.
- Um super admin nao pode remover o proprio perfil superAdmin pela atualizacao do proprio usuario.

## Validators

- Schemas Zod ficam em `API/src/app/validators`.
- Mensagens devem ser claras para o usuario final.
- Atualize os schemas quando o Prisma schema mudar.

## Erros

- Use o `errorHandler`.
- Nao exponha stack trace em producao.
- Retorne 401 para autenticacao ausente/invalida.
- Retorne 403 para usuario autenticado sem permissao.
- Retorne 404 quando o recurso nao existir.
- Retorne 400 para validacao ou entrada invalida.

## Swagger

- Swagger fica em `API/src/swagger.js`.
- Sempre atualize quando criar, remover ou alterar rota publica.
- Em producao, os docs so devem ficar ativos com `ENABLE_API_DOCS=true`.
