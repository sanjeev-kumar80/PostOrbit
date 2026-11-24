import { env } from 'node:process'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'https://localhost:5001'
const tlsDirectory = path.resolve(import.meta.dirname, '../server/.cert')

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    host: 'localhost',
    ...(command === 'serve' ? {
      https: {
        key: fs.readFileSync(path.join(tlsDirectory, 'localhost-key.pem')),
        cert: fs.readFileSync(path.join(tlsDirectory, 'localhost-cert.pem')),
      },
    } : {}),
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          // The browser calls Vite on the same origin; don't forward a browser
          // Origin header that could be rejected by the API's own CORS policy.
          proxy.on('proxyReq', (proxyRequest) => {
            proxyRequest.removeHeader('origin')
          })
        },
      },
    },
  },
}))
