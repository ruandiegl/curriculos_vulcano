# Plano 006 — Proteção de tokens no frontend e fortalecimento do rate limit

## Tarefa

Reduzir a exposição de tokens de recuperação no navegador, preparar a migração
do JWT de autenticação para uma sessão baseada em cookie `HttpOnly` e validar
o rate limit dos endpoints sensíveis.

O plano respeita a arquitetura atual: frontend React/Vite, API Express/Prisma,
PostgreSQL, JWT Bearer e publicação do frontend no Railway/Locaweb. A migração
para cookie altera o fluxo de autenticação e fica isolada em uma fase posterior,
com homologação e rollback próprios.

O texto abaixo registra o planejamento e, após a execução, o status das
alterações locais. Nenhum banco, Railway, DNS ou produção foi alterado nesta
execução.

## Status da execução local — 2026-08-19

As fases abaixo foram implementadas e validadas no workspace local:

- links de recuperação novos usam fragmento e o frontend remove o token da URL
  após a captura, mantendo compatibilidade com links antigos;
- JWT de sessão deixou de ser persistido pelo frontend e passou a ser emitido
  em cookie `HttpOnly`, com endpoint de sessão, logout, CORS com credenciais e
  validação de `Origin` para requisições mutáveis com cookie;
- rate limit foi isolado em armazenamento testável, com chaves hashadas,
  headers `RateLimit-*`, `Retry-After` somente quando bloqueado e cooldown de
  60 segundos para novas solicitações de recuperação;
- headers de cache/referrer e regras de segurança do frontend foram atualizados;
- testes automatizados, validação do Prisma, lint e build passaram.

Ainda pendente antes do rollout remoto:

- validar o número de proxies confiáveis e configurar `TRUST_PROXY_HOPS` no
  Railway somente após essa evidência;
- homologar cookie, login, logout, recuperação e perfis no Railway em um deploy
  coordenado de API e frontend;
- adotar armazenamento distribuído (Redis) antes de usar múltiplas réplicas ou
  múltiplos processos da API.

## Agente recomendado

Agente principal: **Security Engineer**.

Agentes de apoio:

- **Backend API Engineer** — cookies, CORS, CSRF, headers, rate limit e rotas.
- **Frontend Engineer** — leitura segura do link, limpeza da URL e Axios.
- **DevOps Engineer** — proxy, Railway, PM2, headers do FTP e rollout.
- **QA Engineer** — testes de abuso, regressão, múltiplas instâncias e rollback.
- **Technical Writer** — atualização das guidelines de autenticação e deploy.

## Referências

- `docs/README.md` — stack e padrão de manutenção.
- `docs/02-arquitetura.md` — fluxo React → Axios → Express → Prisma.
- `docs/03-frontend-guidelines.md` — serviços, rotas e build do frontend.
- `docs/04-api-guidelines.md` — rotas públicas, middlewares e erros HTTP.
- `docs/06-autenticacao-e-permissoes.md` — JWT Bearer e rotas públicas.
- `docs/09-qualidade-seguranca-deploy.md` — checks, headers, CORS e deploy.
- `docs/seguranca-global-projetos-ia (1).md` — cookies, CSRF, headers,
  rate limit, antiabuso e proteção contra vazamento de segredos.
- `plans/plan-004-hardening-seguranca-sem-mudanca-de-fluxo.md` — hardening já
  executado e itens de autenticação estruturalmente adiados.
- `plans/plan-005-implementacao-resend-recuperacao-senha.md` — fluxo atual de
  reset/ativação e integração server-side com Resend.

## Diagnóstico atual

### Tokens de recuperação

- O token de reset/ativação não é salvo em `localStorage` ou `sessionStorage`.
- O backend salva somente o hash SHA-256 do token em `PasswordToken`.
- O token possui propósito, expiração, uso único e revogação de tokens anteriores.
- Falha no provedor de email revoga o token criado.
- O frontend lê o token da query string:
  - `/reset-password?token=...`;
  - `/activate-account?token=...`.
- O frontend envia o token por POST, mas não remove imediatamente o valor da URL.
  Ele pode permanecer no histórico, na barra de endereço ou em mecanismos de
  referência do navegador.
- O backend não registra o token puro, a URL completa ou o corpo do email.

### JWT de login

- O JWT de sessão é salvo em `localStorage['token']`.
- Dados básicos do usuário são salvos em `localStorage['user']`.
- O Axios lê o JWT do `localStorage` e adiciona `Authorization: Bearer` nas
  rotas privadas.
- As rotas públicas de recuperação não recebem esse Bearer pelo interceptor.
- A sessão ainda não usa cookie `HttpOnly`; um XSS que execute JavaScript no
  domínio pode ler o JWT.

### Rate limit existente

O middleware atual usa um `Map` em memória por processo e cria buckets por:

- IP;
- email normalizado;
- combinação IP + email.

Configuração atual:

| Grupo | Janela | Limite | Rotas |
|---|---:|---:|---|
| `auth` | 15 minutos | 20 | login, cadastro e criação de admin |
| `password-recovery` | 15 minutos | 5 | esqueci senha, reset, ativação, recovery-match e setup-password |

Quando qualquer bucket atinge o limite, a API retorna `429`, uma mensagem
genérica e `Retry-After` em segundos. Os grupos são separados.

### Riscos identificados no rate limit

1. O `Map` é local ao processo; reinício da API limpa os buckets.
2. Com múltiplas réplicas Railway ou múltiplos workers PM2, cada processo terá
   limites diferentes.
3. O email normalizado aparece na chave em memória. Não é logado, mas pode ser
   substituído por uma representação irreversível.
4. Não existe rate limit global para as demais rotas públicas.
5. O Railway não possui atualmente a variável `TRUST_PROXY_HOPS`; o código usa
   `0` por padrão. O IP visto por `req.ip` precisa ser validado antes de
   considerar o limite confiável atrás do proxy.
6. Não há headers de observabilidade de limite/restante/reset; há somente
   `Retry-After` quando o bloqueio ocorre.
7. Existe limite por conta, mas não há cooldown curto específico para impedir
   uma sequência de emails de recuperação em poucos segundos.

## Objetivos e não objetivos

### Incluído

- Remover o token de recuperação da URL após a captura.
- Preferir fragmento de URL para novos links de email, preservando links antigos.
- Adicionar headers e regras de cache adequados às páginas de recuperação.
- Testar e documentar os limites atuais.
- Corrigir a identificação de cliente atrás de Railway/Nginx.
- Preparar rate limit distribuído e cooldown persistente.
- Planejar a migração do JWT para cookie `HttpOnly` com proteção CSRF.
- Atualizar testes, documentação, critérios de deploy e rollback.

### Não incluído nesta primeira entrega

- Clerk, Auth0, Supabase Auth ou troca completa do provedor de identidade.
- 2FA, CAPTCHA, WAF ou alteração de perfis de permissão.
- Mudanças na recuperação por CPF.
- Alterações em currículos, vagas ou candidaturas.
- Revogação retroativa de todos os JWTs sem decisão operacional específica.

## Estratégia de implementação

### Fase 0 — Baseline e proxy

1. Criar uma branch de trabalho e registrar o estado atual.
2. Confirmar, sem imprimir segredos, `JWT_EXPIRES_IN`, `NODE_ENV`,
   `CORS_ORIGIN` e os domínios públicos por ambiente.
3. Documentar a topologia:
   - navegador → Railway → API;
   - navegador → Nginx/PM2 → API na VPS.
4. Determinar o número correto de hops confiáveis para cada ambiente.
5. Não configurar `TRUST_PROXY_HOPS` por tentativa: valor incorreto pode
   juntar todos os usuários em um bucket ou permitir falsificação de IP.

**Gate:** o IP usado pelo limiter é comprovadamente o IP do cliente e não um
valor aceito cegamente de `X-Forwarded-For`.

### Fase 1 — Correção de baixo risco nos tokens

1. Alterar links novos de email para usar fragmento:
   - `/reset-password#token=...`;
   - `/activate-account#token=...`.
2. Fazer as páginas aceitarem temporariamente fragmento novo e query antiga.
3. Após capturar o token, remover o valor do endereço com `history.replaceState`
   ou navegação React Router com `replace`.
4. Manter o token somente em memória durante o formulário.
5. Após sucesso ou erro definitivo, limpar o estado e navegar ao login.
6. Não incluir token em analytics, logs, títulos ou parâmetros secundários.
7. Configurar `Referrer-Policy: no-referrer` nas páginas sensíveis.
8. Configurar `Cache-Control: no-store` para respostas/documentos de recuperação.
9. Garantir que endpoints de reset/ativação continuem sem header Bearer.

**Gate:** depois de abrir o link, o token não permanece na barra de endereço nem
no histórico da rota, e continua funcional até ser consumido.

### Fase 2 — Rate limit determinístico e testável

1. Isolar a criação do armazenamento de buckets para eliminar estado global
   entre testes.
2. Testar:
   - limite 20/15min para login/cadastro;
   - limite 5/15min para recuperação;
   - resposta `429`;
   - `Retry-After` positivo e coerente;
   - mesmo email em IPs distintos;
   - vários emails no mesmo IP;
   - mesma combinação IP + email;
   - separação entre grupos;
   - reinício/limpeza do armazenamento;
   - corpo inválido e email ausente.
3. Hashar o email usado na chave de memória sem alterar o valor usado pelo
   controller.
4. Adicionar, se necessário, headers de limite/restante/reset sem revelar
   email ou existência de conta.
5. Manter mensagens públicas genéricas.

**Gate:** os testes reproduzem o bloqueio sem enviar email real e sem depender
da ordem de execução.

### Fase 3 — Proteção contra abuso de recuperação

1. Manter 5 solicitações em 15 minutos como baseline até haver métricas.
2. Adicionar cooldown curto por conta/email, por exemplo uma solicitação a cada
   60 segundos, sem revelar se o usuário existe.
3. Reutilizar solicitação pendente quando a política de idempotência permitir,
   evitando vários tokens válidos.
4. Registrar apenas eventos agregados: rota/grupo, status 429, categoria e
   request ID. Nunca email completo, token ou segredo.
5. Avaliar Turnstile/CAPTCHA em fase própria se houver abuso real.

**Gate:** o mesmo email não recebe uma sequência de mensagens em poucos segundos,
mas uma solicitação legítima continua possível após o cooldown.

### Fase 4 — Rate limit distribuído

1. Enquanto houver uma única instância de homologação, documentar a limitação do
   armazenamento em memória.
2. Antes de escalar Railway ou PM2 para múltiplos processos, adotar Redis
   gerenciado ou outro armazenamento compartilhado.
3. Usar operação atômica e TTL por bucket.
4. Definir comportamento caso o Redis fique indisponível: bloqueio para rotas de
   alto risco ou fallback local temporário com alerta.
5. Não usar PostgreSQL como contador de alta frequência sem avaliar locks e custo.

**Gate:** duas réplicas submetidas ao mesmo teste produzem o mesmo limite global.

### Fase 5 — Migração do JWT para cookie seguro

Esta fase é separada porque muda o contrato entre frontend e API.

1. API:
   - emitir cookie com `HttpOnly`, `Secure` e `SameSite=Lax` ou `Strict`;
   - definir `Path`, `Max-Age` e domínio somente quando necessário;
   - limpar o cookie no logout;
   - configurar CORS com `credentials: true` e origins explícitas;
   - criar endpoint de sessão atual ou manter validação pelas rotas existentes.
2. CSRF:
   - escolher `SameSite` compatível com os domínios finais;
   - adicionar token CSRF/double-submit quando necessário;
   - validar `Origin`/`Referer` como camada adicional.
3. Frontend:
   - usar `withCredentials` no Axios;
   - remover leitura/escrita do JWT em `localStorage`;
   - remover dependência de `jwtDecode` para manter sessão;
   - obter usuário/sessão por endpoint seguro;
   - limpar o `localStorage['token']` legado na primeira versão compatível.
4. Definir expiração, renovação, logout e revogação de todas as sessões após
   troca de senha.
5. Homologar login, logout, refresh da página e os três perfis antes do deploy.

**Gate:** nenhuma sessão funcional depende de JWT salvo no storage do navegador.

## Matriz de testes

### Tokens e frontend

- Abrir link novo com fragmento e confirmar limpeza da URL.
- Abrir link antigo com query e confirmar compatibilidade e limpeza.
- Recarregar a página antes de enviar a senha.
- Tentar token consumido, expirado, revogado e de propósito incorreto.
- Confirmar ausência de token em `localStorage`, `sessionStorage`, logs e build.
- Confirmar ausência de token no `Referer` usando recurso externo controlado.
- Confirmar `Cache-Control: no-store` e `Referrer-Policy`.

### Rate limit

- 20 tentativas de login: a 21ª retorna `429`.
- 5 solicitações de recuperação: a 6ª retorna `429` e `Retry-After`.
- Mesmo email em IPs diferentes.
- Muitos emails a partir do mesmo IP.
- Tentativas inválidas, payloads grandes e requests sem email.
- Reinício do processo: documentar que o limite em memória é perdido.
- Proxy configurado e header de IP forjado, garantindo que o cliente não escolhe
  o próprio IP de limitação.
- Duas réplicas somente após adotar limiter distribuído.

### Regressão funcional

- Login de usuário, admin e superAdmin.
- Cadastro de usuário.
- Recuperação de conta ativada via Resend.
- Ativação de conta legada via Resend.
- Vagas, candidaturas, currículo e upload de PDF.
- Logout e expiração da sessão.

## Deploy seguro

### Homologação Railway

1. Executar testes automatizados localmente.
2. Publicar primeiro somente a limpeza de URL; não migrar cookie no mesmo deploy.
3. Testar recuperação real uma vez por cenário e usar emails fictícios para testar
   rate limit sem disparar Resend.
4. Conferir logs HTTP/auditoria sem tokens, URLs completas ou segredos.
5. Validar healthcheck, login, recuperação e funções críticas.

### VPS/Locaweb

- Fazer backup do banco, código, uploads e configuração.
- Manter a release atual disponível para rollback.
- Configurar o número de proxies confiáveis conforme o Nginx real.
- Gerar e revisar `dist/` antes do FTP.
- Nunca enviar API, `.env`, dump ou API key para a hospedagem do frontend.

## Critérios de aceite

- [ ] Links novos não expõem token em query string persistente.
- [ ] Links antigos continuam funcionando durante a transição.
- [ ] Token é removido da URL imediatamente após a captura.
- [ ] Nenhum token de recuperação é salvo em storage persistente do navegador.
- [ ] Nenhum token aparece em logs, analytics, Referer ou cache.
- [ ] JWT atual está documentado como risco residual até a Fase 5.
- [ ] Rate limit atual está coberto por testes automatizados.
- [ ] Limites e `Retry-After` funcionam conforme documentado.
- [ ] IP real é validado atrás de Railway/Nginx.
- [ ] Cooldown de recuperação impede abuso por conta.
- [ ] Limiter distribuído é obrigatório antes de múltiplas réplicas.
- [ ] Cookie de sessão, quando implementado, é `HttpOnly`, `Secure` e
  `SameSite` adequado.
- [ ] CSRF e CORS são testados com origins permitidas e não permitidas.
- [ ] Builds não contêm JWT, API key, token de recuperação ou URL privada.
- [ ] Existe rollback para frontend e API.

## Riscos e decisões

| Risco | Mitigação |
|---|---|
| Token em query histórica | Fragmento + `replaceState` + headers de referrer/cache. |
| XSS rouba JWT | Fase 5 migra sessão para cookie `HttpOnly`; CSP permanece recomendada. |
| Todos usuários compartilham IP | Validar `TRUST_PROXY_HOPS` antes do rollout. |
| Reinício limpa limite | Aceitar somente em instância única; Redis antes de escalar. |
| Duplicidade de emails | Cooldown, token anterior revogado e idempotência. |
| Quebra de autenticação | Cookie em release própria com teste e rollback. |
| Bloqueio legítimo | Manter thresholds atuais e medir antes de reduzir. |

## Checks técnicos previstos

No backend:

- `node --check src/index.js`
- `node --check src/app/middlewares/rateLimiter.js`
- `npm test`
- `npx prisma validate`

No frontend:

- `npm run lint`
- `npm run build`

Busca de vazamento no artefato:

- `rg -n "localStorage.*token|sessionStorage.*token|RESEND_API_KEY|Bearer |[?&]token=" dist API/src web/curriculos_project/src`

O resultado deve ser revisado manualmente: referências de implementação podem
aparecer no código, mas nenhum segredo ou token real pode aparecer no build,
logs ou documentação operacional.

## Ordem recomendada

1. Testar e documentar o rate limit atual.
2. Corrigir exposição do token na URL sem alterar o login.
3. Ajustar proxy e preparar cooldown/limiter distribuído.
4. Homologar em Railway.
5. Migrar JWT para cookie em release separada.
6. Só depois repetir o rollout na VPS/Locaweb.
