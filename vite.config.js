import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function servePrivateIndex() {
  const handle = (req, res, next) => {
    const [pathname, query] = (req.url || '').split('?')
    const qs = query ? `?${query}` : ''

    // Without a trailing slash, relative CSS/images resolve at the site root.
    if (pathname === '/private') {
      res.statusCode = 302
      res.setHeader('Location', `/private/${qs}`)
      res.end()
      return
    }

    if (pathname === '/private/') {
      req.url = `/private/index.html${qs}`
    }
    next()
  }

  return {
    name: 'serve-private-index',
    configureServer(server) {
      server.middlewares.use(handle)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), servePrivateIndex()],
  publicDir: 'public',
  server: {
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})

