# Deploy do front na Locaweb com API local

## 1. Configurar o front

O front le a URL da API pela variavel `VITE_API_URL`.

Arquivo atual:

```text
web/curriculos_project/.env
```

Configuracao atual:

```env
VITE_API_URL=http://192.168.71.130:3001/api
```

Esse endereco precisa ser acessivel pelo navegador que abrir o site publicado.

Importante:
- `192.168.x.x` funciona apenas dentro da mesma rede local.
- Se o site da Locaweb abrir em `https://`, o navegador pode bloquear chamadas para API `http://` por mixed content.
- Para acesso externo real, exponha a API com HTTPS, por exemplo via dominio, proxy, Cloudflare Tunnel ou ngrok.

## 2. Configurar CORS da API

Na API, copie:

```text
API/.env.locaweb-front-local-api.example
```

para:

```text
API/.env
```

Depois ajuste:

```env
CORS_ORIGIN="https://SEU-DOMINIO-LOCAWEB.com.br,http://localhost:5173,http://192.168.71.130:5173"
FRONTEND_URL="https://SEU-DOMINIO-LOCAWEB.com.br"
```

Reinicie a API depois de alterar o `.env`.

## 3. Gerar build do front

```powershell
cd D:\Suporte.CesarGarcia\Desktop\curriculos_vulcano\web\curriculos_project
npm.cmd run build
```

## 4. Enviar para a Locaweb

No FTP, entre em:

```text
public_html
```

Envie o conteudo de:

```text
web/curriculos_project/dist
```

Ou seja, envie os itens dentro de `dist`, por exemplo:

```text
index.html
.htaccess
assets/
M.svg
M.ico
icons.svg
favicon.svg
```

O resultado no FTP deve ficar assim:

```text
public_html/index.html
public_html/.htaccess
public_html/assets/...
```

Nao envie como:

```text
public_html/dist/index.html
```

## 5. Testes

1. Abra a API local:

```text
http://192.168.71.130:3001/api/health
```

Deve responder:

```json
{"status":"ok"}
```

2. Abra o site publicado na Locaweb.
3. Abra o DevTools na aba Network.
4. Tente login.
5. A chamada deve ir para:

```text
http://192.168.71.130:3001/api/login
```

Se aparecer erro de CORS, ajuste `CORS_ORIGIN` na API.

Se aparecer erro de mixed content, o front esta em HTTPS chamando API HTTP. Nesse caso use HTTPS na API ou um tunel HTTPS.
