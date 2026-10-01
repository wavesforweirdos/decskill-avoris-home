import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const fromRoot = (path: string): string => resolve(import.meta.dirname, path);

export default defineConfig({
  // GitHub Pages sirve el sitio bajo /<repo>/. El workflow de deploy fija BASE_PATH; en local es "/".
  base: process.env['BASE_PATH'] ?? '/',
  plugins: [
    // Partials en build time: el HTML final es estático. Los nombres son la ruta relativa
    // al directorio, p. ej. {{> atoms/button/button}} o {{> home/home}}.
    handlebars({
      partialDirectory: [fromRoot('src/components'), fromRoot('src/pages')],
    }),
  ],
});
