# Banco de dados e Prisma

## Stack

- Banco: PostgreSQL.
- ORM: Prisma.
- Schema: `API/prisma/schema.prisma`.
- Migrations: `API/prisma/migrations`.
- Seed: `API/prisma/seed.js`.

## Modelos principais

- `Usuario`: login, perfil, criador e relacao com curriculos/candidaturas.
- `Curriculo`: dados pessoais, status, CNH, curso ativo e relacoes. O status default de novos registros e `nao_visualizado`; os valores posteriores do funil sao `visualizado`, `entrevistado`, `selecionado` e `desconsiderado`.
- `Endereco`: endereco do curriculo.
- `Atuacao`: areas/funcoes pretendidas.
- `Curso`: cursos e certificacoes.
- `Experiencia`: historico profissional.
- `Escolaridade`: formacao academica.
- `CurriculoArquivo`: PDFs anexados.
- `Vaga`: vagas publicadas.
- `Candidatura`: vinculo entre usuario e vaga.
- `NovidadeUsuario`: controle de novidades de vagas.

## Regras de modelagem

- Use `@map` para manter nomes SQL existentes quando o campo Prisma usa camelCase.
- Use `@db.Uuid` em IDs UUID.
- Use `onDelete: Cascade` quando a relacao filha nao deve sobreviver sem o pai.
- Antes de mudar cardinalidade, revise controllers, repositories e includes.

## Migrations

Fluxo recomendado:

```bash
cd API
npm run prisma:migrate
npm run prisma:generate
```

Em ambientes ja existentes:

```bash
cd API
npm run prisma:deploy
npm run prisma:generate
```

## Seed

O seed cria/atualiza o super admin de suporte:

```txt
email: suporteti@vulcano.com
tipo: superAdmin
```

Para executar:

```bash
cd API
npm run seed
```

## Cuidados

- Nunca edite migration ja aplicada em producao.
- Crie nova migration para mudancas incrementais.
- Valide impactos em seeds e dados antigos.
- A migration do status `nao_visualizado` altera apenas o default; curriculos existentes nao devem sofrer backfill.
- Nao versionar dumps com dados sensiveis novos.
