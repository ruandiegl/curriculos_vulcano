# API Curriculos Vulcano

API em Node.js, Express, PostgreSQL e Prisma ORM.

## Rodar local

```bash
npm install
docker compose up -d
npm run prisma:deploy
npm run prisma:generate
npm run dev
```

A API sobe em:

```txt
http://localhost:3001/api
```

Healthcheck:

```txt
GET /api/health
```

## Rotas principais

```txt
GET    /api/usuarios
POST   /api/usuarios
GET    /api/usuarios/:id
PUT    /api/usuarios/:id
DELETE /api/usuarios/:id

GET    /api/curriculos
POST   /api/curriculos
GET    /api/curriculos/:id
PUT    /api/curriculos/:id
DELETE /api/curriculos/:id

GET    /api/vagas
POST   /api/vagas
GET    /api/vagas/:id
PUT    /api/vagas/:id
DELETE /api/vagas/:id

GET    /api/candidaturas
POST   /api/candidaturas
DELETE /api/candidaturas/:id
```

## Busca de curriculos

```txt
GET /api/curriculos?search=soldador
GET /api/curriculos?search=joao&status=entrevistado
GET /api/curriculos?cidade=Americana&atuacao=soldador
GET /api/curriculos?cursoAtivo=true
```

A busca olha dados do curriculo e relações: usuário, endereço, atuações, cursos, experiências e escolaridade.
