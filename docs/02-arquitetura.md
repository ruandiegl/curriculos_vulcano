# Arquitetura

O repositorio e dividido em dois blocos principais: frontend web e API.

```txt
curriculos_vulcano/
  API/
    prisma/
    src/
      app/
        controllers/
        DTO/
        middlewares/
        Repositories/
        services/
        utils/
      databases/
      routes.js
      index.js
      swagger.js
  web/
    curriculos_project/
      src/
        components/
        content/
        hooks/
        pages/
        routes/
        services/
        styles/
        types/
        utils/
```

## Fluxo frontend -> API

1. Paginas React chamam funcoes em `src/services`.
2. `src/services/api.ts` configura Axios, base URL e token Bearer.
3. A API recebe a requisicao em `API/src/routes.js`.
4. Middlewares validam autenticacao e permissao.
5. Controllers tratam a regra de entrada e saida.
6. Repositories acessam o Prisma.
7. Validators Zod validam payloads de entrada.

## Padrao backend

- `controllers`: coordenam request/response e chamam repositorios.
- `Repositories`: concentram queries Prisma.
- `DTO`: constroem filtros, paginacao e estruturas de busca.
- `validators`: schemas Zod para payloads.
- `middlewares`: autenticacao, autorizacao, upload, rate limit e erro.
- `services`: integracoes e servicos auxiliares, como e-mail e auditoria.
- `utils`: helpers puros, como normalizacao de busca textual.

## Padrao frontend

- Cada pagina fica em `src/pages/<nome>/index.tsx`.
- Estilos da pagina ficam em `src/pages/<nome>/styles.ts`.
- Componentes compartilhados ficam em `src/components`.
- Tipos compartilhados ficam em `src/types`.
- Regras reutilizaveis ficam em `src/utils`.
- Chamadas HTTP ficam em `src/services`.

## Diretriz de evolucao

Antes de criar uma abstracao nova, procure um padrao equivalente no modulo atual. Este projeto favorece alteracoes locais, claras e alinhadas ao arquivo existente.
