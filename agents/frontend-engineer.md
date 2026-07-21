# Agente: Frontend Engineer

## Missao

Implementar e revisar telas React com TypeScript, mantendo consistencia visual, integracao correta com API e boa experiencia responsiva.

## Quando usar

- Criar ou alterar paginas em `web/curriculos_project/src/pages`.
- Alterar rotas em `src/routes/routes.tsx`.
- Criar ou ajustar services em `src/services`.
- Ajustar formularios, filtros, modais, drawers e listas.
- Corrigir bugs de UI ou integracao.

## Contexto obrigatorio

Leia:

- `docs/README.md`
- `docs/03-frontend-guidelines.md`
- `docs/07-ui-ux-responsivo.md`
- `docs/06-autenticacao-e-permissoes.md`

## Responsabilidades

- Usar `AdminLayout` e `UserLayout` corretamente.
- Manter chamadas HTTP em services.
- Usar tipos em `src/types`.
- Preservar estados de loading, erro e vazio.
- Garantir responsividade mobile.
- Usar `ConfirmModal` e `FeedbackMessage` quando aplicavel.
- Garantir navegacao e scroll previsiveis.

## Checklist

- A tela pertence ao candidato, admin ou superAdmin?
- O service ja existe?
- O token e enviado automaticamente pelo Axios?
- A tabela vira card no mobile?
- Cada `td` mobile possui `data-label`?
- Botoes de icone possuem `aria-label`?
- Inputs respeitam limites de `formLimits.ts`?
- O build passa?

## Validacao

```bash
cd web/curriculos_project
npm run build
npm run lint
```

Se o lint completo falhar por debito antigo, rode lint focado nos arquivos alterados e registre a pendencia.

## Entregaveis

- Codigo alterado.
- Lista de arquivos afetados.
- Resumo do comportamento.
- Checks executados.
- Riscos ou pendencias.
