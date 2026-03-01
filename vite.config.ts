import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

// Plugin: dev server serves posts/ as static; build copies posts assets to dist/
function postsAssetsPlugin() {
  const projectRoot = process.cwd()
  return {
    name: 'posts-assets',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const prefix = '/RShinz-World/posts/'
        if (!req.url?.startsWith(prefix)) return next()
        const relPath = decodeURIComponent(req.url.slice('/RShinz-World/'.length))
        const filePath = path.join(projectRoot, relPath)
        try {
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const mimes: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.gif': 'image/gif',
              '.webp': 'image/webp',
              '.svg': 'image/svg+xml',
            }
            res.setHeader('Content-Type', mimes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream')
            res.end(fs.readFileSync(filePath))
            return
          }
        } catch (_) { }
        next()
      })
    },
    closeBundle() {
      const postsDir = path.join(projectRoot, 'posts')
      const outDir = path.join(projectRoot, 'dist')
      if (!fs.existsSync(postsDir)) return
      for (const slug of fs.readdirSync(postsDir)) {
        const assetsDir = path.join(postsDir, slug, 'assets')
        if (!fs.existsSync(assetsDir)) continue
        const destDir = path.join(outDir, 'posts', slug, 'assets')
        fs.mkdirSync(destDir, { recursive: true })
        for (const file of fs.readdirSync(assetsDir)) {
          fs.copyFileSync(path.join(assetsDir, file), path.join(destDir, file))
        }
      }
    },
  }
}

export default defineConfig({
  base: '/RShinz-World/',
  plugins: [vue(), postsAssetsPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
