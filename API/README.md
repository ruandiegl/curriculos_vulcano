# API Curriculos Vulcano

API em Node.js, Express, PostgreSQL e Prisma ORM.

## Rodar local

```bash
npm install
npm run db:up
npm run prisma:deploy
npm run prisma:generate
npm run dev
```

Para testar localmente o envio de recuperação sem SMTP, use
`EMAIL_PROVIDER=mock` e `MAIL_DELIVERY_MODE=memory`. O link não é escrito nos
logs; ele fica disponível somente no endpoint local
`GET /api/login/dev/mailbox/latest` enquanto o modo simulado estiver ativo.

Em homologação ou produção, configure o Resend somente na API:

```txt
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Metalurgica Vulcano <nao-responda@dominio-verificado.tld>
PUBLIC_WEB_URL=https://seu-frontend.tld
```

`RESEND_API_KEY` nunca deve ser enviado ao frontend, ao repositório ou ao FTP.
O domínio usado em `RESEND_FROM_EMAIL` precisa estar verificado no workspace do
Resend. O modo `smtp` continua disponível como rollback manual temporário.

### Homologação no Railway

No serviço da API no Railway, configure `NODE_ENV=production`,
`EMAIL_PROVIDER=resend`, `RESEND_API_KEY` como variável secreta e
`RESEND_FROM_EMAIL` com um remetente do domínio verificado. O backend usa
`PUBLIC_WEB_URL` quando informado; se ele não existir, usa automaticamente
`https://${RAILWAY_PUBLIC_DOMAIN}` para montar os links enviados por e-mail.

Mantenha `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` e `FRONTEND_URL` nas
variáveis do serviço. O Railway fornece `RAILWAY_PUBLIC_DOMAIN` e injeta o
`PORT` automaticamente; o comando de inicialização é `npm start` quando o
diretório de trabalho do serviço é `API`.

O comando `db:up` aguarda o PostgreSQL ficar saudavel antes de retornar. Para
acompanhar os logs ou parar o banco local:

```bash
npm run db:logs
npm run db:down
```

A API sobe em:

```txt
http://localhost:3101/api
```

Healthcheck:

```txt
GET http://localhost:3101/api/health
```

Documentacao Swagger:

```txt
http://localhost:3101/api/docs
http://localhost:3101/api/docs.json
```

## Rotas principais

```txt
POST   /api/login/register
POST   /api/login/register-admin
POST   /api/login
POST   /api/login/activate-account
POST   /api/login/forgot-password
POST   /api/login/reset-password

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

Contas legadas sem `pass_hash` recebem um link de ativação por e-mail e criam a
primeira senha em `POST /api/login/activate-account`. O token é aleatório,
expira e só pode ser usado uma vez. A rota antiga de confirmação por CPF só
funciona se `ENABLE_LEGACY_CPF_RECOVERY=true` for explicitamente habilitado em
ambiente de transição.

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
