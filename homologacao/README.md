# Homologação local da versão 2.0

Este diretório mantém uma cópia local da API antiga e dois PostgreSQL isolados para comparar o estado atual com o estado migrado.

| Ambiente | Banco | Porta | API sugerida |
|---|---|---:|---:|
| V1 / produção atual | `curriculos-homolog-v1` | `55432` | `3113` |
| V2 / nova versão | `curriculos-homolog-v2` | `55433` | `3112` |

## Subir os bancos

```powershell
docker compose -f homologacao/docker-compose.yml up -d
docker compose -f homologacao/docker-compose.yml ps
```

As bases foram restauradas a partir do dump do VPS. A V1 permanece no schema antigo; a V2 recebeu as migrations da aplicação nova.

Não executar `down -v` sem uma nova cópia dos dumps: isso remove os volumes locais de homologação.

## API nova contra a V2

```powershell
$env:DATABASE_URL = "postgresql://postgres:homologacao@localhost:55433/curriculos?schema=public"
$env:PORT = "3112"
npm --prefix API run prisma:generate
npm --prefix API run prisma:deploy
npm --prefix API start
```

## Front novo

Configure `VITE_API_URL` para `http://127.0.0.1:3112/api` e execute:

```powershell
npm --prefix web/curriculos_project run dev -- --port 5182
```

O arquivo `.env` local não deve ser substituído por credenciais reais nem versionado com segredos.
