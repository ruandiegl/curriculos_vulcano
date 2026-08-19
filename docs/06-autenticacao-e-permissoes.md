# Autenticacao e permissoes

## Autenticacao

A API usa JWT em cookie de sessão `HttpOnly`, `Secure` em produção e `SameSite`
configurável (padrão `Lax`). O frontend envia o cookie com Axios usando
`withCredentials: true` e não salva o JWT em `localStorage` ou `sessionStorage`.

O backend ainda aceita `Authorization: Bearer <token>` temporariamente para
compatibilidade operacional com clientes antigos, mas o frontend novo não cria,
persiste ou envia esse header.

## Perfis

```txt
usuario
admin
superAdmin
```

## Permissoes

- `usuario`: acessa area do candidato, curriculo proprio, vagas e candidaturas.
- `admin`: acessa dashboard, curriculos, vagas e relatorios.
- `superAdmin`: possui permissoes de admin e gerencia usuarios.

## Middlewares

Arquivo: `API/src/app/middlewares/Auth.js`.

- `privateRoutes`: exige token valido.
- `adminRoutes`: exige `admin` ou `superAdmin`.
- `superAdminRoutes`: exige `superAdmin`.
- `adminCreationRoutes`: permite criar admin via secret ou token admin.

## Rotas publicas

- `POST /api/login`
- `GET /api/login/session`
- `POST /api/login/logout`
- `POST /api/login/register`
- `POST /api/login/forgot-password`
- `POST /api/login/reset-password`
- `POST /api/login/recovery-match`
- `POST /api/login/setup-password`

## Rotas de usuario

Rotas de usuario em `/api/usuarios` sao exclusivas para super admin.

## Criacao de admin

`POST /api/login/register-admin` aceita:

- `x-admin-secret` igual a `ADMIN_CREATE_SECRET`; ou
- token Bearer de usuario admin/superAdmin.

## Reset e setup de senha

- Usuário ativado recebe `/reset-password#token=...`.
- Usuário legado sem `passHash` recebe `/activate-account#token=...`.
- Query string antiga continua aceita durante a transição, mas o frontend remove
  o token da URL assim que o captura.
- O token é salvo apenas como hash no banco, expira e é de uso único.
- As rotas sensíveis usam `Cache-Control: no-store` e `Referrer-Policy: no-referrer`.

## Rate limit

- Login/cadastro: 20 tentativas por 15 minutos.
- Recuperação/reset/ativação: 5 tentativas por 15 minutos.
- Recuperação de senha: cooldown adicional de uma solicitação por minuto.
- As chaves combinam IP, email normalizado e IP + email, armazenadas de forma
  hashada no processo.
- Ao bloquear, a API retorna `429` e `Retry-After`.
- O armazenamento atual é em memória por processo; Redis compartilhado deve ser
  adotado antes de escalar para múltiplas réplicas/workers.

## Proteção CSRF e CORS

- Operações mutáveis que usam o cookie de sessão exigem `Origin` permitido.
- CORS aceita somente origins configuradas e credenciais explícitas.
- Não usar `Access-Control-Allow-Origin: *` com sessão por cookie.

## Guidelines

- Nunca exponha o JWT em logs, HTML, URL persistente ou storage do navegador.
- Nunca armazene senha em texto puro.
- Use bcrypt para hash de senha.
- Ao criar nova rota, defina explicitamente se e publica, privada, admin ou super admin.
