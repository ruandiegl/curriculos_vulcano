# Documentação de Segurança Global — Projetos Gerados por IA

> Checklist de referência para ser usado (ou colado no prompt/contexto) em qualquer projeto gerado com auxílio de IA. Objetivo: cobrir os pontos que ferramentas de IA costumam esquecer ou implementar de forma incompleta.

## Como usar

- Marque os itens como `[x]` conforme forem implementados.
- A coluna de prioridade indica quando o item deve ser resolvido:
  - 🔴 **Crítico** — obrigatório antes de qualquer lançamento, mesmo MVP.
  - 🟠 **Alto** — obrigatório antes de abrir para usuários reais/produção.
  - 🟡 **Médio** — implementar nas primeiras semanas pós-lançamento.
  - ⚪ **Backlog** — importante para maturidade, mas não bloqueante.

---

## 1. Autenticação e Identidade

- [ ] 🔴 Usar um provedor de autenticação gerenciado em vez de auth "caseiro". **Clerk** é uma boa opção padrão, mas avalie também **Auth0**, **Supabase Auth** ou **Auth.js/NextAuth** dependendo do stack, custo e necessidade de vendor lock-in. Auth caseiro só se justifica com equipe de segurança dedicada.
- [ ] 🔴 **2FA obrigatório** para contas com privilégio elevado (admin, financeiro); oferecer/incentivar para usuários comuns. Preferir TOTP (Google Authenticator/Authy) a SMS, pois SMS é vulnerável a SIM swap.
- [ ] 🔴 Verificação de e-mail obrigatória antes de liberar ações sensíveis.
- [ ] 🔴 Hash de senha com **bcrypt** ou **argon2** (nunca MD5/SHA1 puro, nunca senha em texto plano).
- [ ] 🟠 Política de senha forte (comprimento mínimo, sem exigir complexidade exagerada — seguir diretrizes NIST) + checar contra vazamentos conhecidos (API do Have I Been Pwned).
- [ ] 🟠 Bloqueio/backoff progressivo após tentativas de login falhas (evitar brute force), sem revelar se o e-mail existe ("credenciais inválidas", nunca "usuário não encontrado").
- [ ] 🟠 Cookies de sessão com `httpOnly`, `secure` e `SameSite=Lax/Strict`. Tokens JWT com expiração curta + refresh token.
- [ ] 🟡 Logout global / revogação de todas as sessões ativas (ex.: ao trocar senha).
- [ ] 🟡 Timeout de sessão por inatividade.

## 2. Segredos e Chaves de API

- [ ] 🔴 Nenhum segredo, chave de API ou token no código do front-end/bundle exposto ao navegador. Tudo que precisa de segredo deve passar por um endpoint backend (BFF/proxy).
- [ ] 🔴 `.env` no `.gitignore`; nunca commitar segredos no repositório (nem em histórico de commits antigos).
- [ ] 🔴 Antes de cada deploy, rodar um scan de segredos vazados no repositório (ex.: `gitleaks`, `truffleHog`) — um "trial run" de verificação.
- [ ] 🟠 Usar secrets manager em produção (Vault, AWS Secrets Manager, Doppler, Google Secret Manager) em vez de variáveis soltas em servidor.
- [ ] 🟠 Chaves diferentes por ambiente (dev/staging/produção) — nunca reutilizar chave de produção em teste.
- [ ] 🟡 Escopo mínimo (least privilege) nas chaves de API de terceiros.
- [ ] ⚪ Rotação periódica de chaves e segredos.

## 3. Rate Limiting e Anti-Abuso

- [ ] 🔴 Rate limit global por IP em toda a API.
- [ ] 🔴 Rate limit específico e mais restritivo em endpoints sensíveis: login, cadastro, "esqueci minha senha", envio de OTP/2FA, pagamento.
- [ ] 🟠 Rate limit por usuário/conta autenticada, não só por IP (evita abuso via múltiplos IPs de um mesmo usuário).
- [ ] 🟠 Backoff exponencial em endpoints de autenticação.
- [ ] 🟡 Throttling/validação de webhooks recebidos de terceiros.

## 4. CAPTCHA e Detecção de Bots

- [ ] 🔴 CAPTCHA (recomendo **Cloudflare Turnstile** por ser mais amigável que reCAPTCHA) em formulários públicos: cadastro, login, contato, recuperação de senha.
- [ ] 🟠 **Normalização de e-mail** antes de checar duplicidade/cadastro:
  - Converter para lowercase.
  - Cuidado com "+aliasing" (`user+1@gmail.com` = `user@gmail.com`) — decida conscientemente se quer bloquear ou permitir; bloquear demais pode impedir usuários legítimos de usar aliases para organização.
  - Gmail ignora pontos no local-part (`u.ser@gmail.com` = `user@gmail.com`) — normalizar apenas para domínios que você confirma que têm esse comportamento, não generalize para todos os provedores.
- [ ] 🟡 Honeypot fields (campos invisíveis que só bots preenchem) como camada extra além do CAPTCHA.

## 5. WAF, CDN e Proteção de Borda

- [ ] 🟠 Colocar **Cloudflare** (ou equivalente) na frente da aplicação com WAF ativado.
- [ ] 🟠 Ativar Bot Fight Mode / detecção de bots do Cloudflare.
- [ ] 🟠 HTTPS obrigatório em todo o site, com redirect automático de HTTP → HTTPS, e HSTS ativado.
- [ ] 🟡 Regras WAF customizadas para padrões de SQLi/XSS caso o WAF padrão não seja suficiente.
- [ ] ⚪ Geo-blocking, se o produto não deve atender certas regiões.

## 6. Validação, Sanitização e Injeção

*(Um dos pontos mais comuns que IA esquece: validar apenas no front-end e confiar no dado que chega no back-end.)*

- [ ] 🔴 Validar **toda** entrada no backend, mesmo que já validada no frontend — o frontend nunca é confiável.
- [ ] 🔴 Usar queries parametrizadas / ORM (Prisma, SQLAlchemy, Sequelize etc.) — nunca concatenar strings em SQL.
- [ ] 🔴 Sanitizar output renderizado no HTML para evitar XSS armazenado (ex.: escapar por padrão, usar bibliotecas como DOMPurify se precisar renderizar HTML de usuário).
- [ ] 🟠 Content Security Policy (CSP) configurado para restringir origem de scripts.
- [ ] 🟠 Proteção CSRF em formulários que dependem de cookie de sessão (tokens CSRF ou `SameSite=Strict`).
- [ ] 🟠 Validação de upload de arquivos: tipo MIME real (não só extensão), tamanho máximo, e idealmente scan antivírus/malware antes de armazenar.
- [ ] 🟡 Proteção contra SSRF em qualquer funcionalidade server-side que aceite uma URL fornecida pelo usuário (ex.: "buscar imagem de uma URL").

## 7. Autorização e Controle de Acesso

*(Segundo ponto mais comum que IA esquece: implementar autenticação, mas não checar se o usuário tem permissão sobre o recurso específico.)*

- [ ] 🔴 Toda rota que acessa um recurso por ID deve checar se o recurso pertence ao usuário autenticado (evitar **IDOR** — Insecure Direct Object Reference). Ex.: `/api/pedidos/123` deve validar que o pedido 123 é do usuário logado, não só que ele está autenticado.
- [ ] 🔴 Implementar RBAC (controle de acesso por papel) desde o início, mesmo que simples (ex.: `user`, `admin`).
- [ ] 🟠 Nunca confiar em `role` ou `isAdmin` vindo do payload do frontend/cliente — sempre validar contra o que está no banco/token assinado no servidor.

## 8. Headers de Segurança HTTP

- [ ] 🟠 `Content-Security-Policy`
- [ ] 🟠 `X-Content-Type-Options: nosniff`
- [ ] 🟠 `X-Frame-Options: DENY` (ou `frame-ancestors` via CSP)
- [ ] 🟡 `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] 🟡 `Strict-Transport-Security` (HSTS)

## 9. CORS

- [ ] 🔴 Nunca usar `Access-Control-Allow-Origin: *` em rotas que aceitam credenciais/cookies.
- [ ] 🟠 Whitelist explícita de origins permitidas por ambiente.

## 10. Criptografia de Dados

- [ ] 🟠 Dados sensíveis em repouso (CPF, dados de pagamento tokenizados, etc.) criptografados no banco.
- [ ] 🟠 TLS em qualquer comunicação entre serviços internos que trafegue dados sensíveis.

## 11. Logs de Auditoria e Monitoramento

> Você marcou como "depois" — recomendo reconsiderar: logs básicos de auditoria (quem fez o quê, quando) são baratos de implementar desde o dia 1 e são justamente o que falta quando um incidente acontece. Deixar para depois geralmente significa não ter histórico do período mais vulnerável do produto (lançamento).

- [ ] 🟠 Logar desde o início: login/logout, falhas de autenticação, mudanças de permissão, ações administrativas, transações financeiras.
- [ ] 🔴 **Nunca** logar dados sensíveis em texto plano: senhas, tokens, números completos de cartão.
- [ ] 🟡 Monitoramento de erros em produção (Sentry, Datadog, ou similar) com alertas.
- [ ] ⚪ Logs de auditoria completos e imutáveis (para compliance/investigação forense) — pode evoluir gradualmente a partir do básico acima.

## 12. Pagamentos (se aplicável)

- [ ] 🔴 Nunca processar/armazenar número de cartão diretamente — usar Stripe, PagSeguro, Mercado Pago etc. (PCI compliance transferida ao provedor).
- [ ] 🔴 Validar a assinatura de webhooks de pagamento (evitar que qualquer um chame seu endpoint de "pagamento confirmado").
- [ ] 🟠 Usar idempotency keys para evitar cobrança duplicada em retries.

## 13. Dependências e Supply Chain

- [ ] 🟠 Scan de vulnerabilidades em dependências no CI (Dependabot, `npm audit`, Snyk).
- [ ] 🟡 Lockfiles (`package-lock.json`, `poetry.lock` etc.) sempre commitados.
- [ ] ⚪ Atualização periódica agendada de dependências.

## 14. Testes de Segurança

- [ ] 🟠 **Pentest** antes do lançamento em produção (você já listou — reforçando: idealmente também repetir após mudanças estruturais grandes, não só uma vez).
- [ ] 🟡 SAST no CI/CD (Semgrep, CodeQL) para pegar padrões inseguros automaticamente a cada PR.
- [ ] ⚪ Programa de bug bounty, quando o produto já tiver escala relevante.

## 15. Privacidade e Compliance

- [ ] 🟠 Política de privacidade e termos de uso publicados.
- [ ] 🟠 Conformidade com **LGPD**: base legal para coleta de dados, consentimento explícito quando necessário, mecanismo de exclusão/portabilidade de dados a pedido do usuário.

## 16. Backup e Continuidade

- [ ] 🟠 Backup automático e testado do banco de dados.
- [ ] 🟡 Plano de disaster recovery documentado (RTO/RPO definidos).

---

## Itens da sua lista original — observações específicas

| Item original | Observação |
|---|---|
| Rate limit no sistema | Mantido — detalhado na seção 3. Importante diferenciar rate limit global vs. por endpoint sensível. |
| Captcha com normalização de email | Mantido — seção 4. Cuidado ao normalizar demais (pode bloquear e-mails legítimos com alias). |
| Auth pronto, usar Clerk sempre | Clerk é uma ótima opção padrão, mas "sempre" pode não ser ideal — considere custo em escala e vendor lock-in; alternativas: Auth0, Supabase Auth, Auth.js. |
| Tirar segredos/chaves do front | Mantido — seção 2, é o erro mais comum em projetos gerados por IA. |
| 2FA obrigatório | Mantido — seção 1, recomendo TOTP em vez de SMS. |
| WAF e bot detection (Cloudflare) | Mantido — seção 5. |
| Logs de auditoria (depois) | Recomendo **não** deixar para depois — versão básica desde o início (seção 11). |
| Pentest no site | Mantido — seção 14. |

### O que faltava na lista original e foi adicionado

- Autorização por recurso / proteção contra IDOR (seção 7) — muito comum a IA implementar login, mas esquecer de checar posse do recurso.
- Validação e sanitização de input no backend, mesmo com validação no frontend (seção 6).
- Headers de segurança HTTP e CSP (seção 8).
- Configuração correta de CORS (seção 9).
- Hash de senha com bcrypt/argon2 (seção 1).
- Proteção contra SSRF e validação de upload de arquivos (seção 6).
- Scan de dependências vulneráveis (seção 13).
- Backup e disaster recovery (seção 16).
- Compliance com LGPD (seção 15).
- Validação de assinatura de webhooks de pagamento (seção 12).
