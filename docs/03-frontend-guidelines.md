# Guidelines de frontend

## Stack

- React 19.
- TypeScript.
- Vite.
- Styled Components.
- React Router.
- Axios.

## Organizacao

- Paginas devem ficar em `src/pages`.
- Componentes globais devem ficar em `src/components`.
- Cada pagina deve manter seus estilos no proprio `styles.ts`, salvo quando houver componente realmente compartilhado.
- Tipos de dominio devem ficar em `src/types`.
- Funcoes de API devem ficar em `src/services`.
- Validacoes e helpers reutilizaveis devem ficar em `src/utils`.

## Componentes

- Prefira componentes pequenos, orientados ao fluxo da pagina.
- Evite criar bibliotecas internas sem necessidade real.
- Preserve os layouts existentes: `AdminLayout` para area administrativa e `UserLayout` para area do candidato.
- Para confirmacoes, use `ConfirmModal`.
- Para feedback textual, use `FeedbackMessage` quando aplicavel.
- Para dialogs responsivos, use `BottomSheet` (`src/components/BottomSheet`) ou `ConfirmModal` quando a ação for uma confirmação.
- `BottomSheet` deve conservar callbacks e estados do consumidor, usar `role="dialog"`/`aria-modal="true"`, gerenciar foco e iniciar drag somente no handle.
- Use `useMediaQuery` para lógica que dependa do viewport e `useBottomSheet` para o gesto de drawer; não crie listeners sem cleanup.

## Estado e dados

- Use `useState`, `useEffect`, `useMemo` e hooks locais quando a necessidade for restrita a pagina.
- Dados remotos devem ser carregados via services.
- Trate loading, erro e estado vazio em toda lista.
- Buscas devem usar debounce quando dispararem requisicoes frequentes.
- Dados sensiveis de autenticacao devem usar a chave central `TOKEN_STORAGE_KEY`.

## Formularios

- Use limites de texto de `src/utils/formLimits.ts`.
- Normalize campos antes de enviar para a API.
- Mostre mensagens especificas de erro.
- Em edicoes inline no mobile, role ate o formulario apos o clique de editar.
- Em viewport abaixo de 768px, inputs/selects/textareas devem ter fonte mínima de 16px e altura mínima de 48px; ações devem ter target mínimo de 44px.

## Rotas

- Rotas ficam em `src/routes/routes.tsx`.
- `PrivateRoute` protege areas autenticadas.
- `adminOnly`, `superAdminOnly` e `userOnly` devem ser usados conforme o perfil esperado.
- Ao criar uma nova tela, defina claramente se ela pertence ao candidato, admin ou super admin.

## Padrao de services

- Services devem exportar funcoes com nomes de acao: `listVagas`, `createVaga`, `updateUsuario`.
- A base de API deve continuar centralizada em `src/services/api.ts`.
- Evite montar URL de API diretamente dentro das paginas.

## Validacao antes de entregar

```bash
cd web/curriculos_project
npm run build
npm run lint
```

Observacao: se o lint completo falhar por debitos antigos, rode lint focado nos arquivos alterados e registre a pendencia.
