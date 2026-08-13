# Documentacao do projeto Curriculos Vulcano

Este diretorio centraliza as guidelines e padroes do projeto para que uma nova pessoa consiga entender a stack, a arquitetura, os fluxos principais e como contribuir sem quebrar convencoes existentes.

## Stack e tipo

- Tipo: Web responsivo + API REST.
- Frontend: React 19, TypeScript, Vite, Styled Components, React Router, Axios.
- Backend: Node.js, Express 5, Prisma ORM, PostgreSQL, JWT, Zod.
- Documentacao de API: Swagger em `/api/docs`.
- Persistencia de arquivos: uploads locais para PDFs de curriculo.

## Indice recomendado

1. [Visao geral](./01-visao-geral.md)
2. [Arquitetura](./02-arquitetura.md)
3. [Guidelines de frontend](./03-frontend-guidelines.md)
4. [Guidelines da API](./04-api-guidelines.md)
5. [Banco de dados e Prisma](./05-banco-de-dados.md)
6. [Autenticacao e permissoes](./06-autenticacao-e-permissoes.md)
7. [UI, UX e responsividade](./07-ui-ux-responsivo.md)
8. [Desenvolvimento local](./08-desenvolvimento-local.md)
9. [Qualidade, seguranca e deploy](./09-qualidade-seguranca-deploy.md)

## PRDs

- [PRD-002: Status nao visualizado em curriculos](./prd-status-nao-visualizado.md)

## Docs ja existentes

- [Deploy Locaweb com front e API local](./deploy-locaweb-front-api-local.md)
- [Reset de senha](./reset-de-senha.md)
- [Vulnerabilidades OWASP](./vulnerabilidades-owasp.md)

## Principio de manutencao

Sempre que uma decisao tecnica mudar o comportamento do projeto, atualize esta pasta no mesmo PR ou no mesmo pacote de alteracoes. Documentacao desatualizada vira divida tecnica rapidamente.
