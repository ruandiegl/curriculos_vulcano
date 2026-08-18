# Plano 028 - Recuperacao de Senha Web e API com Resend

> **Para agentes executores:** SUB-SKILL OBRIGATORIA: usar `superpowers:executing-plans` para executar este plano tarefa por tarefa, com testes antes das alteracoes e checkpoints de revisao.

**Objetivo:** concluir e colocar em producao o fluxo de recuperacao de senha do sistema web e da API compartilhada, enviando e-mails pelo Resend com o subdominio verificado `resend.grupogtf.com.br` e atendendo tambem o aplicativo mobile.

**Arquitetura:** a API Express e a unica responsavel por gerar tokens, persistir hashes, selecionar o destino web/mobile e enviar o e-mail. O frontend React solicita a recuperacao e consome o token no link HTTPS; o app Expo usa os mesmos endpoints com um header de plataforma. O PostgreSQL/Prisma continua unico para os dois clientes.

**Stack:** TypeScript, Express, React, Vite, Prisma, PostgreSQL, Vitest, React Testing Library, Resend Email API e Vercel.

## Restricoes Globais

- Nunca expor `RESEND_API_KEY` em Vite, Expo, HTML, bundle, logs ou Markdown.
- Remetente: `GTF Propostas <nao-responda@resend.grupogtf.com.br>`.
- URL web de producao: `${APP_PUBLIC_URL}/reset-password?token={token}`.
- URL mobile de producao: `${MOBILE_APP_RESET_URL}?token={token}`.
- Token aleatorio de 32 bytes, persistido somente como SHA-256.
- TTL padrao de 30 minutos, uso unico e invalidacao dos links anteriores ainda ativos.
- Apos redefinir a senha, revogar todos os refresh tokens do usuario.
- Resposta publica identica para conta existente, inexistente ou inativa.
- Senha entre 8 e 128 caracteres e confirmacao identica.
- Desenvolvimento usa `EMAIL_PROVIDER=mock`; producao usa `EMAIL_PROVIDER=resend`.
- Nao adicionar dependencia `resend` nesta entrega: manter a chamada HTTP nativa ja existente, reduzindo bundle e superficie de atualizacao.

---

## 1. Agentes Selecionados

| Papel | Responsabilidade no plano |
|---|---|
| **Backend API Engineer (principal)** | Consolidar endpoints, URL por cliente, servico de e-mail, contratos e testes de integracao. |
| **Security Engineer** | Revisar anti-enumeracao, token hash, TTL, rate limit, reuso, logs e revogacao de sessoes. |
| **Frontend Engineer** | Integrar as telas web existentes com o cliente da API e estados acessiveis. |
| **DevOps Engineer** | Configurar Resend, variaveis Vercel, dominio e validacao de producao. |
| **QA Engineer** | Cobrir fluxo feliz, erros, expiracao, reuso, ADMIN, COMERCIAL e regressao de login. |
| **Technical Writer** | Atualizar operacao local, deploy e autenticacao. |

## 2. Estado Atual Confirmado

- `POST /api/auth/forgot-password` e `POST /api/auth/reset-password` ja existem.
- O modelo/migration `password_reset_tokens` ja existe.
- `password-reset-email.ts` ja envia via endpoint HTTP do Resend e possui modo mock.
- A API ja monta URL web por `APP_PUBLIC_URL` e mobile por `MOBILE_APP_RESET_URL` quando recebe `X-Client-Platform: mobile`.
- As paginas `forgot-password.tsx` e `reset-password.tsx` e suas rotas ja existem no frontend web.
- O OpenAPI e clientes gerados ja possuem os contratos basicos.
- O plano deve consolidar, testar e publicar o fluxo existente, e nao criar uma segunda implementacao.

## 3. Fluxo Alvo Compartilhado

```text
Web ou Mobile
  -> POST /api/auth/forgot-password
  -> API normaliza e limita solicitacao
  -> API invalida links ativos anteriores
  -> API persiste somente hash + expiracao
  -> API escolhe URL pelo X-Client-Platform
  -> API envia via Resend
  -> usuario abre link e envia nova senha
  -> API consome token e revoga sessoes
  -> login com a nova senha
```

## 4. Arquivos Afetados

### API e seguranca

- Modificar: `artifacts/api-server/src/routes/auth.ts`
- Modificar: `artifacts/api-server/src/services/password-reset-email.ts`
- Modificar: `artifacts/api-server/src/config/security.ts`
- Criar: `artifacts/api-server/src/test/password-reset.test.ts`
- Criar: `artifacts/api-server/src/test/password-reset-email.test.ts`
- Modificar: `artifacts/api-server/vitest.config.ts` somente para defaults de teste sem segredo.

### Contrato

- Verificar/modificar: `lib/api-spec/openapi.yaml`
- Regenerar, se o contrato mudar: `lib/api-zod/src/generated/**`
- Regenerar, se o contrato mudar: `lib/api-client-react/src/generated/**`

### Frontend web

- Modificar: `artifacts/proposta/src/pages/forgot-password.tsx`
- Modificar: `artifacts/proposta/src/pages/reset-password.tsx`
- Modificar: `artifacts/proposta/src/pages/login.tsx` somente se o link nao estiver acessivel.
- Modificar: `artifacts/proposta/src/App.tsx` somente se as rotas publicas nao estiverem fora do guard de autenticacao.
- Criar: `artifacts/proposta/src/pages/password-reset.test.tsx`

### Configuracao e documentacao

- Modificar: `.env.example`
- Modificar: `docs/07-autenticacao-perfis-permissoes.md`
- Modificar: `docs/rodar-local.md`
- Modificar: `docs/DEPLOY-VERCEL-NEON.md`
- Modificar: `docs/STATUS-PRODUCAO-ECOSSISTEMA.md`

## 5. Contrato Definitivo

### `POST /api/auth/forgot-password`

Entrada:

```json
{"email":"usuario@grupogtf.com.br"}
```

Resposta `202`:

```json
{"message":"Se o e-mail estiver cadastrado, enviaremos as instrucoes de recuperacao."}
```

O header opcional `X-Client-Platform: mobile` seleciona o deep link mobile. Ausente ou diferente de `mobile`, seleciona o link HTTPS web.

### `POST /api/auth/reset-password`

Entrada:

```json
{
  "token":"token-publico-recebido-no-email",
  "newPassword":"senha-com-8-ou-mais-caracteres",
  "confirmPassword":"senha-com-8-ou-mais-caracteres"
}
```

Respostas:

- `200`: senha alterada e sessoes revogadas;
- `400`: payload invalido ou link invalido/expirado/usado;
- `429`: limite excedido.

## 6. Tarefas de Implementacao

### Tarefa 1 - Cobrir o fluxo atual com testes de API

**Interfaces:** os testes usam a app Express e o banco de teste existentes; o envio Resend deve ser mockado no nivel de `fetch`.

- [ ] Escrever teste para e-mail existente ativo: cria um token com hash, nunca persiste o token puro e retorna `202`.
- [ ] Escrever teste para e-mail inexistente e usuario inativo: mesma resposta e nenhum token criado.
- [ ] Escrever teste que uma nova solicitacao invalida tokens anteriores ainda ativos.
- [ ] Escrever teste de URL web usando `APP_PUBLIC_URL`.
- [ ] Escrever teste de URL mobile quando `X-Client-Platform: mobile` estiver presente.
- [ ] Escrever teste de senha valida, token expirado, token usado, token adulterado e confirmacao divergente.
- [ ] Escrever teste que a troca revoga todos os refresh tokens ativos do usuario.
- [ ] Executar os testes novos e registrar as falhas que representam lacunas reais antes de alterar a implementacao.

### Tarefa 2 - Consolidar configuracao e validacao de ambiente

**Variaveis de producao:**

```env
APP_PUBLIC_URL=https://propostasmosaico-one.vercel.app
MOBILE_APP_RESET_URL=gtfpropostas://reset-password
PASSWORD_RESET_TTL_MINUTES=30
EMAIL_PROVIDER=resend
RESEND_FROM_EMAIL=GTF Propostas <nao-responda@resend.grupogtf.com.br>
# RESEND_API_KEY e cadastrada como secret no painel da Vercel e nao e escrita neste arquivo.
```

- [ ] Adicionar ao schema de `security.ts` as variaveis nao secretas e validar URL/protocolo por ambiente.
- [ ] Em producao, falhar na inicializacao se `EMAIL_PROVIDER=resend` estiver sem `RESEND_API_KEY` ou remetente valido.
- [ ] Em producao, rejeitar fallback `onboarding@resend.dev` para impedir deploy aparentemente saudavel sem remetente oficial.
- [ ] Manter `EMAIL_PROVIDER=mock` e remetente de exemplo em `.env.example`, sem chave real.
- [ ] Garantir que `MOBILE_APP_RESET_URL` aceite o scheme `gtfpropostas://` e que `APP_PUBLIC_URL` exija HTTPS em producao.
- [ ] Testar configuracao valida e cada configuracao invalida sem imprimir valores secretos.

### Tarefa 3 - Robustecer o envio pelo Resend

**Interface:**

```ts
sendPasswordResetEmail(input: {
  to: string;
  userName: string;
  resetUrl: string;
  ttlMinutes: number;
  requestId: string;
}): Promise<{ id: string } | { mocked: true }>
```

- [ ] Escrever teste do payload Resend: `from`, destinatario, assunto, HTML escapado e URL correta.
- [ ] Adicionar `Idempotency-Key` derivada do identificador interno da solicitacao, sem incluir token ou e-mail.
- [ ] Incluir versao texto puro do e-mail alem do HTML para acessibilidade e clientes restritivos.
- [ ] Retornar o ID do Resend para log estruturado de sucesso, sem e-mail, token ou URL completa.
- [ ] Mapear erros do provedor para erro interno sem devolver detalhes do Resend ao cliente.
- [ ] Se o provedor falhar, invalidar o token que nao chegou ao usuario antes de finalizar a requisicao publica.
- [ ] Nunca registrar body, Authorization, destinatario completo ou reset URL.
- [ ] Manter a resposta publica `202` mesmo se o provedor falhar; registrar falha para observabilidade e alerta operacional.

### Tarefa 4 - Ajustar geracao e consumo do token

- [ ] Extrair `buildResetUrl`, `sha256` e TTL para modulo testavel se `auth.ts` continuar concentrando responsabilidades.
- [ ] Aceitar somente `X-Client-Platform` igual a `mobile`; qualquer outro valor usa web.
- [ ] Construir URLs com `URL`/`URLSearchParams` ou helper equivalente para evitar concatenacao incorreta.
- [ ] Gerar token com `crypto.randomBytes(32).toString('base64url')` e persistir apenas SHA-256.
- [ ] Consumir token e alterar senha na mesma transacao.
- [ ] Invalidar links anteriores ao criar um novo e revogar sessoes ao concluir.
- [ ] Confirmar que nenhum retorno ou log da API expoe hash, token puro ou existencia da conta.

### Tarefa 5 - Integrar o frontend web ao cliente tipado

- [ ] Escrever teste para e-mail invalido, envio em andamento, sucesso generico, `429` e falha de rede.
- [ ] Escrever teste para token ausente, senha curta, confirmacao divergente, sucesso, token expirado/usado e nova solicitacao.
- [ ] Trocar `fetch` inline pelos hooks/clientes gerados `useForgotPassword` e `useResetPasswordPublic`, preservando os endpoints publicos em `auth-fetch.ts`.
- [ ] Bloquear duplo envio e manter os dados do formulario em falha recuperavel.
- [ ] Usar feedback acessivel em tela; nao depender somente de toast para resultado critico.
- [ ] Apos sucesso, substituir a navegacao para `/login` e nao manter token na URL/historico.
- [ ] Manter mensagens de conta existente/inexistente indistinguiveis.

### Tarefa 6 - Validar OpenAPI e clientes gerados

- [ ] Confirmar no OpenAPI os dois endpoints, status `202/200/400/429` e schemas exatos.
- [ ] Documentar `X-Client-Platform` como header opcional com valor `mobile`.
- [ ] Se houver diferenca, alterar primeiro `lib/api-spec/openapi.yaml` e executar o gerador oficial do workspace.
- [ ] Confirmar que web e mobile enviam os mesmos nomes `newPassword` e `confirmPassword`.
- [ ] Executar typecheck de `api-zod`, `api-client-react`, API e frontend.

### Tarefa 7 - Configurar Resend e Vercel

- [ ] No painel Resend, confirmar que `resend.grupogtf.com.br` esta `Verified` com SPF e DKIM validos.
- [ ] Confirmar que a API key usada pertence ao mesmo workspace Resend que verificou o subdominio.
- [ ] Configurar as seis variaveis da Tarefa 2 em Production e Preview na Vercel; a chave fica marcada como sensitive.
- [ ] Remover qualquer chave Resend de `.env` mobile, arquivo versionado, plano, print ou historico compartilhado; rotacionar se houve exposicao.
- [ ] Fazer redeploy sem cache apos alterar variaveis.
- [ ] Verificar os logs da Vercel por request ID, sem dados sensiveis.
- [ ] Fazer envio real para um ADMIN e um COMERCIAL ativos.

### Tarefa 8 - QA de seguranca e regressao

- [ ] Conta existente e inexistente produzem status, corpo e tempo de resposta sem diferenca exploravel relevante.
- [ ] Cinco solicitacoes dentro da janela sao aceitas e a excedente recebe `429` com `Retry-After`.
- [ ] Link web abre `/reset-password` no dominio oficial.
- [ ] Link mobile usa `gtfpropostas://reset-password` quando o header mobile estiver presente.
- [ ] Token usado, expirado e adulterado falham.
- [ ] Nova senha autentica; senha antiga falha.
- [ ] Refresh tokens anteriores falham depois da redefinicao.
- [ ] Login normal, refresh web e refresh mobile continuam funcionando.
- [ ] Nenhum segredo aparece no bundle Vite, bundle Expo, DevTools, resposta HTTP ou logs.

### Tarefa 9 - Documentacao e verificacao final

- [ ] Atualizar autenticacao, operacao local, deploy Vercel e status de producao com o fluxo definitivo.
- [ ] Registrar que o subdominio Resend e remetente de envio, nao URL da aplicacao.
- [ ] Registrar que o app mobile consome a mesma API e nao recebe a chave.
- [ ] Executar:

```bash
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/api-server test
pnpm --filter @workspace/proposta run typecheck
pnpm --filter @workspace/proposta run build
```

- [ ] Verificar arquivos editados:

```bash
git diff --check
rg -n 're_[A-Za-z0-9_]+' --glob '!node_modules/**' --glob '!.git/**'
```

Resultado esperado da busca: nenhuma API key real versionada.

## 7. Criterios de Aceite

- [ ] Usuario solicita recuperacao no web e recebe e-mail enviado por `nao-responda@resend.grupogtf.com.br`.
- [ ] O mesmo endpoint gera deep link mobile quando solicitado pelo app.
- [ ] Conta inexistente nao e revelada.
- [ ] Token e armazenado somente como hash, expira, funciona uma vez e invalida links anteriores.
- [ ] Redefinir senha revoga sessoes existentes.
- [ ] Frontend apresenta estados de loading, sucesso, erro, expiracao e rate limit.
- [ ] API key existe somente no ambiente server-side.
- [ ] OpenAPI, clientes gerados, testes, typechecks e build estao aprovados.
- [ ] Fluxo real foi validado em Production/Preview para ADMIN e COMERCIAL.

## 8. Riscos e Mitigacoes

| Risco | Mitigacao |
|---|---|
| Remetente nao autorizado | Confirmar dominio e API key no mesmo workspace Resend antes do deploy. |
| Segredo no frontend | Somente `process.env` server-side; busca automatizada antes do commit. |
| Link mobile instavel no Expo Go | Aceite mobile em development build, conforme plano mobile 007. |
| E-mail duplicado | Idempotency-Key, bloqueio no cliente e rate limit na API. |
| Enumeracao de usuarios | Resposta generica e trabalho de seguranca equivalente para os cenarios publicos. |
| Token vazado | Hash no banco, TTL curto, uso unico, URL sem logs e revogacao de sessoes. |
| Falha silenciosa do Resend | Log estruturado por request ID e alerta operacional, sem mudar a resposta publica. |

## 9. Ordem Recomendada e Commits

1. Testes da API e configuracao.
2. Servico Resend e token/URL.
3. Contrato OpenAPI e gerados.
4. Frontend web.
5. Deploy/QA/documentacao.
6. Executar o plano mobile 007.

Commits sugeridos, somente apos cada bloco passar nos testes:

```text
test(auth): cover password recovery lifecycle
feat(auth): harden resend password recovery
feat(web): integrate password recovery screens
docs(auth): document resend recovery deployment
```

## 10. Checklist de Execucao

- [x] Testes do ciclo de token, resposta anti-enumeracao, URL web/mobile, uso unico e revogacao de sessoes.
- [x] Validacao de ambiente com falha rapida em producao sem provedor, chave, remetente oficial ou URL HTTPS.
- [x] Servico Resend com HTML escapado, texto puro, idempotencia, ID do provedor e invalidacao do token em falha.
- [x] Frontend web integrado ao cliente tipado, validacao centralizada e estados criticos em tela.
- [x] OpenAPI atualizado e clientes regenerados pelo comando oficial.
- [x] Documentacao de autenticacao, operacao local, Vercel e status de producao atualizada.
- [x] Dependencia de codigo e contrato liberada para o plano mobile 007.
- [x] Verificacao automatizada: API `13 suites/45 testes`, web `3 suites/6 testes`, typechecks e build aprovados.
- [ ] Pendente operacional: configurar/revisar as variaveis no ambiente publicado e fazer redeploy.
- [ ] Pendente QA real: envio Resend para ADMIN e COMERCIAL, expiracao/reuso e abertura do deep link em development build.

### Registro de Implementacao - 10/08/2026

- O segredo Resend permanece exclusivamente no backend; nenhuma chave foi adicionada ao Vite ou Expo.
- A API usa `APP_PUBLIC_URL` para web e `MOBILE_APP_RESET_URL` somente quando recebe `X-Client-Platform: mobile`.
- O frontend nao transforma mais falha de rede em falso sucesso e remove o token do historico apos a redefinicao.
- Nenhum deploy ou envio real foi executado nesta etapa para nao alterar producao sem validacao do usuario.

## Referencias Oficiais

- Resend, envio de e-mail: <https://resend.com/docs/api-reference/emails/send-email>
- Resend, remetente em dominio verificado: <https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender-in-resend>
- Resend, erros da API: <https://www.resend.com/docs/api-reference/errors>
- Expo, deep links: <https://docs.expo.dev/linking/into-your-app/>
