import { defineConfig } from 'vite'

export default defineConfig({
  // Relative asset URLs so the build works from any path
  // (repo root, a /Puzzle-with-AI/ GitHub Pages subpath, or opened locally).
  base: './',
  build: {
    // Output to docs/ so GitHub Pages can serve it directly
    // (Settings -> Pages -> Source: branch master, folder /docs).
    outDir: 'docs',
    emptyOutDir: true,
    sourcemap: true,
  },
})
