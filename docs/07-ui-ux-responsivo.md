# UI, UX e responsividade

## Principios visuais

- Interface administrativa deve ser densa, clara e eficiente.
- Evite layout de landing page em telas operacionais.
- Use cards apenas para itens repetidos, modais ou blocos realmente enquadrados.
- Mantenha bordas em ate 8px na maioria dos componentes, exceto drawers/modais mobile.
- Use a paleta do projeto: laranja Vulcano, azul escuro, cinzas frios e fundos claros.

## Layouts

- `AdminLayout`: area administrativa.
- `UserLayout`: area do candidato.
- No mobile administrativo, a sidebar deve dar lugar ao bottom navigation.
- O bottom navigation administrativo mobile deve usar fundo escuro do app, com item ativo em laranja.
- Conteudo deve deixar espaco para o bottom navigation usando padding inferior responsivo.

## Listas e tabelas

Padrao desktop:

- Tabela com `thead`, colunas fixas e acoes na ultima coluna.

Padrao mobile:

- Tabelas viram cards.
- Cada `td` deve ter `data-label` para exibir o label.
- Acoes devem quebrar linha sem estourar a largura.
- Texto longo deve usar `overflow-wrap: anywhere` quando necessario.
- Badges de status nao devem sofrer `text-overflow: ellipsis`; ajuste largura/overflow da celula antes de cortar texto.

## Modais e drawers

Desktop:

- Modal centralizado.
- Backdrop escuro.
- Fechar ao clicar fora quando a acao nao for destrutiva irreversivel sem confirmacao.

Mobile:

- Usar drawer bottom.
- Drawer deve ter canto superior arredondado.
- Deve respeitar `env(safe-area-inset-bottom)`.
- Deve fechar ao clicar fora.
- Deve fechar ao arrastar para baixo quando o gesto passar do limiar definido.
- Conteudo alto deve rolar dentro do painel.

## Inputs

- Inputs devem ter altura minima consistente.
- Em mobile, input e botao auxiliar podem quebrar linha para evitar texto espremido.
- Em busca mobile, o input deve manter borda propria e o botao auxiliar pode ocupar a linha abaixo.
- Placeholder deve ser exemplo curto e util.
- Use limites de `formLimits.ts`.

## Navegacao e scroll

- Ao navegar para detalhe/edicao, a tela deve abrir no topo.
- Em edicoes inline no mobile, apos clicar em editar/detalhes, role ate o painel aberto.
- Evite deixar o usuario adivinhar onde a acao apareceu.

## Acessibilidade minima

- Botoes devem ter `aria-label` quando mostrarem apenas icone.
- Elementos clicaveis por linha devem aceitar teclado (`Enter` e espaco).
- Foco visivel deve continuar perceptivel.
- Modais devem usar `role="dialog"` e `aria-modal="true"`.
