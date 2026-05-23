# Reset de senha por email

Esta documentacao explica a ultima atualizacao feita no fluxo de recuperacao de senha. A ideia principal foi tirar o usuario da tela padrao do Firebase e centralizar o processo no proprio projeto, usando telas do frontend e endpoints da API.

## Objetivo

Antes, o email de recuperacao levava o usuario para um link parecido com:

```txt
https://vulcano-31f2f.firebaseapp.com/__/auth/action?mode=resetPassword&...
```

Agora o fluxo esperado e:

```txt
Usuario informa email -> API gera token -> API envia link do nosso site -> Usuario cria nova senha -> API troca a senha
```

O usuario passa a usar uma tela do proprio sistema:

```txt
/forgot-password
/reset-password?token=<token>
```

## Fluxo completo

1. O usuario clica em "Esqueci minha senha" na tela de login.
2. O frontend navega para `/forgot-password`.
3. O usuario informa o email.
4. O frontend envia `POST /api/login/forgot-password`.
5. A API procura o usuario pelo email.
6. Se o usuario existir, a API gera um token JWT temporario para reset de senha.
7. A API monta um link para o frontend:

```txt
<FRONTEND_URL>/reset-password?token=<token>
```

8. A API envia esse link por email.
9. O usuario abre o link e acessa `/reset-password`.
10. O usuario informa a nova senha e confirma.
11. O frontend envia `POST /api/login/reset-password`.
12. A API valida o token, troca o hash da senha no banco e invalida o token na pratica.

## Frontend

Arquivos criados:

```txt
web/curriculos_project/src/pages/ForgotPassword/index.tsx
web/curriculos_project/src/pages/ForgotPassword/styles.ts
web/curriculos_project/src/pages/ResetPassword/index.tsx
web/curriculos_project/src/pages/ResetPassword/styles.ts
```

Arquivos alterados:

```txt
web/curriculos_project/src/pages/Login/index.tsx
web/curriculos_project/src/routes/routes.tsx
```

### Tela `/forgot-password`

Responsavel por solicitar o email do usuario.

Endpoint chamado:

```txt
POST /api/login/forgot-password
```

Payload:

```json
{
  "email": "usuario@email.com"
}
```

Resposta esperada:

```json
{
  "message": "Se o email existir, enviaremos instrucoes para redefinir a senha."
}
```

Essa mensagem e propositalmente generica. Assim, alguem de fora nao consegue descobrir se um email existe ou nao no sistema.

### Tela `/reset-password`

Responsavel por receber o token da URL e enviar a nova senha para a API.

Exemplo de URL:

```txt
http://localhost:5173/reset-password?token=eyJhbGciOi...
```

Endpoint chamado:

```txt
POST /api/login/reset-password
```

Payload:

```json
{
  "token": "token-recebido-na-url",
  "password": "123456"
}
```

Regras atuais do frontend:

```txt
Senha obrigatoria
Confirmacao obrigatoria
Senha minima de 6 caracteres
Senha e confirmacao precisam ser iguais
```

Nao foi adicionada regra de senha forte, conforme solicitado.

### Rotas adicionadas

No arquivo:

```txt
web/curriculos_project/src/routes/routes.tsx
```

Foram adicionadas:

```tsx
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
```

Essas rotas sao publicas, porque o usuario que esqueceu a senha ainda nao esta autenticado.

## Backend

Arquivos criados:

```txt
API/src/app/services/mailService.js
```

Arquivos alterados:

```txt
API/src/app/controllers/AuthController.js
API/src/app/validators/authValidator.js
API/src/app/Repositories/UsuarioRepository.js
API/src/routes.js
API/package.json
API/package-lock.json
API/.env.example
```

### Endpoints adicionados

No arquivo:

```txt
API/src/routes.js
```

Foram adicionados:

```txt
POST /api/login/forgot-password
POST /api/login/reset-password
```

Eles ficam antes de `router.use(privateRoutes)`, porque precisam funcionar sem login.

## Como o token funciona

A API gera um token JWT especifico para reset de senha.

Esse token carrega:

```txt
sub: id do usuario
email: email do usuario
purpose: password-reset
passHash: hash atual da senha
```

O campo `purpose` garante que o token e de recuperacao de senha, nao de login.

O campo `passHash` faz o token ser invalidado depois do uso. Quando a senha e trocada, o hash salvo no banco muda. Se alguem tentar usar o mesmo link de novo, o `passHash` do token nao bate mais com o `passHash` atual do usuario.

Assim, o token fica:

```txt
Temporario pela expiracao do JWT
De uso unico na pratica pela troca do hash da senha
```

## Envio de email

O envio fica em:

```txt
API/src/app/services/mailService.js
```

A dependencia usada foi:

```txt
nodemailer
```

Se `SMTP_HOST` estiver configurado, a API envia email de verdade.

Se `SMTP_HOST` nao estiver configurado, a API nao quebra o fluxo local. Ela imprime o link no console:

```txt
[password-reset] Link para usuario@email.com: http://localhost:5173/reset-password?token=...
```

Isso ajuda a testar sem precisar configurar SMTP imediatamente.

## Variaveis de ambiente

Foram adicionadas ao arquivo:

```txt
API/.env.example
```

Variaveis:

```txt
FRONTEND_URL="http://localhost:5173"
PASSWORD_RESET_SECRET="troque-este-segredo-de-recuperacao"
PASSWORD_RESET_EXPIRES_IN="1h"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_SECURE="false"
MAIL_FROM="Metalurgica Vulcano <no-reply@vulcano.com>"
```

### FRONTEND_URL

Define qual endereco sera usado no link enviado por email.

Em desenvolvimento:

```txt
FRONTEND_URL="http://localhost:5173"
```

Em producao, deve apontar para o dominio real do sistema:

```txt
FRONTEND_URL="https://seudominio.com"
```

### PASSWORD_RESET_SECRET

Segredo usado para assinar os tokens de reset.

Recomendacao:

```txt
Use um valor diferente do JWT_SECRET
Use um valor longo e dificil de adivinhar
Nao publique esse valor no Git
```

### PASSWORD_RESET_EXPIRES_IN

Tempo de validade do token.

Valor atual sugerido:

```txt
1h
```

Exemplos aceitos pelo JWT:

```txt
15m
30m
1h
2h
```

### SMTP

Para envio real de email, configurar:

```txt
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_SECURE
MAIL_FROM
```

Exemplo generico:

```txt
SMTP_HOST="smtp.exemplo.com"
SMTP_PORT="587"
SMTP_USER="usuario-smtp"
SMTP_PASS="senha-smtp"
SMTP_SECURE="false"
MAIL_FROM="Metalurgica Vulcano <no-reply@seudominio.com>"
```

## Como testar localmente sem SMTP

1. Inicie a API.
2. Inicie o frontend.
3. Acesse a tela de login.
4. Clique em "Esqueci minha senha".
5. Digite o email de um usuario cadastrado.
6. Veja o console da API.
7. Copie o link impresso no console.
8. Abra o link no navegador.
9. Digite e confirme a nova senha.
10. Volte ao login e entre com a nova senha.

## Como testar localmente com SMTP

1. Configure as variaveis SMTP no `.env` da API.
2. Configure `FRONTEND_URL`.
3. Inicie a API.
4. Inicie o frontend.
5. Solicite a recuperacao de senha pela tela `/forgot-password`.
6. Abra o email recebido.
7. Clique em "Criar nova senha".
8. Redefina a senha.
9. Faca login com a senha nova.

## Pontos de seguranca implementados

```txt
Mensagem generica para nao revelar se email existe
Token com expiracao
Token com finalidade especifica: password-reset
Token invalidado apos trocar a senha
Senha salva como hash bcrypt
Rotas de reset sem necessidade de login
Rotas protegidas continuam atras de JWT normal
```

## Pontos que ainda dependem de configuracao

```txt
Criar o arquivo API/.env real, se ainda nao existir
Configurar FRONTEND_URL de producao
Configurar SMTP para envio real
Definir PASSWORD_RESET_SECRET seguro em producao
Reiniciar a API depois de alterar variaveis de ambiente
```

## Resumo tecnico

Frontend:

```txt
/forgot-password chama POST /api/login/forgot-password
/reset-password chama POST /api/login/reset-password
```

Backend:

```txt
forgotPassword gera link temporario e envia email
resetPassword valida token e atualiza passHash
mailService envia email via SMTP ou loga o link em desenvolvimento
```
