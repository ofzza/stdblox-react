/**
 * Vite config of the showcase application. It is built from `showcase/` into `showcase/dist/`, reading the library sources from `../src/`
 */

import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  // Relative asset URLs, so the built showcase works under any sub-path, such as a GitHub Pages project site
  base: './',
  plugins: [react()],
  // The showcase reads the library sources and the repository README from outside its own root
  server: { fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } },
  build: { outDir: 'dist', emptyOutDir: true },
});
