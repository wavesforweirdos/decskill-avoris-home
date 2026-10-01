import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const fromRoot = (path: string): string => resolve(import.meta.dirname, path);

export default defineConfig({
  // GitHub Pages sirve el sitio bajo /<repo>/. El workflow de deploy fija BASE_PATH; en local es "/".
  base: process.env['BASE_PATH'] ?? '/',
  build: {
    // Con estos mínimos (todos soportan mask sin prefijo) el CSS no duplica cada icono como
    // -webkit-mask-image y mask-image, y no se infla con data URIs repetidos.
    cssTarget: ['chrome120', 'safari16.4', 'firefox120'],
  },
  css: {
    preprocessorOptions: {
      // Permite escribir @use 'styles/tools' desde cualquier componente, sin rutas relativas largas.
      scss: { loadPaths: [fromRoot('src')] },
    },
  },
  plugins: [
    // Partials en build time: el HTML final es estático. Los nombres son la ruta relativa
    // al directorio, p. ej. {{> atoms/button/button}} o {{> home/home}}.
    handlebars({
      partialDirectory: [fromRoot('src/components'), fromRoot('src/pages')],
    }),
  ],
});
