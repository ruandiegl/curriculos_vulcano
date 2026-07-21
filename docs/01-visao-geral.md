# Visao geral

O projeto Curriculos Vulcano e uma plataforma de recrutamento para a Metalurgica Vulcano. Ele permite que candidatos cadastrem curriculos, anexem PDF, consultem vagas e se candidatem. Administradores gerenciam curriculos e vagas. Super administradores gerenciam usuarios administrativos e comuns.

## Publicos do sistema

- Candidato: cria e mantem seu curriculo, envia PDF, consulta vagas e realiza candidaturas.
- Admin: acessa dashboard, busca curriculos, filtra candidatos, altera status, gerencia vagas e visualiza relatorios.
- Super admin: possui as permissoes de admin e tambem gerencia usuarios.

## Modulos principais

- Autenticacao local com e-mail e senha.
- Recuperacao, redefinicao e criacao de senha.
- Cadastro e edicao de curriculo.
- Relacoes do curriculo: endereco, atuacoes, cursos, experiencias e escolaridades.
- Upload e download de PDF do curriculo.
- Gestao de vagas.
- Candidaturas.
- Dashboard administrativo com filtros.
- Relatorios.
- Gestao de usuarios pelo super admin.

## Stack resumida

- Frontend em React + TypeScript dentro de `web/curriculos_project`.
- Backend em Node.js + Express dentro de `API`.
- Banco PostgreSQL com Prisma em `API/prisma`.
- Rotas de API expostas sob `/api`.

## Convencao de idioma

A interface e as mensagens do produto sao em portugues. O codigo pode usar nomes em ingles ou portugues conforme o padrao local do arquivo, mas deve priorizar clareza e consistencia com o modulo existente.
