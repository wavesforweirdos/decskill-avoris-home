import { readFileSync } from 'node:fs';
import { URL } from 'node:url';

// BEM: bloque, bloque__elemento y bloque--modificador, en kebab-case.
// Solo dos prefijos: `l-` (layout) y `u-` (utilidades). Los componentes van sin prefijo
// porque la carpeta atoms/molecules/organisms ya indica qué son.
const BEM =
  /^(?:[lu]-)?[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$/;

// Tokens primitivos. Los nombres se leen de settings/_primitives.scss al cargar la configuración,
// así la lista no puede quedar desactualizada. Fuera de settings/ ningún archivo puede usarlos:
// los componentes consumen solo los semánticos. Dentro de settings/ la regla se apaga con su
// propio .stylelintrc.json.
const primitivesSource = readFileSync(
  new URL('./src/styles/settings/_primitives.scss', import.meta.url),
  'utf8',
);
const primitiveNames = [...primitivesSource.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map(
  ([, name]) => name,
);
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const usesPrimitive = new RegExp(
  `var\\(\\s*(?:${primitiveNames.map(escapeRegExp).join('|')})\\s*[,)]`,
);

// Longitud con unidad y distinta de cero (8px, 1.5rem, .5em).
const rawLength = /(?<![\w.#-])(?:0*[1-9]\d*(?:\.\d+)?|0?\.\d*[1-9]\d*)(?:px|rem|em)\b/;

// LIMITACIONES de las reglas de tokens (el linter no lo ve todo):
// - Un primitivo pasado como argumento de un @include (`@include x(var(--color-primary-700))`) o
//   construido con interpolación (`var(--color-#{$n})`) no se detecta.
// - Las longitudes sueltas solo se vigilan en las propiedades de la lista (espaciado, tipografía
//   y radios). width, height o inset no se comprueban.
// - Los estilos inline en HTML no son CSS: los caza html-validate (no-inline-style).
export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-class-pattern': [
      BEM,
      { message: (selector) => `Expected "${selector}" to follow BEM (block__element--modifier)` },
    ],
    'declaration-no-important': true,
    'color-no-hex': true,
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],
    'declaration-property-value-disallowed-list': [
      {
        '/.*/': [usesPrimitive],
        '/^(margin|padding|gap|row-gap|column-gap|font-size|line-height|border-radius)(-|$)/': [
          rawLength,
        ],
      },
      {
        message: (property, value) =>
          `Unexpected "${property}: ${value}": use a semantic token, not a primitive or a raw length`,
      },
    ],
  },
};
