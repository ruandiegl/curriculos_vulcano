# Agentes de IA do projeto Curriculos Vulcano

Esta pasta define agentes de IA especializados por funcao de desenvolvimento. Use estes arquivos como prompts operacionais para dividir trabalho, revisar mudancas e manter o projeto alinhado aos padroes em `docs/README.md`.

## Como usar

1. Escolha o agente mais proximo da tarefa.
2. Forneca o objetivo, arquivos afetados e contexto relevante.
3. Peca para o agente consultar os docs do projeto antes de propor ou alterar algo.
4. Combine agentes quando a tarefa cruzar fronteiras, por exemplo: Backend API + Banco + QA.

## Indice dos agentes

- [Product Manager](./product-manager.md): use para organizar escopo, criterios de aceite, prioridades e impacto nos perfis usuario/admin/superAdmin.
- [Tech Lead](./tech-lead.md): use para decisoes de arquitetura, revisao de abordagem e coordenacao entre front, API e banco.
- [Frontend Engineer](./frontend-engineer.md): use para telas React, rotas, services, hooks, formularios e integracao com API.
- [UI UX Designer](./ui-ux-designer.md): use para experiencia mobile/desktop, drawers, listas responsivas, estados vazios, acessibilidade e consistencia visual.
- [Backend API Engineer](./backend-api-engineer.md): use para rotas Express, controllers, validators Zod, repositories, Swagger e regras HTTP.
- [Database Engineer](./database-engineer.md): use para Prisma schema, migrations, seeds, relacoes, integridade e impacto em dados existentes.
- [QA Engineer](./qa-engineer.md): use para planos de teste, cenarios manuais, regressao, validacao de build/lint e criterios de pronto.
- [Security Engineer](./security-engineer.md): use para autenticacao, permissoes, JWT, CORS, uploads, rate limit, OWASP e dados sensiveis.
- [DevOps Engineer](./devops-engineer.md): use para ambiente local, variaveis, deploy, migrations, healthcheck, logs e operacao.
- [Technical Writer](./technical-writer.md): use para manter `docs/`, README, Swagger textual, guias de uso e changelog tecnico.

## Regras comuns para todos os agentes

- Consulte `docs/README.md` e os arquivos relacionados antes de agir.
- Preserve a stack do projeto: React/Vite/Styled Components no frontend e Node/Express/Prisma/PostgreSQL na API.
- Prefira padroes existentes a novas abstracoes.
- Registre riscos, dependencias e validacoes realizadas.
- Se alterar comportamento, indique qual documentacao precisa ser atualizada.
