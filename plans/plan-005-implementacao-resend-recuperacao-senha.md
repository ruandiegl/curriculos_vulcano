# Plano 005 — Implementação do Resend na recuperação de acesso

## Objetivo

Substituir o envio de recuperação de senha baseado em SMTP/Nodemailer pelo Resend,
mantendo o fluxo da aplicação Currículos Vulcano e preservando as correções já
implementadas para usuários legados sem senha.

O plano cobre a API na VPS, o banco PostgreSQL/Prisma, o frontend React/Vite
publicado na Locaweb via FTP, o DNS do remetente e os testes de homologação.

Este documento é planejamento. Não cria domínio no Resend, não altera DNS, não
grava API keys, não envia e-mails reais e não altera produção.

## Adaptação da referência recebida

\`docs/recuperacao-senha-resend-web-api.md\` é útil como referência de segurança,
mas pertence a outra aplicação. Ela pressupõe TypeScript, rotas \`/api/auth\`,
Vercel, Expo, clientes gerados e refresh tokens.

Na aplicação atual, a adaptação correta é:

- Node.js ES Modules, Express 5, Prisma, PostgreSQL, Zod e JWT;
- rotas atuais \`/api/login/forgot-password\`, \`/api/login/reset-password\`,
  \`/api/login/activate-account\` e compatibilidade \`/api/login/setup-password\`;
- API executada na VPS por PM2;
- frontend em React/Vite, gerado em \`dist/\` e enviado para \`public_html\` por FTP;
- nenhum aplicativo mobile neste repositório;
- nenhum refresh-token store. A troca de senha invalida o token de recuperação,
  mas não revoga individualmente JWTs de login já emitidos. Isso fica separado
  para um plano futuro de sessão/autenticação.

O domínio \`resend.grupogtf.com.br\` da referência não deve ser copiado sem
comprovar que pertence à operação Currículos Vulcano.

## Referências utilizadas

### Documentação do projeto

- \`docs/README.md\` — stack e organização.
- \`docs/01-visao-geral.md\` — perfis candidato, admin e superAdmin.
- \`docs/02-arquitetura.md\` — fluxo React → Axios → Express → Prisma.
- \`docs/03-frontend-guidelines.md\` — páginas, services, formulários e build.
- \`docs/04-api-guidelines.md\` — rotas públicas, controllers, Zod, erros e Swagger.
- \`docs/05-banco-de-dados.md\` — migrations incrementais e integridade dos dados.
- \`docs/06-autenticacao-e-permissoes.md\` — JWT, rotas públicas e permissões.
- \`docs/07-ui-ux-responsivo.md\` — responsividade e acessibilidade existentes.
- \`docs/08-desenvolvimento-local.md\` — Docker, portas e variáveis locais.
- \`docs/09-qualidade-seguranca-deploy.md\` — checks, CORS, logs e deploy.
- \`docs/deploy-locaweb-front-api-local.md\` — build e envio do frontend por FTP.
- \`docs/reset-de-senha.md\` — histórico do fluxo atual, atualizado após a execução.
- \`docs/seguranca-global-projetos-ia (1).md\` — segredos, rate limit, logs, headers,
  disponibilidade e proteção de dados.
- \`docs/vulnerabilidades-owasp.md\` — auditoria anterior, sempre confrontada com
  o código efetivo.
- \`docs/prd-status-nao-visualizado.md\` e \`docs/prd-mobile-responsivo.md\` —
  consultados para preservar os escopos de currículo e responsividade; não serão
  alterados por esta integração.

### Resend via Context7 e fontes oficiais

O Context7 confirmou: \`POST https://api.resend.com/emails\`, header
\`Authorization: Bearer\`, \`Content-Type: application/json\`, campos \`from\`,
\`to\`, \`subject\`, \`html\`, resposta com \`id\`, \`Idempotency-Key\` de 1 a
256 caracteres mantida por 24 horas, domínio remetente verificado e correspondência
exata entre o domínio do \`from\` e o domínio verificado.

Fontes:

- [Send Email](https://resend.com/docs/api-reference/emails/send-email)
- [Idempotency Keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Sender e domínio verificado](https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender-in-resend)
- [Erro de domínio divergente](https://resend.com/docs/knowledge-base/403-error-domain-mismatch)
- [Erros da API](https://resend.com/docs/api-reference/errors)

## Agentes selecionados

Agente principal: **Backend API Engineer**.

Agentes de apoio:

- **Security Engineer** — segredo, tokens, anti-enumeração, logs e retries.
- **Database Engineer** — migration e status dos tokens de e-mail.
- **DevOps Engineer** — DNS, API key na VPS, PM2, healthcheck e rollback.
- **Frontend Engineer** — telas, estados, URL pública e build para FTP.
- **QA Engineer** — testes unitários, integração, rate limit e regressão.
- **Technical Writer** — atualização dos guias de reset, local e deploy.
- **Tech Lead** — gates, impacto e decisão de rollback.

## Estado atual confirmado

### API

- \`API/src/app/services/mailService.js\` já abstrai o envio, hoje com SMTP e
  modo \`memory\` somente fora de produção.
- \`AuthController\` diferencia reset de usuário ativado e ativação de usuário com
  \`passHash\` nulo.
- \`passwordTokenService.js\` gera token aleatório de 32 bytes, persiste somente
  SHA-256, invalida tokens anteriores e consome em transação.
- A tabela \`PasswordToken\` foi criada pela migration
  \`20260818130000_add_password_tokens\`.
- As rotas de recuperação são públicas e ficam antes de \`privateRoutes\`.
- O rate limit de autenticação e recuperação já usa buckets separados.
- Não há refresh-token store nem revogação individual de JWTs de login.

### Frontend e operação

- \`ForgotPassword\` solicita somente e-mail e mantém resposta genérica.
- \`ResetPassword\` atende usuários com senha existente.
- \`ActivateAccount\` atende contas legadas sem senha.
- \`VITE_API_URL\` aponta para a API; Resend nunca deve ser chamado pelo navegador.
- A API roda na VPS; o frontend é construído e enviado por FTP para a Locaweb.

## Escopo

### Incluído

- Adapter server-side para Resend.
- Reset de senha e ativação legada enviados pelo Resend.
- Configuração segura por ambiente.
- Idempotência, timeout, tratamento de erros e logs sem PII.
- Domínio próprio verificado e remetente consistente.
- Migration para status de entrega do token.
- Testes com Resend mockado e homologação com envio real controlado.
- Atualização do frontend, Swagger, README e documentação operacional.

### Não incluído

- Clerk/Auth0/Supabase Auth, 2FA, CAPTCHA, refresh tokens e cookies \`httpOnly\`.
- Aplicativo mobile, Expo, deep links ou header \`X-Client-Platform\`.
- Vercel, Neon e rotas \`/api/auth/*\` da referência externa.
- Alterações em currículos, vagas, candidaturas ou status \`nao_visualizado\`.
- Limpeza do histórico Git, rotação geral de secrets, WAF e hardening completo da
  VPS, que permanecem no plano 004.

## Fluxo alvo

~~~text
Frontend
  -> POST /api/login/forgot-password
  -> normalização + rate limit
  -> PasswordToken com hash, propósito e expiração
  -> URL PUBLIC_WEB_URL/reset-password ou /activate-account
  -> POST https://api.resend.com/emails
  -> Idempotency-Key baseada no ID interno do token
  -> status/message ID operacional
  -> usuário abre o link
  -> reset/activation consome o token em transação
  -> nova senha e login
~~~

A resposta pública continua genérica para conta existente, inexistente, legada e
falha de envio. Falha do Resend deve gerar alerta operacional, não enumeração.

## Configuração proposta

Adicionar ao \`API/.env.example\`:

~~~env
EMAIL_PROVIDER=mock
RESEND_API_BASE_URL=https://api.resend.com
RESEND_FROM_EMAIL="Metalurgica Vulcano <nao-responda@mail.curriculosvulcano.com.br>"
PUBLIC_WEB_URL=http://localhost:5181
EMAIL_REQUEST_TIMEOUT_MS=5000
PASSWORD_RESET_TOKEN_EXPIRES_MINUTES=30
PASSWORD_ACTIVATION_TOKEN_EXPIRES_MINUTES=15
RESEND_API_KEY=
~~~

Regras:

- \`EMAIL_PROVIDER=mock\` em local/homologação sem envio real.
- \`EMAIL_PROVIDER=resend\` somente com domínio verificado e API key configurada.
- \`EMAIL_PROVIDER=smtp\` pode permanecer como rollback manual temporário, sem
  fallback automático entre providers.
- \`RESEND_API_KEY\` nunca fica em \`.env.example\` com valor, frontend, FTP, Swagger,
  README, plano, print, log ou histórico Git.
- Em produção, \`PUBLIC_WEB_URL\` é HTTPS e aponta para o domínio público do front.
- \`FRONTEND_URL\` continua disponível para CORS; links de e-mail usam
  \`PUBLIC_WEB_URL\` para evitar localhost/IP privado.
- O endereço exato do remetente deve ser aprovado antes da implementação. A
  proposta é verificar \`mail.curriculosvulcano.com.br\` e usar
  \`nao-responda@mail.curriculosvulcano.com.br\`.

## DNS e Resend

1. Confirmar titularidade do domínio/DNS da Vulcano.
2. Adicionar o subdomínio no mesmo workspace Resend que criará a API key.
3. Publicar exatamente os registros SPF/DKIM fornecidos pelo painel Resend.
4. Confirmar status \`Verified\`.
5. Conferir o alinhamento do domínio do \`from\` com o domínio verificado.
6. Criar/revisar DMARC no domínio pai, inicialmente em observação.
7. Registrar responsável, limite e custo do envio.

Não copiar registros genéricos de outro domínio. Os valores apresentados pelo
Resend para o domínio escolhido são a fonte de verdade.

## Implementação do adapter

Modificar \`API/src/app/services/mailService.js\` ou extrair
\`API/src/app/services/resendEmailProvider.js\` com uma interface única:

~~~js
sendPasswordActionEmail({
  to,
  nome,
  actionUrl,
  actionLabel,
  subject,
  purpose,
  tokenId,
  requestId,
})
~~~

Chamada HTTP server-side:

~~~http
POST https://api.resend.com/emails
Authorization: Bearer <RESEND_API_KEY>
Content-Type: application/json
Idempotency-Key: curriculos/<purpose>/<tokenId>
~~~

Payload:

~~~json
{
  "from": "Metalurgica Vulcano <nao-responda@mail.curriculosvulcano.com.br>",
  "to": ["destinatario-normalizado"],
  "subject": "Atualizacao de acesso",
  "html": "<conteudo-escapado>",
  "text": "conteudo em texto puro"
}
~~~

Decisão inicial: usar \`fetch\` nativo do Node server-side para evitar adicionar
SDK ao frontend e reduzir dependências. Se o SDK oficial for preferido, ele deve
ficar exclusivamente em \`API\` e ser aprovado pelo Tech Lead.

Regras do adapter:

- \`AbortController\` e timeout configurável;
- HTML escapado e texto puro;
- nenhuma gravação de Authorization, corpo completo, token, URL ou e-mail em log;
- resposta de sucesso exige \`id\`;
- \`400\`, \`401\`, \`403\`, \`409\`, \`429\`, \`5xx\` e timeout viram erros internos;
- \`429\` respeita observabilidade e \`Retry-After\`, sem retry agressivo;
- retry seguro usa a mesma \`Idempotency-Key\`;
- não chamar SMTP automaticamente após falha do Resend.

## Banco e estados de entrega

Criar migration incremental sobre \`PasswordToken\` para adicionar:

- \`revokedAt DateTime?\`;
- \`deliveryStatus String\` com \`pending\`, \`sent\`, \`failed\` e \`mocked\`;
- \`providerMessageId String?\`;
- \`idempotencyKey String? @unique\`.

O token público nunca é salvo. O ID interno é usado somente para idempotência.

Estados:

~~~text
pending -> sent       Resend retornou id
pending -> mocked     provider mock local
pending -> failed     falha definitiva/timeout; revokedAt preenchido
sent    -> used       senha alterada
sent    -> expired    expiração natural
~~~

Em falha definitiva, revogar o token e retornar a mesma mensagem pública genérica.
Se houver retry, reutilizar o token pendente e a mesma chave idempotente antes de
criar uma nova solicitação.

## Fases de execução

### Fase 0 — Gate de domínio e credenciais

- confirmar workspace Resend e domínio da Vulcano;
- publicar SPF/DKIM e validar \`Verified\`;
- definir remetente e \`PUBLIC_WEB_URL\`;
- criar key de homologação separada da produção;
- armazenar a key somente na VPS/homologação;
- não usar \`resend.dev\` para envio real a usuários.

**Gate:** domínio verificado e destinatário interno autorizado.

### Fase 1 — Configuração e adapter mockado

- validar schema de ambiente;
- falhar rápido em produção sem key, provider, remetente ou URL HTTPS;
- implementar provider \`mock\` sem escrever link em logs;
- implementar provider \`resend\` com \`fetch\`, timeout, HTML/texto e idempotência;
- adicionar \`requestId\` à resposta e logs estruturados;
- normalizar erro sem expor detalhe do Resend.

**Gate:** testes do adapter passam sem chamada real ao Resend.

### Fase 2 — Token, migration e controller

- fazer \`issuePasswordToken\` retornar ID interno e token público apenas em memória;
- adicionar status de entrega, revogação e message ID;
- manter invalidação do token anterior;
- manter consumo e alteração de senha na mesma transação;
- adaptar \`forgotPassword\` para marcar falha de entrega sem enumerar conta;
- preservar reset normal e ativação legada;
- atualizar Swagger e validators somente se o contrato mudar.

**Gate:** tokens usados, expirados, revogados, adulterados e de propósito errado
falham; nenhum token puro existe no banco.

### Fase 3 — Frontend

Revisar:

- \`ForgotPassword/index.tsx\`;
- \`ResetPassword/index.tsx\`;
- \`ActivateAccount/index.tsx\`;
- \`Login/index.tsx\`;
- \`services/api.ts\`;
- \`.htaccess\`, se headers/referrer forem ajustados.

Validar loading, duplo clique, \`429\`, rede indisponível, mensagem genérica,
senha inválida, confirmação divergente e retorno ao login. Após sucesso, usar
navegação \`replace\` quando possível para não manter token no histórico.

**Gate:** \`npm run lint\`, \`npm run build\` e busca no \`dist\` sem API key.

### Fase 4 — Testes automatizados

#### Adapter Resend

- payload \`from\`, \`to\`, assunto, HTML escapado e texto puro;
- Authorization somente server-side;
- idempotência baseada no purpose + UUID interno;
- sucesso exige message ID;
- erros \`400/401/403/409/429/5xx\` e timeout;
- falha revoga token sem expor detalhes.

#### API

- conta existente/inexistente com resposta genérica;
- reset de ativado e ativação de legado;
- novo pedido invalida o anterior;
- token usado, expirado, revogado, adulterado e finalidade errada;
- rate limit e \`Retry-After\`;
- logs sem API key, token, URL, senha, hash ou e-mail completo.

#### Frontend

- e-mail inválido, loading, sucesso e erro;
- token ausente/usado/expirado;
- telas de reset e ativação;
- desktop e viewport mobile;
- build sem chamada para \`api.resend.com\`.

### Fase 5 — Homologação real

1. Configurar key de homologação distinta.
2. Habilitar \`EMAIL_PROVIDER=resend\` somente na API de homologação.
3. Enviar para destinatário interno controlado.
4. Testar usuário ativado e usuário legado.
5. Conferir remetente, link, texto puro e validade.
6. Conferir message ID no dashboard Resend.
7. Repetir request com mesma idempotência e confirmar ausência de duplicidade.
8. Testar key inválida/domínio divergente e resposta pública genérica.
9. Verificar logs PM2 sem segredo, token, URL ou PII sensível.

**Gate:** os dois fluxos reais aprovados antes de produção.

### Fase 6 — Deploy na VPS e FTP

#### API na VPS

- backup de banco, uploads, código e configuração;
- release nova sem sobrescrever a atual;
- \`npm install\`, \`npm run prisma:generate\` e \`npm run prisma:deploy\`;
- \`.env\` compartilhado fora do Git, com permissão mínima;
- \`RESEND_API_KEY\` somente na VPS;
- \`EMAIL_PROVIDER=resend\`, \`PUBLIC_WEB_URL\` HTTPS e \`RESEND_FROM_EMAIL\` válidos;
- restart PM2 após migration/configuração;
- healthcheck em \`https://api.curriculosvulcano.com.br/api/health\`;
- smoke test com usuário autorizado e monitoramento de \`401/403/429/500\`.

#### Frontend na Locaweb

- \`VITE_API_URL\` apontando para API HTTPS pública;
- \`npm run lint\` e \`npm run build\`;
- \`dist\` sem key, localhost ou IP privado;
- backup do \`public_html\` atual;
- enviar o conteúdo de \`dist/\` para \`public_html/\` via FTP;
- nunca enviar \`.env\`, API, dumps ou API key.

### Fase 7 — Rollback

- voltar PM2 para a release anterior se a API falhar;
- não executar \`migrate reset\` em produção;
- se apenas Resend falhar, trocar manualmente para SMTP validado ou pausar envio;
- não alternar providers automaticamente;
- tokens criados em falha devem estar revogados;
- restaurar build anterior por FTP se necessário;
- registrar release, migration, horário e motivo.

## Arquivos previstos

### Backend

- \`API/src/app/services/mailService.js\`;
- novo \`API/src/app/services/resendEmailProvider.js\`, se necessário;
- \`API/src/app/services/passwordTokenService.js\`;
- \`API/src/app/controllers/AuthController.js\`;
- \`API/src/routes.js\`;
- \`API/src/index.js\`;
- novo middleware de request ID, se aprovado;
- \`API/src/swagger.js\`;
- \`API/prisma/schema.prisma\` e nova migration;
- \`API/.env.example\` e \`API/README.md\`.

### Frontend e documentação

- telas e service de recuperação;
- \`web/curriculos_project/public/.htaccess\`, se necessário;
- \`docs/reset-de-senha.md\`;
- \`docs/08-desenvolvimento-local.md\`;
- \`docs/09-qualidade-seguranca-deploy.md\`;
- \`docs/deploy-locaweb-front-api-local.md\`;
- \`docs/06-autenticacao-e-permissoes.md\`.

## Critérios de aceite

- [ ] Domínio remetente da Vulcano está \`Verified\` no workspace Resend correto.
- [ ] \`RESEND_API_KEY\` existe somente server-side.
- [ ] Produção falha sem configuração válida do Resend.
- [ ] \`from\` coincide exatamente com domínio verificado.
- [ ] Usuário ativado recebe \`/reset-password\`.
- [ ] Usuário legado sem senha recebe \`/activate-account\`.
- [ ] Conta inexistente não é revelada.
- [ ] Token é somente hash, expira, é de uso único e invalida o anterior.
- [ ] Falha do Resend revoga o token e não revela detalhes.
- [ ] \`Idempotency-Key\` não contém e-mail, token, CPF ou URL.
- [ ] Message ID é armazenado/logado sem PII sensível.
- [ ] HTML e texto puro são enviados com conteúdo escapado.
- [ ] Nenhum log contém key, Authorization, token, URL, senha, hash ou e-mail completo.
- [ ] Frontend não contém key nem chama o Resend diretamente.
- [ ] Build pode ser enviado para FTP sem arquivos server-side.
- [ ] Homologação real foi aprovada para conta ativada e conta legada.
- [ ] Rollback da API e do frontend está disponível.

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| API key no bundle/FTP | Resend somente na API e scan do Git/dist antes do deploy. |
| Domínio \`from\` divergente | Gate de DNS e validação de domínio na inicialização. |
| Duplicidade em retry | \`Idempotency-Key\` baseada no ID interno do token. |
| Resend indisponível revela conta | Resposta pública genérica e log operacional sem PII. |
| Token criado sem e-mail | \`deliveryStatus=failed\`, \`revokedAt\` e nova solicitação. |
| HTML injetado | Escape de nome/URL e teste do payload. |
| Link privado em e-mail | \`PUBLIC_WEB_URL\` HTTPS obrigatório em produção. |
| Provedores duplicando envio | Sem fallback automático entre Resend e SMTP. |
| Migration incompatível | Backup, deploy incremental, restore e release anterior preservada. |
| JWTs antigos continuam ativos | Registrar risco residual; revogação individual é plano futuro. |

## Checks técnicos

~~~powershell
cd API
node --check src/index.js
node --check src/app/services/mailService.js
npx prisma validate
npm run prisma:generate
npm run prisma:deploy
~~~

~~~powershell
cd web/curriculos_project
npm run lint
npm run build
~~~

~~~powershell
git diff --check
rg -n "RESEND_API_KEY|re_[A-Za-z0-9_]+|api\\.resend\\.com" --glob '!node_modules/**' --glob '!.git/**'
~~~

O resultado permitido deve conter somente nomes de configuração/documentação,
nunca uma API key real.

## Pendências separadas

Este plano não resolve automaticamente os itens do hardening geral: rotação de
secrets antigos, limpeza do histórico Git, Clerk/2FA, cookies \`httpOnly\`, refresh
tokens, CAPTCHA, limiter distribuído, PM2 sem root, WAF, SAST, CI e backups
automatizados. Eles permanecem no plano 004 ou precisam de planos próprios.

## Gate final

Habilitar \`EMAIL_PROVIDER=resend\` na VPS somente depois de confirmar:

1. domínio verificado;
2. API key fora do Git;
3. reset de usuário ativado testado em homologação;
4. ativação de usuário legado testada em homologação;
5. expiração, uso único, falha e idempotência aprovados;
6. frontend sem segredo publicado;
7. backup e rollback disponíveis;
8. responsável operacional aprovado o envio real.

