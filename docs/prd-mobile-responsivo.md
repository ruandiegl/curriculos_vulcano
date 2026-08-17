# PRD: Versão Mobile — Curriculos Vulcano

**ID:** PRD-003  
**Data:** 2026-08-17  
**Produto:** Curriculos Vulcano  
**Agente principal:** Product Manager (`agents/product-manager.md`)  
**Agentes de apoio:** UI UX Designer, Frontend Engineer, Tech Lead, QA Engineer, Technical Writer  

---

## Objetivo

Entregar uma experiência mobile de primeira classe para todos os perfis do sistema (candidato, admin, superAdmin) que acessem a plataforma por dispositivos móveis.

O projeto já possui `BottomNav` funcional no `AdminLayout` e breakpoints básicos de 767px, mas o **`UserLayout` ainda não tem bottom navigation mobile**, os modais são centralizados em ambos os viewports, vários cards e formulários estrangulam em telas pequenas, e não existe padrão consolidado de drawer bottom para ações secundárias.

Esta feature padroniza e expande a experiência mobile para todo o sistema, adotando os padrões de aplicativos nativos de grande escala (bottom tab navigation, bottom sheet modals, cards responsivos, touch targets adequados) sem quebrar a experiência desktop existente.

---

## Perfis afetados

| Perfil | Impacto |
|---|---|
| Candidato (`usuario`) | `UserLayout` recebe bottom tab navigation com ícones e labels. Modais de confirmação e formulários longos viram bottom sheets. Cards de vagas e seções do currículo adaptam-se a 1 coluna. |
| Admin | Expansão e refinamento do `BottomNav` existente. Todos os modais de filtro, confirmação e ação viram bottom sheets em mobile. Dashboard, tabelas e relatórios totalmente responsivos. |
| Super admin | Mesma experiência do admin mais gestão de usuários responsiva. |

---

## Diagnóstico do estado atual

Referências: `docs/07-ui-ux-responsivo.md`, `docs/03-frontend-guidelines.md`, `docs/02-arquitetura.md`.

### O que já existe

- `AdminLayout` possui `BottomNav` funcional com `BottomMorePanel` (drawer bottom) para itens excedentes.
- Breakpoint `@media (max-width: 767px)` usado em `AdminLayout/styles.ts`.
- `Main` já tem `padding-bottom` responsivo considerando o bottom nav.
- `ConfirmModal` existente é centralizado — sem comportamento de bottom sheet.
- Sidebar some em mobile (`display: none` em 767px).

### Lacunas identificadas

1. **`UserLayout`**: não possui `BottomNav`. Em mobile, apenas a sidebar colapsa; sem navegação alternativa para o candidato.
2. **Modais**: `ConfirmModal` não se transforma em bottom sheet em mobile. Modais de filtro no dashboard idem.
3. **Dashboard**: chips de filtro quebram layout em telas < 400px. Tabela principal não tem cards responsivos suficientemente polidos.
4. **Formulários longos** (perfil, endereço, experiência, educação): campos empilhados sem padding adequado para polegar.
5. **Cards de vagas** (`/vagas`, `/newJob`): larguras fixas que derramam em 375px.
6. **Relatórios**: gráficos não redimensionam em mobile; tabela de dados não vira card.
7. **Touch targets**: vários botões de ícone estão abaixo de 44x44px recomendado.
8. **Sem `safe-area-inset`** no `UserLayout`.

---

## Decisão de produto

Adotar o padrão de aplicativos nativos de grande escala para web mobile:

1. **Bottom Tab Navigation** como principal mecanismo de navegação em mobile para ambos os layouts (admin e candidato).
2. **Bottom Sheet (Drawer Bottom)** como padrão de modal em mobile — substituindo modal centralizado quando em viewport < 768px.
3. **Card-first em mobile** — tabelas sempre viram cards em mobile.
4. **Touch targets de 44px** mínimos em todos os elementos interativos.
5. **Safe Area** respeitada em todos os componentes fixos e scrolláveis.

---

## Escopo

### 1. `UserLayout` — Bottom Tab Navigation

Criar bottom navigation para candidatos paralelo ao padrão existente do `AdminLayout`.

**Itens do bottom tab do candidato** (máximo 5 visíveis, restantes em "Mais"):

| Tab | Ícone | Rota |
|---|---|---|
| Início | Home | `/profile` |
| Vagas | Briefcase | `/vagas` |
| Currículo | FileText | `/newCurriculum` |
| Formação | GraduationCap | `/new-education` |
| Mais | MoreHorizontal | BottomMorePanel |

Itens no painel "Mais" (candidato):
- Endereço → `/newAddress`
- Upload PDF → `/upload-pdf`
- Experiência → `/new-experience`
- Habilidades → `/new-skill`
- Certificações → `/new-certification`

**Comportamento:**
- Fundo claro/branco ou seguindo paleta do candidato (contrastar com o fundo escuro do admin).
- Item ativo em laranja Vulcano (`#ff8424`).
- Respeitar `env(safe-area-inset-bottom)`.
- `Main` do `UserLayout` deve ganhar `padding-bottom` responsivo igual ao `AdminLayout`.
- Sidebar continua existindo em desktop (>= 768px); bottom tab só aparece em mobile.

### 2. Bottom Sheet Modal — Padrão global

Criar componente `BottomSheet` reutilizável como alternativa mobile ao modal centralizado:

```
src/components/BottomSheet/
  index.tsx
  styles.ts
```

**Comportamento:**
- Em viewport >= 768px: funciona como modal centralizado padrão (comportamento atual).
- Em viewport < 768px: sobe como drawer do bottom.
  - Cantos superiores arredondados (`border-radius: 20px 20px 0 0`).
  - Handle bar (pílula cinza) no topo indicando que é arrastável.
  - Arrastar para baixo acima do limiar (> 80px) fecha o drawer.
  - Fechar ao clicar no backdrop.
  - Conteúdo alto scrolla internamente.
  - Respeitar `env(safe-area-inset-bottom)`.
  - `role="dialog"` + `aria-modal="true"`.
  - Animação: `translateY` de 100% → 0 com `300ms ease-out`.

**Aplicar em:**
- `ConfirmModal` (confirmação de logout e ações destrutivas).
- Modal de filtros avançados do dashboard.
- Modal de detalhes de candidatura em vagas.
- Qualquer modal novo criado a partir desta feature.

**Nota:** O `BottomMorePanel` do `AdminLayout` já tem comportamento similar — o `BottomSheet` deve ser genérico o suficiente para ser reutilizado ou substituí-lo futuramente.

### 3. Dashboard Admin — Responsividade completa

Arquivo: `web/curriculos_project/src/pages/dashboard/`

**Chips de filtro:**
- Em mobile, chips devem ter `flex-wrap: wrap` sem estourar a largura do container.
- Cada chip deve ter `white-space: nowrap` com largura máxima para o label não ser cortado.
- Scroll horizontal só se o design exigir; preferir wrap.

**Tabela → Cards:**
- Cada linha vira card em mobile com `data-label` em cada campo (padrão já documentado em `docs/07-ui-ux-responsivo.md`).
- Ações (editar, visualizar, excluir) ficam em linha abaixo sem estourar.
- Badges de status não sofrem `text-overflow: ellipsis`.

**Busca:**
- Input de busca ocupa largura total em mobile.
- Botão "Filtros" fica abaixo do input se necessário.

**Paginação:**
- Botões de paginação com touch target >= 44px.
- Em mobile, exibir apenas prev/next + página atual/total.

### 4. Formulários — Touch-friendly

Páginas afetadas: `newCurriculum`, `newAddress`, `new-education`, `new-experience`, `new-skill`, `NewCertification`, `Profile`.

**Requisitos:**
- Campos com `min-height: 48px` em mobile.
- `font-size: 16px` mínimo em inputs para evitar zoom automático no iOS.
- Labels acima dos campos (nunca ao lado em mobile).
- Grupos de campos (ex.: cidade + estado) em coluna única em mobile.
- Botões de ação (Salvar, Cancelar) com `min-height: 48px` e largura total ou divididos em linha.
- Ao clicar "Editar" em seção inline, scroll automático até o formulário aberto.

### 5. Vagas (`/vagas` e `/newJob`) — Cards responsivos

**Lista de vagas (candidato `/vagas`):**
- Cards ocupam 100% da largura em mobile.
- Informações de localização e tipo de contrato não quebram layout.
- Botão "Candidatar-se" em largura total no card mobile.

**Gestão de vagas (admin `/newJob`):**
- Tabela de vagas vira cards em mobile (padrão `data-label`).
- Formulário de nova vaga: campos em coluna única.
- Modal de candidatos inscritos vira `BottomSheet` em mobile.

### 6. Relatórios — Mobile-aware

Arquivo: `web/curriculos_project/src/pages/reports/`

**Requisitos:**
- Gráficos (SVG/Chart) respondem ao container com `width: 100%`.
- Cards de totais em grid 2 colunas em mobile, 1 coluna em < 360px.
- Tabela de dados detalhados vira cards mobile.
- Botão de exportar PDF: largura total em mobile com ícone + label.

### 7. Gestão de usuários (`/users`) — Super admin mobile

Arquivo: `web/curriculos_project/src/pages/users/`

**Requisitos:**
- Tabela de usuários vira cards em mobile.
- Formulário de criar/editar usuário em coluna única.
- Modal de confirmação de exclusão usa `BottomSheet`.

### 8. View e Edit de currículo (admin)

Arquivos: `src/pages/view/`, `src/pages/edit/`

**Requisitos:**
- Seções do currículo em coluna única em mobile.
- Botões de ação no topo ou fixos no bottom como action bar mobile.
- Select de status com touch target adequado.

### 9. Login, Registro, Recuperação de senha

Páginas: `Login`, `register`, `ForgotPassword`, `ResetPassword`, `RecoverAccess`

**Requisitos:**
- Formulários centrados com `max-width: 420px` e padding lateral generoso.
- Logo e título visíveis sem scroll.
- Botão de submit `min-height: 48px` e `width: 100%`.
- Inputs com `font-size: 16px`.

---

## Fora de escopo

- Aplicativo nativo (React Native, Capacitor, PWA instalável).
- Mudanças em rotas ou regras de autenticação/permissão.
- Redesign completo da identidade visual (manter paleta e tipografia existentes).
- Novos filtros ou funcionalidades não relacionadas ao mobile.
- Notificações push.
- Modo offline.
- Testes automatizados de UI (Playwright/Cypress) — apenas QA manual nesta entrega.

---

## Critérios de aceite

### Navegação

1. **Bottom tab candidato:** em viewport < 768px, `UserLayout` exibe bottom tab com ícones + labels; sidebar some.
2. **Bottom tab admin:** `BottomNav` existente continua funcional; itens excedentes acessíveis via "Mais".
3. **Safe area:** bottom tab e conteúdo respeitam `env(safe-area-inset-bottom)` em iOS.
4. **Ativo correto:** item ativo destacado em laranja; aria-current presente.
5. **Desktop intacto:** sidebar funciona normalmente em >= 768px.

### Bottom Sheet

6. **Transformação modal:** `ConfirmModal` e modal de filtros do dashboard sobem do bottom em mobile.
7. **Handle e gesto:** handle bar visível; arrastar > 80px para baixo fecha o drawer.
8. **Backdrop:** clicar fora fecha o drawer.
9. **Scroll interno:** conteúdo alto scrolla sem mover o drawer.
10. **Acessibilidade:** `role="dialog"`, `aria-modal="true"`, foco preso dentro do modal.

### Responsividade

11. **Dashboard chips:** chips de filtro não estaouram em 375px; sem overflow horizontal.
12. **Tabelas → cards:** todas as tabelas viram cards em mobile com `data-label` correto.
13. **Badges:** badges de status sem ellipsis; texto completo visível.
14. **Formulários:** inputs com `min-height: 48px` e `font-size: 16px` em mobile.
15. **Touch targets:** todos os botões interativos >= 44x44px em mobile.
16. **Vagas:** cards de vagas ocupam 100% da largura; botões sem overflow.
17. **Relatórios:** gráficos e cards de totais responsivos; tabela vira card.
18. **Login:** formulário legível em 375px sem scroll horizontal.

### Comportamento

19. **Scroll ao editar:** ao clicar "Editar" em seção inline, scroll até o formulário aberto.
20. **Paginação mobile:** exibe prev/next + contagem em mobile.
21. **Zoom iOS:** nenhum input dispara zoom automático.
22. **Landscape:** layout não quebra em landscape 667px x 375px.

### Qualidade

23. **Build:** `npm run build` no frontend passa sem erros.
24. **Lint:** lint focado nos arquivos alterados passa.
25. **Desktop regressão:** nenhuma tela desktop é degradada pelos novos estilos mobile.

---

## Riscos

| Risco | Mitigação |
|---|---|
| `UserLayout` reutiliza estilos do `AdminLayout` — mudanças podem afetar admin | Criar estilos do bottom tab do candidato em arquivo separado ou usar props para distinguir visual |
| `ConfirmModal` usado em múltiplos contextos — mudar comportamento pode regredir desktop | Usar `useMediaQuery` hook ou CSS media query para condicionar comportamento; não alterar lógica de callback |
| Gesto de drag no drawer conflitar com scroll vertical de listas longas | Iniciar drag apenas pelo handle bar; não interceptar scroll na área de conteúdo |
| `font-size: 16px` em inputs pode aumentar tamanho percebido no desktop | Aplicar apenas via media query mobile; desktop mantém tamanho atual |
| Múltiplos modais abertos simultaneamente | Garantir z-index consistente; fechar modal anterior ao abrir novo |
| Relatórios com biblioteca de gráficos — `width: 100%` pode não funcionar | Verificar se a lib suporta `responsive: true`; adaptar container se necessário |

---

## Dependências entre camadas

1. **UI UX Designer:** define especificações visuais do bottom tab candidato, estados, animações.
2. **Frontend Engineer:** implementa `UserLayout` bottom nav, `BottomSheet`, refatora tabelas e formulários.
3. **Tech Lead:** revisa padrão do `BottomSheet` para garantir reuso; verifica que `ConfirmModal` não quebra contratos.
4. **QA Engineer:** testa em dispositivos reais (iOS Safari, Android Chrome) e em desktop para regressão.
5. **Technical Writer:** atualiza `docs/07-ui-ux-responsivo.md` com os novos padrões consolidados.

Não há mudança de API, banco de dados ou permissões JWT.

---

## Direção técnica (Tech Lead)

- Preservar o padrão `page → service → controller → repository → Prisma` (sem impacto nesta feature).
- `BottomSheet` deve aceitar `children`, `isOpen`, `onClose` e opcionalmente `title`.
- `useBottomSheet` hook encapsula lógica de gesto de drag.
- `useMediaQuery('(max-width: 767px)')` hook centralizado em `src/hooks/useMediaQuery.ts`.
- Manter `ConfirmModal` como wrapper: internamente usa `BottomSheet` com lógica de confirmação.
- `BottomNav` do `UserLayout` pode reutilizar `BottomNavButton`, `BottomMorePanel`, `BottomMoreBackdrop` e `BottomMoreList` do `AdminLayout/styles.ts` com tema de candidato via props.

### Módulos afetados

**Novos:**
- `src/components/BottomSheet/index.tsx`
- `src/components/BottomSheet/styles.ts`
- `src/hooks/useMediaQuery.ts`
- `src/hooks/useBottomSheet.ts`

**Modificados:**
- `src/components/UserLayout/index.tsx` — adicionar bottom tab
- `src/components/AdminLayout/styles.ts` — exportar tokens reusáveis
- `src/components/ConfirmModal.tsx` — usar `BottomSheet` internamente
- `src/pages/dashboard/index.tsx`
- `src/pages/jobs/index.tsx`
- `src/pages/newJob/index.tsx`
- `src/pages/reports/index.tsx`
- `src/pages/users/index.tsx`
- `src/pages/view/index.tsx`
- `src/pages/edit/index.tsx`
- `src/pages/newCurriculum/index.tsx`
- `src/pages/newAddress/index.tsx`
- `src/pages/new-education/index.tsx`
- `src/pages/new-experience/index.tsx`
- `src/pages/new-skill/index.tsx`
- `src/pages/NewCertification/index.tsx`
- `src/pages/Profile/index.tsx`
- `src/pages/Login/index.tsx`
- `src/pages/register/index.tsx`
- `src/pages/ForgotPassword/index.tsx`

**Documentação:**
- `docs/07-ui-ux-responsivo.md` — padrão `BottomSheet` e bottom tab candidato
- `docs/03-frontend-guidelines.md` — referenciar `useMediaQuery` e `BottomSheet`
- `docs/README.md` — registrar este PRD

---

## Sequência de implementação

1. Hook `useMediaQuery` — base para lógica condicional.
2. Componente `BottomSheet` — componente central desta feature.
3. `ConfirmModal` refatorado — usa `BottomSheet`; valida regressão desktop.
4. `UserLayout` + bottom tab — navegação mobile do candidato.
5. Dashboard — chips e tabela→card + filtros como `BottomSheet`.
6. Formulários candidato (newCurriculum, newAddress, new-education, new-experience, new-skill, NewCertification, Profile).
7. Vagas (candidato e admin).
8. View e Edit de currículo (admin).
9. Relatórios.
10. Usuários (super admin).
11. Login, registro e recuperação de senha.
12. Docs — atualizar `07-ui-ux-responsivo.md`.
13. Build, lint e QA manual.

---

## Plano de teste (QA)

### Dispositivos alvo

| Dispositivo | Viewport |
|---|---|
| iPhone SE 2ª gen | 375×667 |
| iPhone 14 | 390×844 |
| Samsung Galaxy S21 | 360×800 |
| iPad | 768×1024 — limiar do breakpoint; deve mostrar sidebar |
| Desktop | 1440×900 — regressão |

### Bottom tab candidato

- Em 375px, bottom tab exibe 4 tabs + "Mais".
- Clicar "Mais" abre `BottomMorePanel` com itens restantes.
- Clicar fora do painel fecha.
- Scroll de conteúdo não é bloqueado pelo bottom tab.
- `env(safe-area-inset-bottom)` aplicado corretamente (barra home iOS).

### Bottom Sheet

- `ConfirmModal` de logout: sobe do bottom em mobile, centralizado em desktop.
- Arrastar handle > 80px fecha o sheet.
- Conteúdo longo scrolla sem mover o sheet.
- Tab key navega dentro do modal; Escape fecha.
- VoiceOver/TalkBack anuncia o dialog corretamente.

### Dashboard

- Chips de filtro em 375px: sem overflow horizontal, sem texto cortado.
- Tabela em 375px: cada linha vira card com labels.
- Abrir modal de filtros em mobile: exibe como bottom sheet.
- Botões de paginação com toque responsivo.

### Formulários

- Tocar input em iOS: sem zoom automático (font-size >= 16px).
- Campos de cidade + estado em coluna única.
- Salvar: botão em largura total, altura >= 48px.

### Regressão desktop

- Sidebar admin funcional em 1440px.
- Modais centralizados em 1440px.
- Tabelas com thead e colunas em 1440px.
- Formulários com layout multi-coluna onde existia.

---

## Mapeamento de skills para IA executora

> Esta seção orienta o modelo de IA responsável pela implementação, mapeando as competências necessárias para cada entregável.

### Skill: UI/UX Pro Mobile

**Usar quando:** Definir especificações visuais do bottom tab candidato, animações do drawer, touch feedback, estados hover/active/focus.

**Fontes de contexto:**
- `docs/07-ui-ux-responsivo.md`
- `src/components/AdminLayout/styles.ts` (padrão existente de BottomNav)
- Padrões de referência: iOS Human Interface Guidelines, Material Design 3

**Decisões a tomar:**
- Cor de fundo do bottom tab do candidato (fundo claro vs fundo escuro).
- Tamanho e peso dos ícones do bottom tab candidato.
- Duração e easing da animação do BottomSheet (sugestão: `300ms cubic-bezier(0.32, 0.72, 0, 1)`).
- Cor e opacidade do handle bar.
- Feedback de toque (escurecer fundo do item).

### Skill: Frontend Design System (Styled Components)

**Usar quando:** Criar `styles.ts` de novos componentes e modificar estilos existentes.

**Regras obrigatórias:**
- Usar `styled-components` (não TailwindCSS, não CSS Modules).
- Nomear componentes styled em PascalCase.
- Usar `@media (max-width: 767px)` como breakpoint primário mobile.
- Usar `env(safe-area-inset-bottom)` em `padding-bottom` de elementos fixos.
- Props de estilo com prefixo `$` (ex.: `$active`, `$open`, `$danger`).
- Exportar tokens de cor de `AdminLayout/styles.ts` quando reusados.

**Componentes novos — interface esperada:**

```ts
// BottomSheet/styles.ts
export const Backdrop = styled.div`...`    // overlay escuro
export const Sheet = styled.div`...`       // painel branco/escuro
export const Handle = styled.div`...`      // pílula cinza no topo
export const SheetContent = styled.div`...` // área scrollável
```

### Skill: React + TypeScript (Componentes e Hooks)

**Usar quando:** Implementar `BottomSheet`, `useMediaQuery`, `useBottomSheet`, bottom tab do `UserLayout`.

**Padrões obrigatórios:**
- Props tipadas com `type` ou `interface`.
- Hooks em `src/hooks/`.
- Componentes em `src/components/`.
- Usar `useRef` + `addEventListener` para gesto de drag (sem bibliotecas externas).
- `useEffect` com cleanup para event listeners.
- `aria-modal`, `role`, `aria-label` em todos os componentes de dialog.

**Interfaces esperadas:**

```ts
// useBottomSheet
function useBottomSheet(onClose: () => void): {
  sheetRef: React.RefObject<HTMLDivElement>;
  handleRef: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
}

// useMediaQuery
function useMediaQuery(query: string): boolean

// BottomSheet props
type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
```

### Skill: Acessibilidade Web (a11y)

**Usar quando:** Implementar `BottomSheet`, bottom tabs, e qualquer componente interativo novo.

**Checklist obrigatório:**
- `role="dialog"` + `aria-modal="true"` em modais.
- `aria-label` em botões que mostram apenas ícone.
- Focus trap dentro de modais abertos.
- Fechar modal com `Escape`.
- `aria-current="page"` no item ativo do bottom tab.
- Elementos interativos aceitam `Enter` e `Space`.
- Foco visível em `focus-visible` com outline laranja `rgba(255, 132, 36, 0.55)`.

### Skill: Responsive CSS Mobile-First

**Usar quando:** Adaptar tabelas, formulários, cards e listas para mobile.

**Regras para tabela → card:**

```css
/* Desktop: tabela padrão */

@media (max-width: 767px) {
  thead { display: none; }
  tr { display: block; border-radius: 8px; margin-bottom: 12px; }
  td { display: flex; justify-content: space-between; }
  td::before { content: attr(data-label); font-weight: 700; }
}
```

**Regras para formulários mobile:**

```css
@media (max-width: 767px) {
  input, select, textarea { font-size: 16px; min-height: 48px; }
  .form-row { flex-direction: column; }
  .form-actions button { width: 100%; min-height: 48px; }
}
```

---

## Próxima ação recomendada

Iniciar pela sequência definida em "Sequência de implementação", com o **Frontend Engineer** como executor principal e o **UI UX Designer** validando visualmente cada entregável.

O **Tech Lead** deve revisar a API pública do `BottomSheet` e do `useBottomSheet` antes da implementação das páginas.

O **QA Engineer** deve testar cada critério de aceite em dispositivo real ou simulador Chrome DevTools antes de marcar a feature como concluída.
