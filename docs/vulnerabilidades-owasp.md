# Relatorio de vulnerabilidades OWASP

Data da avaliacao: 2026-05-26

Escopo analisado:
- API Express em `API/src`
- Frontend React em `web/curriculos_project/src`
- Fluxos de autenticacao, curriculos, usuarios, vagas, candidaturas e upload de PDF

Referencias OWASP usadas:
- [OWASP Top 10:2021](https://owasp.org/Top10/2021/)
- [A01:2021 - Broken Access Control](https://owasp.org/Top10/2021/pt-BR/A01_2021-Broken_Access_Control/)
- [A02:2021 - Cryptographic Failures](https://owasp.org/Top10/2021/A02_2021-Cryptographic_Failures/)
- [A03:2021 - Injection](https://owasp.org/Top10/2021/A03_2021-Injection/)
- [OWASP API Security Top 10:2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)

## Resumo executivo

A aplicacao tem uma base razoavel de validacao com Zod, Prisma e controle de token JWT, mas ainda ha riscos importantes em autorizacao de API. O ponto mais critico e que diversas rotas sensiveis validam apenas se o usuario esta autenticado, sem validar se ele e admin ou dono do recurso.

As principais vulnerabilidades encontradas estao ligadas a:
- Quebra de controle de acesso.
- Falta de autorizacao por objeto em endpoints com `:id`.
- Possivel mass assignment em entidades de usuario e curriculo.
- CORS permissivo por padrao.
- Ausencia de rate limiting em login, cadastro e reset de senha.
- Politica de senha fraca.
- Exposicao publica da documentacao Swagger.

## Achados

### 1. Rotas administrativas sem `adminRoutes`

Categoria OWASP:
- A01:2021 - Broken Access Control
- API5:2023 - Broken Function Level Authorization

Severidade: Critica

Arquivos:
- `API/src/routes.js`
- `API/src/app/controllers/UsuarioController.js`
- `API/src/app/controllers/VagaController.js`
- `API/src/app/controllers/CurriculoController.js`

Problema:
Depois de `router.use(privateRoutes)`, qualquer usuario autenticado consegue chamar endpoints administrativos, incluindo:
- `GET /usuarios`
- `POST /usuarios`
- `PUT /usuarios/:id`
- `DELETE /usuarios/:id`
- `GET /curriculos`
- `GET /curriculos/:id`
- `PUT /curriculos/:id`
- `DELETE /curriculos/:id`
- `POST /vagas`
- `PUT /vagas/:id`
- `DELETE /vagas/:id`

Impacto:
Um usuario comum pode listar outros usuarios, alterar dados de terceiros, apagar curriculos, alterar status de candidatos ou gerenciar vagas, se chamar a API diretamente.

Recomendacao:
Aplicar middleware de autorizacao por funcao:
- Rotas administrativas devem usar `adminRoutes`.
- Rotas de usuario devem validar propriedade do recurso.
- Evitar depender apenas dos guards do frontend.

Exemplo de direcao:
```js
router.get('/usuarios', adminRoutes, asyncHandler(usuarios.index));
router.get('/curriculos', adminRoutes, asyncHandler(curriculos.index));
router.post('/vagas', adminRoutes, asyncHandler(vagas.store));
```

### 2. Acesso direto a curriculos de terceiros por ID

Categoria OWASP:
- A01:2021 - Broken Access Control
- API1:2023 - Broken Object Level Authorization

Severidade: Critica

Arquivos:
- `API/src/app/controllers/CurriculoController.js`
- `API/src/routes.js`

Problema:
Os endpoints `GET /curriculos/:id`, `PUT /curriculos/:id` e `DELETE /curriculos/:id` nao validam se o usuario autenticado e admin ou dono do curriculo.

Impacto:
Um usuario autenticado pode tentar IDs de curriculos e acessar, alterar ou excluir dados pessoais de outros candidatos.

Recomendacao:
Antes de retornar, alterar ou excluir um curriculo:
- Buscar o curriculo.
- Permitir se `req.userTipo === 'admin'`.
- Permitir se `curriculo.usuarioId === req.userId`.
- Caso contrario retornar `403`.

### 3. Endpoints de candidatura permitem agir por outro usuario

Categoria OWASP:
- A01:2021 - Broken Access Control
- API1:2023 - Broken Object Level Authorization

Severidade: Alta

Arquivos:
- `API/src/app/controllers/CandidaturaController.js`
- `API/src/app/validators/candidaturaValidator.js`

Problema:
O endpoint `POST /candidaturas` aceita `usuarioId` no body. Um usuario autenticado pode enviar candidatura em nome de outro usuario se souber ou descobrir o ID.

Impacto:
Cria candidaturas falsas, altera historico de outro candidato e compromete a integridade do processo seletivo.

Recomendacao:
Para usuario comum, ignorar `usuarioId` recebido no body e usar sempre `req.userId`. Permitir `usuarioId` arbitrario apenas para admin, se esse caso de uso existir.

### 4. Mass assignment em usuarios

Categoria OWASP:
- API3:2023 - Broken Object Property Level Authorization
- A01:2021 - Broken Access Control

Severidade: Alta

Arquivos:
- `API/src/app/validators/usuarioValidator.js`
- `API/src/app/controllers/UsuarioController.js`

Problema:
`usuarioSchema` e `usuarioUpdateSchema` aceitam campos como `possuiCurriculo`, `dataCheck` e `horaCheck`. Como as rotas de usuario nao estao restritas a admin, um usuario autenticado pode tentar alterar propriedades internas.

Impacto:
Manipulacao indevida de estado interno do usuario e possibilidade de burlar regras de negocio.

Recomendacao:
Separar DTOs por caso de uso:
- Cadastro publico.
- Atualizacao de perfil proprio.
- Atualizacao administrativa.

Campos internos devem ser definidos pelo servidor, nao pelo cliente.

### 5. Mass assignment em curriculos

Categoria OWASP:
- API3:2023 - Broken Object Property Level Authorization

Severidade: Alta

Arquivos:
- `API/src/app/validators/curriculoValidator.js`
- `API/src/app/controllers/CurriculoController.js`

Problema:
`curriculoUpdateSchema` permite atualizar campos como `usuarioId` e `status`. Para usuario comum, `status` deveria ser administrativo, e `usuarioId` nao deveria ser alteravel pelo cliente.

Impacto:
Um usuario pode tentar reatribuir curriculos ou alterar status do proprio processo seletivo se chamar a API diretamente.

Recomendacao:
Criar schemas separados:
- `curriculoUserUpdateSchema`: somente dados pessoais e endereco do proprio usuario.
- `curriculoAdminUpdateSchema`: status e campos administrativos.

### 6. CORS permissivo por padrao

Categoria OWASP:
- A05:2021 - Security Misconfiguration
- API8:2023 - Security Misconfiguration

Severidade: Media

Arquivo:
- `API/src/index.js`

Problema:
Quando `CORS_ORIGIN` nao esta configurado, a API usa `'*'`.

Impacto:
Qualquer origem pode chamar a API pelo navegador. Mesmo com Bearer token, isso aumenta superficie de ataque e dificulta controle de ambientes.

Recomendacao:
Falhar de forma segura em producao se `CORS_ORIGIN` nao estiver configurado. Definir explicitamente os dominios permitidos.

### 7. Swagger publico em ambiente de producao

Categoria OWASP:
- A05:2021 - Security Misconfiguration
- API9:2023 - Improper Inventory Management

Severidade: Media

Arquivo:
- `API/src/index.js`

Problema:
`/api/docs` e `/api/docs.json` ficam expostos sem restricao.

Impacto:
Facilita enumeracao de endpoints, payloads e regras de negocio por atacantes.

Recomendacao:
Proteger Swagger com autenticacao admin, restringir por ambiente ou desabilitar em producao.

### 8. Ausencia de rate limiting em autenticacao

Categoria OWASP:
- A07:2021 - Identification and Authentication Failures
- API4:2023 - Unrestricted Resource Consumption

Severidade: Alta

Arquivos:
- `API/src/routes.js`
- `API/src/app/controllers/AuthController.js`

Problema:
Nao ha limite de tentativas para:
- `POST /login`
- `POST /login/register`
- `POST /login/forgot-password`
- `POST /login/reset-password`

Impacto:
Ataques de brute force, credential stuffing, abuso de envio de emails e consumo excessivo de recursos.

Recomendacao:
Adicionar rate limiting por IP e por identificador de conta. Para login, considerar bloqueio progressivo ou atraso incremental.

### 9. Politica de senha fraca

Categoria OWASP:
- A07:2021 - Identification and Authentication Failures

Severidade: Media

Arquivo:
- `API/src/app/validators/authValidator.js`

Problema:
A senha exige apenas `min(6)`.

Impacto:
Permite senhas curtas e fracas, aumentando risco de comprometimento de contas.

Recomendacao:
Exigir senha com pelo menos 8 a 12 caracteres e bloquear senhas comuns. O ideal e combinar comprimento minimo maior com checagem contra listas de senhas vazadas/comuns.

### 10. JWT com duracao alta e sem mecanismo de revogacao

Categoria OWASP:
- A07:2021 - Identification and Authentication Failures

Severidade: Media

Arquivo:
- `API/src/app/controllers/AuthController.js`

Problema:
O token de login expira em `5d`. Nao ha refresh token, revogacao, controle de sessao ou invalidacao por logout.

Impacto:
Se um token for exposto, permanece valido por varios dias.

Recomendacao:
Reduzir validade do access token, usar refresh token com rotacao, e considerar uma tabela de sessoes/revogacao para logout e troca de senha.

### 11. Upload de PDF depende de MIME e extensao

Categoria OWASP:
- A03:2021 - Injection
- A05:2021 - Security Misconfiguration

Severidade: Media

Arquivo:
- `API/src/app/middlewares/uploadCurriculoPdf.js`

Problema:
O filtro valida `file.mimetype` e extensao `.pdf`, mas nao valida assinatura real do arquivo.

Impacto:
Um arquivo malicioso pode tentar se passar por PDF se o MIME for manipulado. O limite de 10 MB ajuda, mas nao valida o conteudo.

Recomendacao:
Validar magic bytes de PDF, armazenar fora de diretorio publico, servir sempre como download e considerar antivirus/varredura se o ambiente exigir maior seguranca.

### 12. Dados pessoais expostos em listagens amplas

Categoria OWASP:
- A01:2021 - Broken Access Control
- A02:2021 - Cryptographic Failures
- API3:2023 - Broken Object Property Level Authorization

Severidade: Alta

Arquivos:
- `API/src/app/controllers/CurriculoController.js`
- `API/src/app/controllers/UsuarioController.js`
- `API/src/app/DTO/curriculoSearch.js`

Problema:
Listagens retornam dados pessoais de usuarios e curriculos. Isso e aceitavel para admin, mas nao para usuario comum.

Impacto:
Vazamento de CPF, email, telefone, endereco e historico profissional.

Recomendacao:
Restringir listagens a admin e retornar apenas campos necessarios para cada tela. Aplicar principio do menor privilegio tambem nas respostas.

### 13. Falta de logs de seguranca e auditoria

Categoria OWASP:
- A09:2021 - Security Logging and Monitoring Failures

Severidade: Media

Arquivos:
- `API/src/app/middlewares/errorHandler.js`
- Controllers em `API/src/app/controllers`

Problema:
Nao ha registro estruturado de eventos sensiveis, como login falho, alteracao de curriculo, exclusao de curriculo, upload/exclusao de PDF e reset de senha.

Impacto:
Dificulta detectar abuso, investigar incidentes e comprovar acoes administrativas.

Recomendacao:
Adicionar logs de auditoria com usuario, acao, recurso afetado, IP, user-agent e timestamp. Evitar logar senha, token ou dados sensiveis completos.

## Prioridade sugerida de correcao

1. Aplicar `adminRoutes` nas rotas administrativas.
2. Implementar autorizacao por dono do recurso nos endpoints com `:id`.
3. Corrigir candidaturas para usar `req.userId` para usuario comum.
4. Separar schemas de update por perfil de usuario e admin.
5. Configurar rate limiting em login/reset/cadastro.
6. Restringir CORS e Swagger em producao.
7. Melhorar politica de senha e sessao JWT.
8. Reforcar validacao de PDF por assinatura real.
9. Implementar logs de auditoria.

## Observacoes finais

Os guards do frontend ajudam na experiencia do usuario, mas nao sao barreira de seguranca suficiente. Qualquer regra de permissao precisa existir na API, porque um atacante pode chamar os endpoints diretamente.

O risco mais importante hoje e autorizacao. Resolver controle de acesso no backend reduz a maior parte da exposicao apontada pela OWASP A01 e pela OWASP API Security Top 10.
