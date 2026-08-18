# Plano 004 - Hardening de segurança sem mudança do fluxo principal

## Tarefa

Analisar o projeto Currículos Vulcano contra o checklist de `docs/seguranca-global-projetos-ia (1).md`, registrar os problemas comprovados no código e na operação e organizar uma execução incremental de segurança.

O plano prioriza correções que preservam as jornadas atuais de candidato, admin e superAdmin. Mudanças estruturais de autenticação e identidade — por exemplo Clerk, sessão em cookie `httpOnly`, 2FA e reformulação completa da recuperação de conta — ficam registradas em uma fase futura separada, sem serem misturadas ao hardening imediato.

Este arquivo começou como planejamento. A execução local foi realizada de forma isolada, sem remover arquivos do Git, rotacionar segredos, reescrever histórico ou alterar produção. Os itens operacionais e de produção continuam pendentes.

## Execução local realizada

- Banco de teste isolado em PostgreSQL 16 no container `curriculos_postgres_security`, porta `55432`, com volume próprio `curriculos_security_pgdata`; nenhum banco remoto foi utilizado.
- As oito migrations foram aplicadas, incluindo `20260818130000_add_password_tokens`.
- Foi criado o usuário fictício `legacy.security-test@example.invalid` sem senha exclusivamente para homologação local.
- Usuários legados agora recebem ativação por link de e-mail; usuários já ativados continuam usando reset de senha.
- Tokens de ativação/reset são aleatórios, persistidos somente por hash, expiram e são consumidos uma única vez em transação.
- O fallback de link em log foi removido; localmente, `MAIL_DELIVERY_MODE=memory` usa uma mailbox em memória acessível apenas fora de produção.
- A rota antiga por e-mail + CPF está desabilitada por padrão e só funciona com `ENABLE_LEGACY_CPF_RECOVERY=true` durante uma transição controlada.
- Os buckets dos rate limiters de autenticação e recuperação foram separados para não consumirem o mesmo limite.
- Validações executadas: `npm run lint`, `npm run build`, `npx prisma validate`, geração do Prisma, healthcheck da API e testes ponta a ponta de ativação/reset, login e reutilização de token.

### Pendências antes de produção

- Configurar SMTP real e remover `MAIL_DELIVERY_MODE=memory`.
- Rotacionar todos os segredos comprometidos e invalidar sessões/tokens antigos.
- Remover dumps/artefatos reais do Git e limpar o histórico em clone operacional separado.
- Validar Nginx, `TRUST_PROXY_HOPS`, firewall, PM2 sem root, backups, restore e observabilidade na VPS.
- Executar a matriz completa de autorização, uploads, dependências, CI e regressão dos três perfis.

## Baseline da análise

- Data: 18/08/2026.
- Branch local: `main` no commit `3650f2f`.
- Situação do branch: dois commits atrás de `origin/main`; os commits remotos removem os dois templates `.env` do topo atual da branch, mas não removem seus valores do histórico.
- Alteração preexistente preservada: `docs/seguranca-global-projetos-ia (1).md` está não rastreado no worktree.
- A análise foi estática e local, complementada por `npm audit`; configurações efetivas de Nginx, firewall, Cloudflare, PostgreSQL, FTP/FTPS, PM2 e cron da VPS ainda precisam de verificação operacional.

Antes de executar qualquer fase, sincronizar conscientemente a branch e preservar o documento não rastreado. Não usar `git reset --hard` nem reescrever histórico no clone de trabalho atual.

## Referências consultadas

- `docs/seguranca-global-projetos-ia (1).md`: checklist principal fornecido para a tarefa.
- `docs/README.md`: stack, índice documental e princípio de manutenção.
- `docs/06-autenticacao-e-permissoes.md`: JWT, perfis, rotas públicas e recuperação de senha.
- `docs/09-qualidade-seguranca-deploy.md`: checks, variáveis, deploy e observabilidade mínima.
- `docs/vulnerabilidades-owasp.md`: auditoria anterior, hoje parcialmente desatualizada.
- `docs/04-api-guidelines.md` e `docs/05-banco-de-dados.md`: padrões de API, Prisma e migrations.
- `agents/README.md`: composição de agentes.
- `agents/security-engineer.md`, `agents/tech-lead.md`, `agents/devops-engineer.md` e `agents/qa-engineer.md`.
- Código atual em `API/src`, `API/prisma` e `web/curriculos_project/src`.
- [GitHub — Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).
- [Express — configuração `trust proxy`](https://expressjs.com/en/5x/api/application/).
- [OWASP — Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).
- [OWASP — File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

## Agentes recomendados

Agente principal: `Security Engineer`.

Justificativa: os principais riscos estão em segredos, recuperação de senha, rate limiting, uploads, autorização, logs e dados pessoais, exatamente o escopo desse agente.

Agentes de apoio:

- `Tech Lead`: controlar ordem, contratos, risco de regressão e decisões que atravessam front, API e infraestrutura.
- `DevOps Engineer`: rotação de segredos, GitHub Actions, VPS, Nginx, PM2, backups, restore, headers e monitoramento.
- `Backend API Engineer`: configuração, autenticação atual, limits, validação, logs e testes de rotas.
- `Frontend Engineer`: headers do site estático, build seguro e correção da confiança indevida no `localStorage` para papel de usuário.
- `Database Engineer`: backup/restore, exposição de dumps, minimização e proteção futura de CPF.
- `QA Engineer`: testes de abuso, regressão por perfil, headers, CORS, uploads, rate limit e rollback.
- `Technical Writer`: atualizar a auditoria OWASP, runbooks e checklist de deploy.

## Controles já existentes e que devem ser preservados

- Senhas são armazenadas com bcrypt e não retornadas pelos repositories públicos.
- Login usa mensagem genérica para usuário ou senha inválidos e executa comparação com hash falso para reduzir diferença de timing.
- E-mail é normalizado com `trim()` e lowercase no backend.
- Senhas novas exigem pelo menos oito caracteres, uma letra e um número.
- JWT exige `JWT_SECRET` para emissão e tem validade padrão de um dia.
- Rotas administrativas usam `adminRoutes` ou `superAdminRoutes`.
- Acesso por ID de currículo, candidatura e PDF verifica papel ou propriedade do recurso.
- Schemas de candidato removem `usuarioId` e `status`, reduzindo mass assignment.
- Prisma é usado para acesso ao banco; não foram encontradas queries SQL concatenadas ou APIs raw inseguras.
- CORS usa allowlist e a API falha ao iniciar em produção sem origem configurada.
- Swagger fica desabilitado em produção, salvo quando `ENABLE_API_DOCS=true`.
- Helmet protege as respostas da API.
- Login/cadastro e recuperação já possuem limites específicos.
- JSON tem limite de 2 MB e paginação tem limite máximo de 100 itens.
- Upload exige autenticação/autorização, extensão PDF, MIME PDF, assinatura `%PDF-`, tamanho máximo de 10 MB, nome aleatório e armazenamento fora do webroot.
- Eventos relevantes já geram logs básicos de auditoria.
- O frontend React não usa `dangerouslySetInnerHTML`; o escaping padrão deve ser preservado.
- Existe política de privacidade e aceite obrigatório na interface de cadastro.
- Backups manuais e restauração de banco já foram exercitados durante a virada da versão 2.0, embora ainda não estejam automatizados.

## Relação de problemas a resolver

### SEC-01 — Dumps e artefatos com dados reais versionados

- Severidade: **Crítica**.
- Evidência: estão rastreados `API/backupAtual.sql`, `API/backup_12-06-26.sql`, `homologacao/railway-transfer/railway-pre-restore-20260817-102225.dump`, `homologacao/railway-transfer/vps-restore-source.dump` e `curriculos-api-v2-20260817-0818.tar.gz`.
- Os SQLs contêm dados da tabela `usuarios`; os dumps e o pacote de deploy também devem ser tratados como contendo dados pessoais e hashes de senha.
- Os arquivos aparecem em commits anteriores, portanto removê-los apenas do commit atual não elimina a exposição.
- Impacto: vazamento de CPF, e-mail, telefone, currículo, histórico profissional, hashes de senha e outros dados pessoais para qualquer pessoa com acesso ao repositório ou a clones/forks.
- Correção: retirar os arquivos do repositório, armazenar backups fora do Git com criptografia e acesso restrito, reescrever o histórico em clone isolado, coordenar force-push e renovação dos clones, revisar acessos/forks e habilitar prevenção de recorrência.
- Impacto no fluxo da aplicação: nenhum; impacto operacional alto no Git.
- Fase: contenção imediata.

### SEC-02 — Segredos publicados e reutilizados

- Severidade: **Crítica**.
- Evidência: os valores locais de `JWT_SECRET`, `ADMIN_CREATE_SECRET`, `PASSWORD_RESET_SECRET` e `PASSWORD_SETUP_SECRET` coincidem com os valores que estavam nos templates rastreados. O topo de `origin/main` removeu os templates, mas os valores permanecem no histórico.
- Impacto: se qualquer ambiente compartilha esses valores, terceiros com acesso ao histórico podem emitir tokens, usar a chave administrativa ou forjar fluxos de reset/setup.
- Correção: considerar todos esses valores comprometidos; rotacionar produção, homologação e desenvolvimento; usar valores independentes por ambiente; invalidar tokens anteriores; revisar também banco, SMTP, FTP e chaves SSH caso tenham sido reutilizados ou expostos fora dos templates.
- Impacto no fluxo: a rotação de `JWT_SECRET` encerra sessões atuais uma única vez; é um efeito obrigatório de contenção.
- Fase: contenção imediata, antes da limpeza do histórico ser considerada concluída.

### SEC-03 — Token e link de reset podem ser escritos nos logs

- Severidade: **Crítica**.
- Evidência: `API/src/app/services/mailService.js` registra e-mail e URL completa de reset quando `SMTP_HOST` não está configurado.
- Impacto: a URL contém o token de redefinição e pode ficar nos logs do PM2, backups de logs, terminal e ferramentas de suporte; qualquer leitor pode redefinir a senha dentro da validade.
- Correção: nunca logar URL/token; em produção, falhar no startup ou responder genericamente se SMTP estiver ausente; em desenvolvimento, usar caixa de e-mail local/serviço de captura em vez de imprimir credencial; testar que logs não contêm JWT.
- Impacto no fluxo: nenhum quando SMTP está configurado; ambiente inválido passa a falhar de forma segura.
- Fase: imediata.

### SEC-04 — JWT de recuperação expõe material sensível no payload

- Severidade: **Alta**.
- Evidência: tokens de reset/setup incluem `email` e `passHash`; JWT assinado não é criptografado e seu payload é legível por quem recebe a URL.
- Impacto: o hash de senha pode chegar ao histórico do navegador, logs de proxy, ferramentas de análise ou cabeçalho Referer.
- Correção de curto prazo: payload mínimo com `sub`, `purpose`, `jti` e expiração; não incluir `passHash`, e-mail ou CPF. Preservar invalidação pós-uso por token versionado/nonce ou segredo derivado sem expor o hash. Aplicar `Referrer-Policy: no-referrer` nas páginas de recuperação.
- Impacto no fluxo: mantém as mesmas telas e endpoints.
- Fase: imediata.

### SEC-05 — Recuperação baseada apenas em e-mail + CPF

- Severidade: **Crítica**, com correção estrutural diferida.
- Evidência: `/login/recovery-match` emite token de criação de senha quando e-mail e CPF coincidem. CPF é dado identificável, não um segredo robusto.
- Impacto: quem obtiver e-mail e CPF pode assumir uma conta sem senha; os próprios dumps expostos ampliam o risco.
- Compensações imediatas: rate limit mais restritivo, alertas de tentativas, resposta e timing uniformes, token curto e uso único, revisão se o endpoint ainda é indispensável e opção operacional de desativá-lo em produção.
- Correção definitiva futura: confirmação por e-mail/canal verificado ou provedor gerenciado de identidade.
- Impacto no fluxo: a correção definitiva altera recuperação/onboarding e fica fora do escopo imediato conforme solicitado.
- Fase: mitigação agora; redesign em plano futuro de identidade.

### SEC-05A — Usuários legados sem senha precisam de ativação de primeiro acesso

- Severidade: **Alta**, com impacto funcional restrito aos usuários importados.
- Evidência: o login identifica `user && !user.passHash` e retorna `PASSWORD_SETUP_REQUIRED`; o fluxo atual encaminha o usuário para confirmação de e-mail + CPF. Existem contas no banco antigo sem senha conhecida.
- Problema: não é possível migrar uma senha que não existe, e atribuir senha padrão, usar CPF como senha ou copiar um segredo comum criaria comprometimento em massa.
- Solução recomendada: manter o login detectando a conta legada, mas trocar a recuperação dessas contas por ativação de primeiro acesso via link único enviado ao e-mail já cadastrado.
- Token: gerar aleatoriamente no servidor, armazenar somente o hash do token em uma tabela de ativação, expirar em aproximadamente 15 minutos, invalidar tokens anteriores e marcar o token como usado em uma transação junto com a gravação do bcrypt.
- Regra: o token de ativação só pode definir a senha quando o usuário ainda estiver sem `passHash`; o reset de usuários já ativados continua sendo um fluxo separado.
- Fallback: se o usuário não tiver acesso ao e-mail, abrir atendimento manual com verificação de identidade e ação de superAdmin auditada. Nunca exibir o token no log, nunca enviar senha por chat e nunca usar CPF como segredo permanente.
- Migração gradual: após o período de ativação, desativar o caminho legado e manter somente reset por e-mail verificado ou identidade gerenciada.
- Impacto no fluxo: altera apenas o primeiro acesso de contas sem senha; não muda login de usuários já ativados nem as telas de candidato/admin após a criação da senha.
- Fase: implementar junto do hardening de recuperação, antes de divulgar a versão para todos os usuários legados.

### SEC-06 — Rate limit não representa corretamente o cliente na VPS

- Severidade: **Alta**.
- Evidência: o limiter usa `req.ip`, mas `API/src/index.js` não configura `trust proxy`; atrás do Nginx, vários usuários podem aparecer como loopback. O armazenamento é um `Map` em memória, reinicia com o processo e não funciona entre múltiplas instâncias. Não existe limite global da API.
- Impacto: bloqueio coletivo de usuários legítimos, bypass após restart, proteção inconsistente e possibilidade de abuso/DoS em rotas não autenticadas ou caras.
- Correção: configurar `trust proxy` de forma restrita ao proxy real; confirmar que a porta Node não está pública; adicionar limiter global e políticas separadas para login, cadastro, reset/setup e upload; usar store compartilhado quando houver mais de uma instância; adicionar métricas de 429.
- Impacto no fluxo: somente solicitações abusivas passam a receber 429.
- Fase: imediata.

### SEC-07 — Criação de admin aceita segredo estático e papel insuficiente

- Severidade: **Alta**.
- Evidência: `/login/register-admin` aceita `x-admin-secret` global ou token de `admin`/`superAdmin`.
- Impacto: vazamento do segredo permite criação de contas administrativas sem login; um admin comprometido pode criar persistência privilegiada.
- Correção: desabilitar `x-admin-secret` em produção e exigir `superAdmin`; manter trilha de auditoria com criador e alvo; impor reautenticação/2FA em fase futura.
- Impacto no fluxo: altera apenas o fluxo restrito de criação de administradores, não as jornadas de candidato ou gestão diária.
- Fase: imediata, com validação do responsável de negócio.

### SEC-08 — Dependências com vulnerabilidades conhecidas

- Severidade: **Alta**.
- Evidência de 18/08/2026:
  - API: 13 achados (`9 high`, `3 moderate`, `1 low`), incluindo cadeias em Prisma, Multer, Nodemailer, Express e Nodemon.
  - Frontend completo: 28 achados (`19 high`, `7 moderate`, `2 low`).
  - Runtime do frontend: 7 achados (`2 high`, `5 moderate`), incluindo Axios, jsPDF e React Router.
- Impacto: DoS, upload incompleto, prototype pollution, open redirect/XSS e riscos de supply chain, dependendo da alcançabilidade de cada advisory.
- Correção: criar matriz advisory → versão → alcançabilidade → teste → atualização; atualizar lockfiles sem `npm audit fix --force`; separar dependências de runtime e desenvolvimento; documentar exceções temporárias com prazo e compensação.
- Impacto no fluxo: nenhum por intenção, mas upgrades exigem regressão completa.
- Fase: imediata e contínua.

### SEC-09 — Limites incompletos de entrada e upload

- Severidade: **Alta**.
- Evidência: vários textos e arrays Zod não têm tamanho máximo; Multer limita apenas bytes do arquivo, sem limites de campos/partes/quantidade; o filtro reconhece apenas o prefixo PDF e não faz antivírus/CDR.
- Impacto: consumo excessivo de CPU/memória/disco, payloads anormais e armazenamento de PDF malicioso.
- Correção imediata: alinhar máximos do backend com `formLimits`, limitar arrays/campos/partes, rejeitar chaves desconhecidas onde seguro, limpar arquivo em todo erro/abort, atualizar Multer e monitorar espaço em disco.
- Correção futura: ClamAV/sandbox/CDR conforme risco operacional.
- Impacto no fluxo: dados normais permanecem aceitos; payloads fora das regras passam a falhar com 400/413.
- Fase: imediata para limites; scanner em fase posterior.

### SEC-10 — Token no `localStorage` e confiança visual em papel armazenado

- Severidade: **Alta** para roubo de token; **Média** para spoofing visual.
- Evidência: JWT e usuário ficam no `localStorage`; `useAuth` prioriza `storedUserData.tipo` sobre o papel assinado do token.
- Impacto: XSS no domínio pode roubar o bearer token; alteração manual do storage pode exibir menus administrativos, embora a API hoje preserve autorização server-side.
- Correção imediata sem mudar auth: usar sempre `decoded.tipo` para decisões visuais, limpar estado inválido e fortalecer CSP/headers.
- Correção definitiva futura: sessão em cookie `httpOnly`, `Secure`, `SameSite`, refresh/revogação e logout global, ou provedor gerenciado.
- Impacto no fluxo: correção visual não altera jornada; mudança de sessão fica adiada.
- Fase: parcial agora; arquitetura em plano futuro.

### SEC-11 — Headers do frontend não estão configurados

- Severidade: **Média/Alta**.
- Evidência: `web/curriculos_project/public/.htaccess` contém apenas rewrite SPA. Helmet protege a API, não o site React servido na hospedagem compartilhada.
- Impacto: ausência verificável de CSP, anti-framing, política de referrer e permissions policy no frontend; token em URL de reset pode vazar por referrer.
- Correção: adicionar headers na hospedagem/`.htaccess`, começando em modo de relatório para CSP se necessário; permitir apenas os recursos realmente usados (`self`, API pública e ViaCEP); validar HTTPS/HSTS no domínio real.
- Impacto no fluxo: nenhum se a política for testada; CSP mal calibrada pode quebrar estilos/scripts.
- Fase: imediata, com homologação visual.

### SEC-12 — Logs de auditoria contêm PII e não têm governança

- Severidade: **Média/Alta**.
- Evidência: eventos de autenticação registram e-mail, existência da conta e motivo; logs são JSON no console/PM2, sem política documentada de retenção, rotação, acesso ou integridade.
- Impacto: nova cópia de dados pessoais, exposição em suporte/backups e dificuldade de investigação confiável.
- Correção: remover e-mail/CPF/token/hash; usar identificadores internos ou hash irreversível com salt operacional quando correlação for indispensável; encapsular detalhes; definir rotação, retenção, acesso, alertas e correlação por request ID.
- Impacto no fluxo: nenhum.
- Fase: imediata.

### SEC-13 — Configuração de produção não é validada centralmente

- Severidade: **Alta**.
- Evidência: secrets de reset/setup podem cair em fallback; SMTP pode ficar ausente; URL do frontend tem fallback localhost; a validação acontece de forma distribuída e algumas falhas só aparecem durante uma requisição.
- Impacto: produção inicia em estado inseguro, reset aponta para localhost ou segredos são reutilizados.
- Correção: módulo único de configuração validado no startup, com requisitos específicos para produção; exigir segredos distintos e fortes, HTTPS nas URLs públicas e SMTP coerente; imprimir apenas nomes de variáveis ausentes, nunca valores.
- Impacto no fluxo: nenhum em ambiente correto; deploy inválido passa a falhar cedo.
- Fase: imediata.

### SEC-14 — Build do frontend pode usar endpoint local por engano

- Severidade: **Média**.
- Evidência: `.env` rastreado aponta para localhost e `api.ts` também possui fallback HTTP local. O build de produção atual precisou sobrescrever `VITE_API_URL` manualmente.
- Impacto: publicar bundle que chama localhost/HTTP, indisponibilidade e mixed content.
- Correção: configuração de produção explícita sem segredo, validação de build que exija HTTPS e inspeção automatizada do `dist` para proibir localhost/IP privado.
- Impacto no fluxo: nenhum.
- Fase: imediata.

### SEC-15 — Backup e recuperação não são automáticos nem mensurados

- Severidade: **Alta** operacional.
- Evidência: há backups manuais recentes, porém não foram encontrados job automático, retenção, criptografia offsite, alerta de falha ou runbook com RPO/RTO.
- Impacto: perda de banco e PDFs entre backups, backup corrompido sem detecção e recuperação lenta durante incidente.
- Correção: backup automatizado de PostgreSQL e uploads, criptografado, fora da VPS e fora do Git; checksums; retenção; alerta; restore periódico em homologação. Proposta inicial a aprovar: RPO de 24 h e RTO de 4 h.
- Impacto no fluxo: nenhum.
- Fase: imediata após contenção.

### SEC-16 — Processo e acesso operacional precisam de hardening

- Severidade: **Alta** operacional.
- Evidência observada durante o deploy: API/PM2 e manutenção foram executados como `root`; frontend é transferido por cliente FTP; configuração de Nginx/firewall/SSH não está versionada no projeto.
- Impacto: comprometimento da aplicação pode ampliar privilégios; credenciais e deploy manual aumentam risco de erro e acesso excessivo.
- Correção: usuário de serviço/deploy sem root, permissões mínimas, SSH por chave, desabilitar login root por senha após validar acesso alternativo, FTPS/SFTP, firewall fechando porta Node/Postgres, configuração de Nginx documentada e deploy versionado com rollback.
- Impacto no fluxo: nenhum para usuários; muda operação de deploy.
- Fase: DevOps após estabilização da versão 2.0.

### SEC-17 — Dados pessoais em repouso e respostas amplas

- Severidade: **Alta**, com parte estrutural diferida.
- Evidência: CPF e demais dados de currículo ficam em texto claro no PostgreSQL; repositories administrativos retornam relações completas; não há política técnica de minimização, exportação ou anonimização.
- Impacto: vazamento da VPS/banco produz dados diretamente utilizáveis; respostas e logs podem transportar mais dados que a tela necessita.
- Correção imediata: revisar selects/DTOs e retornar somente campos necessários; inventariar dados, retenção e acessos; proteger backups.
- Correção futura: criptografia/tokenização de CPF com estratégia de busca/uniqueness, exclusão/portabilidade e retenção LGPD.
- Impacto no fluxo: minimização pode ser transparente; criptografia e direitos LGPD exigem projeto próprio.
- Fase: revisão agora; arquitetura futura.

### SEC-18 — Não existe pipeline de segurança nem testes automatizados

- Severidade: **Média/Alta**.
- Evidência: não há `.github/workflows`, Dependabot, Gitleaks, CodeQL/Semgrep ou suíte de testes; scans foram manuais.
- Impacto: vulnerabilidades e regressões de autorização podem voltar sem serem detectadas.
- Correção: CI com build/lint/sintaxe, testes de segurança, `npm audit`, secret scanning e SAST; bloquear merge em falhas críticas/altas alcançáveis; Dependabot com cadência controlada.
- Impacto no fluxo: nenhum.
- Fase: imediata após contenção.

### SEC-19 — Política de privacidade sem evidência persistida de aceite

- Severidade: **Média**.
- Evidência: o checkbox existe apenas no frontend; API/banco não registram versão da política, timestamp ou origem do aceite. Também não foi encontrado fluxo implementado de portabilidade/exclusão.
- Impacto: baixa evidência de consentimento e dificuldade em atender direitos LGPD.
- Correção futura: decisão jurídica sobre base legal; versionar política e registrar aceite quando aplicável; criar processo de acesso, correção, exportação e exclusão/anonimização.
- Impacto no fluxo: exige produto, jurídico e possível migration.
- Fase: plano futuro de privacidade/compliance.

### SEC-20 — Relatório OWASP está desatualizado

- Severidade: **Média** de governança.
- Evidência: `docs/vulnerabilidades-owasp.md` ainda afirma ausência de RBAC, IDOR, rate limit, CORS seguro, Swagger condicionado, magic bytes e auditoria, controles que já existem no código.
- Impacto: decisões e auditorias podem partir de diagnóstico incorreto, enquanto achados novos graves não estão documentados.
- Correção: atualizar cada achado para `corrigido`, `parcial`, `pendente` ou `aceito`, incluir evidência e data da revalidação.
- Impacto no fluxo: nenhum.
- Fase: junto da entrega de hardening.

## Fora do escopo imediato — plano futuro obrigatório

Os itens abaixo mudam autenticação, identidade, persistência sensível ou experiência e devem virar um PRD/plano próprio após as fases imediatas:

- Clerk/Auth0/Supabase Auth/Auth.js ou outra identidade gerenciada.
- 2FA obrigatório para admin/superAdmin.
- Verificação de e-mail.
- Access token curto, refresh token rotativo, revogação e logout global.
- Migração do bearer token em `localStorage` para cookie seguro.
- CAPTCHA/Turnstile e honeypot nos formulários públicos.
- Redesign da recuperação por CPF.
- Criptografia/tokenização pesquisável de CPF e política de retenção.
- Antivírus/CDR completo para PDFs.
- WAF/Bot Management/Cloudflare, após confirmar DNS e operação.
- Processo completo de direitos LGPD e termos de uso.

Esses itens não devem ser considerados dispensados; apenas não entram no primeiro pacote para evitar misturar mudança funcional com contenção urgente.

## Plano de implementação

### Fase 0 — Contenção de incidente no repositório

1. Confirmar visibilidade do repositório, colaboradores, forks, actions/artifacts e locais onde os dumps foram clonados.
2. Copiar os backups necessários para armazenamento criptografado e restrito fora do Git; validar checksum e restauração antes de remover qualquer cópia.
3. Rotacionar `JWT_SECRET`, secrets de reset/setup e segredo administrativo em produção e homologação; verificar possível reutilização em outros serviços.
4. Invalidar sessões emitidas com o segredo antigo e comunicar o logout único esperado.
5. Remover dumps, SQLs e pacote de deploy do topo da branch; ampliar `.gitignore` para `*.sql`, `*.dump`, `*.tar.gz`, diretórios de backup e artefatos de restore, com exceções explícitas apenas para migrations.
6. Fazer limpeza do histórico em clone espelho isolado com `git-filter-repo --sensitive-data-removal`, após backup do repositório e aprovação explícita da janela.
7. Validar todos os refs, coordenar force-push e orientar recriação dos clones; contatar suporte GitHub se houver referências/caches/PRs com dados sensíveis.
8. Executar scan de segredos e busca por nomes/hashes dos artefatos em todo o histórico limpo.

**Gate:** não declarar contenção concluída apenas porque os arquivos sumiram do commit atual.

### Fase 1 — Hardening imediato da API sem redesenhar autenticação

1. Inventariar apenas por contagem e categorias as contas com `pass_hash IS NULL`: e-mail válido/ausente, CPF presente/ausente, tipo e duplicidades; não exportar a lista com PII para planilhas ou Git.
2. Criar configuração central validada no startup para ambiente, URLs, secrets, SMTP, proxy e limites.
3. Exigir secrets distintos em produção; eliminar fallbacks entre JWT, reset e setup.
4. Remover qualquer log de URL/token de reset e redigir dados pessoais dos logs de auditoria.
5. Reduzir payload dos JWTs de reset/setup e preservar uso único sem expor `passHash`.
6. Criar ativação de primeiro acesso para `pass_hash IS NULL`, com token aleatório armazenado somente por hash, expiração curta, uso único e e-mail genérico.
7. Tratar falha de SMTP sem revelar existência da conta e sem imprimir credenciais; bloquear o fallback de link em log na produção.
8. Manter `recovery-match` somente como compatibilidade temporária, com escopo exclusivo de legado, limites mais restritos, telemetria sem PII e data de remoção definida.
9. Configurar `trust proxy` apenas para o Nginx/rede esperada e validar que a porta da API não é pública.
10. Implementar limite global e limites separados por IP/conta para autenticação, recuperação e upload; adicionar métricas de 429.
11. Restringir criação de admin a superAdmin e remover o segredo estático de produção.
12. Adicionar máximos Zod para strings/arrays e limites Multer de arquivo, campos, partes e quantidade; garantir cleanup em erro/abort.
13. Atualizar dependências da API em lotes pequenos e revisar advisories por alcançabilidade.
14. Adicionar request ID, logs estruturados redigidos e política de rotação/retention do PM2.

**Gate:** build/checks, testes de abuso e smoke test de login, cadastro, reset, currículos, vagas, candidaturas e PDFs.

### Fase 2 — Hardening imediato do frontend e hospedagem

1. Fazer `useAuth` usar o papel do token assinado, nunca `user.tipo` do storage como fonte prioritária.
2. Criar configuração de build de produção explícita para `https://api.curriculosvulcano.com.br/api` e falhar se houver localhost, IP privado ou HTTP no bundle.
3. Adicionar headers no `.htaccess`: CSP calibrada, `frame-ancestors`/anti-frame, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e HSTS quando confirmado no host.
4. Usar política `no-referrer` nas páginas que recebem token por query string.
5. Atualizar Axios, React Router, jsPDF e dependências transitivas com validação de build, lint e regressão.
6. Confirmar que nenhuma variável `VITE_*` contém segredo e que source maps de produção seguem decisão explícita.
7. Publicar primeiro em diretório/ambiente de homologação, verificar headers com `curl` e então promover para `public_html` com backup e rollback.

**Gate:** nenhum recurso bloqueado pela CSP, API/CORS funcionando e nenhuma URL local no `dist`.

### Fase 3 — DevSecOps, backup e continuidade

1. Criar workflow de CI com build/lint/checks, `npm audit`, Gitleaks e CodeQL/Semgrep.
2. Configurar Dependabot e política de atualização; separar dependências runtime/dev na API.
3. Adicionar testes automatizados para 401/403, IDOR, mass assignment, rate limit, reset e uploads.
4. Criar backup automático do PostgreSQL e uploads com checksum, criptografia, retenção e cópia offsite.
5. Executar restore drill em banco/volume isolados e registrar duração, integridade e contagens.
6. Aprovar RPO/RTO e criar runbook de desastre e rollback de deploy/migration.
7. Migrar PM2 para usuário de serviço sem root e endurecer SSH, firewall, permissões, Nginx e FTPS/SFTP.
8. Monitorar `/api/health`, readiness com banco, erros 401/403/429/500, espaço de disco e expiração de certificado.

**Gate:** pipeline obrigatório na branch, último restore testado e operação sem root validada antes de remover o processo antigo de rollback.

### Fase 4 — Documentação e reauditoria

1. Atualizar `docs/vulnerabilidades-owasp.md` com status e evidência atual de cada achado antigo.
2. Atualizar `docs/06-autenticacao-e-permissoes.md`, `docs/09-qualidade-seguranca-deploy.md` e guia de deploy.
3. Documentar classificação de dados, retenção de logs/backups, responsáveis e resposta a incidente.
4. Reexecutar secret scan, SAST, audit de dependências e matriz manual.
5. Abrir PRD/plano separado para identidade gerenciada, 2FA, sessão segura, CAPTCHA e recuperação de conta.

## Arquivos e módulos prováveis

### API

- `API/src/index.js`
- `API/src/routes.js`
- `API/src/app/controllers/AuthController.js`
- `API/src/app/middlewares/Auth.js`
- `API/src/app/middlewares/rateLimiter.js`
- `API/src/app/middlewares/uploadCurriculoPdf.js`
- `API/src/app/middlewares/errorHandler.js`
- `API/src/app/services/mailService.js`
- `API/src/app/services/auditLogger.js`
- `API/src/app/validators/*.js`
- Novo módulo de configuração em `API/src/config/`.
- Novo modelo/migration para tokens de ativação de primeiro acesso de usuários legados.
- Novo service/controller ou extensão isolada para ativação de conta sem senha.
- `API/package.json` e `API/package-lock.json`.
- Testes novos em `API/tests/security/` ou estrutura definida pelo Tech Lead.

### Frontend

- `web/curriculos_project/src/hooks/useAuth.tsx`
- `web/curriculos_project/src/services/api.ts`
- Páginas de login, cadastro, recuperação e reset.
- `web/curriculos_project/public/.htaccess`
- Configuração de ambiente/build e `package-lock.json`.

### Repositório e operação

- `.gitignore` na raiz ou regras equivalentes centralizadas.
- `.github/workflows/security.yml`
- `.github/dependabot.yml`
- `.gitleaks.toml`, se necessário para regras específicas.
- Scripts operacionais versionados sem credenciais, por exemplo `scripts/ops/backup-postgres.sh` e verificação de restore.
- Runbooks em `docs/` para incidente, backup/restore, deploy e rollback.

### Arquivos que devem sair do Git

- `API/backupAtual.sql`
- `API/backup_12-06-26.sql`
- `curriculos-api-v2-20260817-0818.tar.gz`
- `homologacao/railway-transfer/railway-pre-restore-20260817-102225.dump`
- `homologacao/railway-transfer/vps-restore-source.dump`
- Qualquer outro dump, backup, chave ou `.env` real encontrado pela varredura completa.

## Critérios de aceite

- [ ] Nenhum dump, backup, pacote de deploy ou segredo real existe no topo ou no histórico publicado do repositório.
- [ ] Cópias necessárias dos backups estão criptografadas, verificadas e fora do Git.
- [ ] Secrets comprometidos foram rotacionados e os antigos não autenticam mais.
- [ ] Nenhum log contém JWT, URL de reset, senha, hash, CPF ou e-mail em texto claro.
- [ ] JWTs de reset/setup têm payload mínimo, expiração curta e uso único.
- [ ] Contas legadas sem `passHash` possuem ativação de primeiro acesso por token único armazenado somente por hash.
- [ ] Não existe senha padrão, senha baseada em CPF ou token de ativação nos logs.
- [ ] Existe fallback manual documentado e auditado para contas legadas sem e-mail acessível.
- [ ] Produção não inicia sem configuração obrigatória e secrets independentes.
- [ ] Rate limit identifica corretamente IP atrás do Nginx, possui limite global e mantém políticas específicas.
- [ ] A porta Node e o PostgreSQL não estão expostos publicamente.
- [ ] Criação de admin exige superAdmin em produção.
- [ ] Inputs e uploads possuem máximos consistentes e cleanup em falhas.
- [ ] `npm audit` não tem vulnerabilidade crítica/alta alcançável em runtime; exceções têm justificativa, compensação, responsável e prazo.
- [ ] Frontend de produção não contém localhost, IP privado ou endpoint HTTP.
- [ ] Frontend e API entregam headers de segurança validados no domínio público.
- [ ] Papel exibido no frontend deriva do token assinado, não do storage editável.
- [ ] CI executa secret scan, SAST, auditoria de dependências, build e testes.
- [ ] Backup automático inclui banco e uploads, possui checksum, cópia offsite e restore testado.
- [ ] PM2/API operam sem root e deploy usa credencial de menor privilégio.
- [ ] Auditoria OWASP e runbooks refletem o estado atual.
- [ ] Login, cadastro, recuperação vigente, currículos, vagas, candidaturas e PDFs continuam funcionando para os três perfis.

## Plano de testes

### Segredos e repositório

- Executar Gitleaks/secret scanning em todos os refs após a limpeza.
- Verificar ausência dos caminhos sensíveis com `git rev-list --objects --all` e busca nos refs remotos.
- Confirmar que um JWT assinado com o segredo antigo falha após rotação.
- Confirmar que clones antigos foram descartados ou limpos conforme o runbook.

### Autenticação e autorização

- Login válido/inválido retorna mensagens e tempos equivalentes dentro de tolerância.
- Usuário comum recebe 403 em rotas admin e superAdmin.
- Admin recebe 403 em gestão exclusiva de superAdmin.
- Tentativa de alterar `usuarioId`, `status`, `tipo` ou propriedades internas é ignorada/rejeitada conforme contrato.
- Usuário não acessa currículo, candidatura ou PDF de terceiro por ID.
- Reset/setup rejeitam token expirado, reutilizado, finalidade errada e assinatura antiga.
- Usuário legado sem `passHash` recebe ativação por e-mail, cria a primeira senha uma única vez e não pode reutilizar o token.
- Usuário legado sem acesso ao e-mail só é recuperado por procedimento manual de superAdmin com verificação e auditoria.
- Usuário já ativado não passa pelo fluxo de ativação legada.
- Logs de todos os cenários são inspecionados para ausência de PII e credenciais.

### Rate limit e proxy

- IPs distintos atrás do Nginx possuem buckets distintos.
- Cabeçalho `X-Forwarded-For` forjado não permite escolher IP quando a requisição não vem do proxy confiável.
- Login, cadastro, recovery/reset e upload retornam 429 e `Retry-After` no limite.
- Restart do processo e múltiplas instâncias seguem o comportamento documentado do store.
- Rotas autenticadas comuns não sofrem bloqueio indevido no uso normal.

### Upload

- PDF válido até o limite é aceito.
- Extensão falsa, MIME falso, assinatura inválida, arquivo truncado e múltiplos arquivos são rejeitados.
- Upload abortado não deixa arquivo parcial.
- Usuário não faz upload/download/delete em currículo alheio.
- Espaço em disco e taxa de upload geram alerta antes da indisponibilidade.

### Frontend e headers

- Build e lint passam.
- Busca no `dist` não encontra localhost, IP privado ou HTTP para API.
- CSP não bloqueia React, Styled Components, imagens, API ou ViaCEP.
- `frame-ancestors`, referrer, MIME sniffing, permissions e HSTS são verificados no domínio público.
- Alterar `localStorage.user.tipo` não libera menu nem rota administrativa.
- Token de reset não aparece em Referer de requests subsequentes.

### Backup e recuperação

- Backup automático gera dump válido e arquivo de uploads com checksum.
- Restore em ambiente isolado preserva contagens, relações, migrations e PDFs.
- Credenciais não aparecem em comando, log ou arquivo versionado.
- RPO/RTO medidos ficam dentro do valor aprovado.

## Checks técnicos sugeridos

Frontend:

```bash
cd web/curriculos_project
npm run lint
npm run build
npm audit --omit=dev
```

Backend:

```bash
cd API
node --check src/index.js
npm run prisma:generate
npm audit
```

Repositório:

```bash
git diff --check
gitleaks git --redact
```

Os comandos de limpeza de histórico, rotação de secrets, alteração de firewall e restore nunca devem ser executados automaticamente junto dos checks. Cada um exige alvo validado, backup, responsável e janela aprovada.

## Ordem de execução por agente

1. `Security Engineer` + `DevOps Engineer`: contenção, inventário, rotação e plano de limpeza do Git.
2. `Tech Lead`: aprovar gates, impacto único de logout e mudança restrita de criação de admin.
3. `Backend API Engineer`: configuração, reset, logs, rate limit, limites e dependências.
4. `Frontend Engineer`: papel do token, build seguro e headers.
5. `QA Engineer`: testes automatizados/manuais e matriz de abuso.
6. `Database Engineer` + `DevOps Engineer`: backup automático, restore drill, RPO/RTO e hardening da VPS.
7. `Technical Writer`: atualizar auditoria, runbooks e documentação de deploy.
8. `Security Engineer`: reauditoria final e registro de risco residual.

## Riscos e mitigações

| Risco | Mitigação |
| --- | --- |
| Reescrita de histórico remove commits ou interrompe clones | Fazer em clone espelho isolado, gerar backup/bundle, revisar refs alterados e coordenar janela. |
| Rotação do JWT desloga usuários | Comunicar janela e tratar como logout único obrigatório por exposição do segredo. |
| `trust proxy` amplo permite spoofing de IP | Confiar somente no hop/subnet do Nginx e impedir acesso público à porta Node. |
| Limiter global bloqueia usuários legítimos | Definir limites por telemetria, separar IP/conta/rota e monitorar 429. |
| CSP quebra frontend ou ViaCEP | Começar em report-only/homologação, observar violações e usar allowlist mínima validada. |
| Upgrade de dependência altera contratos | Atualizar em lotes, manter lockfile, executar regressão e ter rollback por commit/release. |
| SMTP ausente passa a bloquear reset | Validar configuração antes do deploy e testar envio real; falhar cedo em vez de expor token. |
| Minimização de resposta quebra tela | Mapear campo consumido por página/service antes de reduzir selects/DTOs. |
| Backup automático vaza credencial ou dados | Secret fora do script, arquivo criptografado, permissões mínimas, logs redigidos e destino offsite. |
| Processo sem root perde acesso a uploads/logs | Preparar proprietário/grupo/permissões e validar escrita/leitura antes de trocar PM2. |

## Riscos residuais aceitos temporariamente

Até o plano futuro de identidade e privacidade, permanecem riscos conhecidos:

- bearer token em `localStorage`;
- ausência de 2FA e verificação de e-mail;
- recuperação legada por e-mail + CPF, se o negócio mantiver o endpoint;
- ausência de revogação/logout global;
- CPF em texto claro no banco;
- ausência de CAPTCHA e scanner completo de malware.

Esses riscos exigem compensações, monitoramento, owner e prazo. Não devem ser marcados como resolvidos pelo hardening deste plano.

## Checklist de conclusão do planejamento

- [x] Documento global de segurança analisado.
- [x] Convenções e agentes do projeto consultados.
- [x] Código de autenticação, autorização, CORS, headers, uploads, logs e banco revisado.
- [x] Dependências auditadas em 18/08/2026.
- [x] Dados/artefatos sensíveis rastreados no Git identificados sem expor seus conteúdos.
- [x] Controles existentes separados de achados pendentes.
- [x] Mudanças de fluxo separadas em fase futura.
- [x] Fases, gates, critérios de aceite, testes, agentes, riscos e rollback definidos.
- [ ] Execução da contenção autorizada e realizada.
- [ ] Hardening implementado e validado.
- [ ] Plano futuro de identidade/privacidade criado.
