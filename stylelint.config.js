// BEM: bloque, bloque__elemento y bloque--modificador, en kebab-case.
// Solo dos prefijos: `l-` (layout) y `u-` (utilidades). Los componentes van sin prefijo
// porque la carpeta atoms/molecules/organisms ya indica qué son.
const BEM =
  /^(?:[lu]-)?[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$/;

export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-class-pattern': [
      BEM,
      { message: (selector) => `Expected "${selector}" to follow BEM (block__element--modifier)` },
    ],
  },
};
