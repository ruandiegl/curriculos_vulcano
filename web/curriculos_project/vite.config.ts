import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

function assertProductionApiUrl(apiUrl: string | undefined) {
  if (!apiUrl) {
    throw new Error('VITE_API_URL precisa estar configurada para o build de produção.')
  }

  let parsedUrl: URL

  try {
    parsedUrl = new URL(apiUrl)
  } catch {
    throw new Error('VITE_API_URL precisa ser uma URL válida.')
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('VITE_API_URL precisa usar HTTPS no build de produção.')
  }

  const blockedHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1'])
  if (blockedHosts.has(parsedUrl.hostname)) {
    throw new Error('VITE_API_URL não pode apontar para um host local no build de produção.')
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if (mode === 'production') {
    assertProductionApiUrl(env.VITE_API_URL)
  }

  return {
    server: {
      host: '0.0.0.0',
      port: 5181,
      strictPort: true,
    },
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
  }
})
