# Autenticacao e permissoes

## Autenticacao

A API usa JWT Bearer. O frontend salva o token em `localStorage` usando `TOKEN_STORAGE_KEY` de `src/services/api.ts`.

Formato:

```txt
Authorization: Bearer <token>
```

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

- Reset usa `PASSWORD_RESET_SECRET` ou cai para `JWT_SECRET`.
- Setup usa `PASSWORD_SETUP_SECRET` ou cai para o segredo de reset.
- Expiracoes padrao: `PASSWORD_RESET_EXPIRES_IN=1h` e `PASSWORD_SETUP_EXPIRES_IN=15m`.

## Guidelines

- Nunca exponha o JWT em logs.
- Nunca armazene senha em texto puro.
- Use bcrypt para hash de senha.
- Ao criar nova rota, defina explicitamente se e publica, privada, admin ou super admin.
