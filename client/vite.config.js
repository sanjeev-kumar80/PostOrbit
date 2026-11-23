import { env } from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:5001'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
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
})
