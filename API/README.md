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

Documentacao Swagger:

```txt
http://localhost:3001/api/docs
http://localhost:3001/api/docs.json
```

## Rotas principais

```txt
POST   /api/login/register
POST   /api/login/register-admin
POST   /api/login

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

GET    /api/curriculos/:id/pdf
POST   /api/curriculos/:id/pdf
GET    /api/curriculos/:id/pdf/:arquivoId/download
DELETE /api/curriculos/:id/pdf/:arquivoId

GET    /api/vagas
POST   /api/vagas
GET    /api/vagas/:id
PUT    /api/vagas/:id
DELETE /api/vagas/:id

GET    /api/candidaturas
POST   /api/candidaturas
DELETE /api/candidaturas/:id
```

## Autenticacao

Crie um usuario local:

```txt
POST /api/login/register
```

```json
{
  "nome": "Usuario",
  "email": "usuario@email.com",
  "password": "123456"
}
```

Faca login:

```txt
POST /api/login
```

```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

Use o token retornado nas rotas protegidas:

```txt
Authorization: Bearer <token>
```

## Criar administrador

Para criar um administrador pelo Swagger, configure uma chave no `.env`:

```txt
ADMIN_CREATE_SECRET=sua-chave-forte
```

Depois acesse o Swagger em `/api/docs`, clique em `Authorize` e informe essa chave no campo `adminSecretAuth`.

Rota:

```txt
POST /api/login/register-admin
```

Tambem e possivel usar um token Bearer de outro usuario admin ja existente.

## Busca de curriculos

```txt
GET /api/curriculos?search=soldador
GET /api/curriculos?search=joao&status=entrevistado
GET /api/curriculos?cidade=Americana&atuacao=soldador
GET /api/curriculos?cursoAtivo=true
```

A busca olha dados do curriculo e relações: usuário, endereço, atuações, cursos, experiências e escolaridade.

## Upload de PDF do currículo

As rotas são protegidas por JWT. Envie o arquivo em `multipart/form-data` no campo `arquivo`.

```txt
POST /api/curriculos/:id/pdf
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Regras:

```txt
Campo: arquivo
Tipo: application/pdf
Extensão: .pdf
Limite: 10MB
```
