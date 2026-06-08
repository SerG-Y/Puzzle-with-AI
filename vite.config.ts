import { defineConfig } from 'vite'

export default defineConfig({
  // Relative asset URLs so the build works from any path
  // (repo root, a /Puzzle-with-AI/ GitHub Pages subpath, or opened locally).
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
