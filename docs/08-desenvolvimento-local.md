# Desenvolvimento local

## Requisitos

- Node.js compativel com as dependencias do projeto.
- npm.
- Docker para PostgreSQL local, se usar `API/docker-compose.yml`.
- Banco PostgreSQL acessivel via `DATABASE_URL`.

## Backend

```bash
cd API
npm install
docker compose up -d
npm run prisma:deploy
npm run prisma:generate
npm run seed
npm run dev
```

API local:

```txt
http://localhost:3001/api
```

Healthcheck:

```txt
GET http://localhost:3001/api/health
```

Swagger:

```txt
http://localhost:3001/api/docs
http://localhost:3001/api/docs.json
```

## Frontend

```bash
cd web/curriculos_project
npm install
npm run dev
```

Frontend local comum:

```txt
http://localhost:5173
```

Se a porta estiver ocupada, o Vite pode abrir em `5174`.

## Variaveis de ambiente da API

```txt
DATABASE_URL=
JWT_SECRET=
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
ADMIN_CREATE_SECRET=
PASSWORD_RESET_SECRET=
PASSWORD_SETUP_SECRET=
PASSWORD_RESET_EXPIRES_IN=1h
PASSWORD_SETUP_EXPIRES_IN=15m
ENABLE_API_DOCS=true
API_PUBLIC_URL=http://localhost:3001/api
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

## Variaveis de ambiente do frontend

```txt
VITE_API_URL=http://localhost:3001/api
```

Se `VITE_API_URL` nao for definida, o fallback atual do frontend aponta para `http://127.0.0.1:3000/api`. Ajuste isso conforme o ambiente.

## Usuario seed

```txt
email: suporteti@vulcano.com
senha: Conquistas@07
perfil: superAdmin
```

Use apenas em ambiente controlado. Em producao, troque a senha no primeiro acesso.
