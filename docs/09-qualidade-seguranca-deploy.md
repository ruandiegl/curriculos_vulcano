# Qualidade, seguranca e deploy

## Checklist antes de entregar

Frontend:

```bash
cd web/curriculos_project
npm run build
npm run lint
```

Backend:

```bash
cd API
node --check src/index.js
npm run prisma:generate
```

Quando alterar arquivos especificos JS/TS, rode tambem checks focados nos arquivos modificados.

## Seguranca

- Nunca commitar `.env`.
- Nunca logar JWT, senha, hash ou tokens de reset.
- Manter `JWT_SECRET` forte e diferente por ambiente.
- Configurar `CORS_ORIGIN` ou `FRONTEND_URL` em producao.
- Manter Swagger desabilitado em producao, exceto com `ENABLE_API_DOCS=true`.
- Upload de PDF deve continuar limitado a PDF e tamanho maximo configurado.
- Reset de senha deve ter rate limit.

## OWASP

Consulte tambem:

- [Vulnerabilidades OWASP](./vulnerabilidades-owasp.md)

## Deploy

Consulte:

- [Deploy Locaweb com front e API local](./deploy-locaweb-front-api-local.md)

Diretrizes gerais:

- Rodar migrations com `npm run prisma:deploy`.
- Rodar `npm run prisma:generate` apos instalar dependencias.
- Configurar `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` e `CORS_ORIGIN`.
- Configurar SMTP se reset de senha precisar enviar e-mail real.
- Garantir persistencia do diretorio de uploads se a API rodar em ambiente com disco volatil.

## Observabilidade minima

- Monitorar status de `/api/health`.
- Monitorar erros HTTP 401, 403 e 500.
- Em producao, logs devem ser suficientes para diagnostico sem expor dados sensiveis.

## Padrao de mudanca

Ao alterar uma regra de negocio:

1. Atualize controller/repository/validator conforme necessario.
2. Atualize frontend service/tipos se a resposta mudar.
3. Atualize Swagger se a API publica mudar.
4. Atualize esta pasta `docs`.
5. Rode build/checks.
