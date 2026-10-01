# Waveless · Home

Maquetación de la home de Waveless a partir del Figma de la prueba técnica de Decskill (cliente Avoris).

> Proyecto en desarrollo. Este README es el inicial; se ampliará con las decisiones técnicas, el sistema de diseño y los resultados de la auditoría.

## Requisitos

- Node 24 (ver `.nvmrc`). Con nvm: `nvm use`.
- npm 11 o superior.

## Instalación y scripts

```bash
npm ci               # instala las dependencias y activa los hooks de Git (Husky)
npm run dev          # servidor de desarrollo
npm run build        # build de producción en dist/
npm run preview      # sirve dist/ en local
npm run lint         # ESLint, Stylelint y comprobación de formato (Prettier)
npm run typecheck    # TypeScript estricto
npm run lint:html    # html-validate sobre dist/ (hay que ejecutar antes npm run build)
npm run format       # aplica Prettier
```

### Saltos de línea en Windows

Todo el repositorio usa saltos de línea LF. Lo fijan `.gitattributes` (`* text=auto eol=lf`), `.editorconfig` (`end_of_line = lf`) y Prettier (`endOfLine: lf`). Para que Git no los convierta al trabajar en Windows, configura en el repositorio:

```bash
git config core.autocrlf false
```

## Compatibilidad con navegadores

Navegadores objetivo: **Chrome 120**, **Safari 16.4** y **Firefox 120**, o posteriores. Es el valor de `build.cssTarget` en `vite.config.ts`: con esos mínimos el CSS no necesita prefijos (`-webkit-mask`) y la build no los duplica.

| Navegador | Estado                                               |
| --------- | ---------------------------------------------------- |
| Chrome    | Verificado                                           |
| Firefox   | Pendiente de verificar (se revisará en la auditoría) |
| Safari    | Pendiente de verificar, en macOS (misma auditoría)   |

`text-wrap: balance` en los títulos es una mejora progresiva: los navegadores que no lo soportan muestran el texto sin equilibrar.

## Decisiones técnicas

| Decisión                        | Motivo                                                                                                          | Alternativa descartada                        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Vite sin framework              | Build y servidor de desarrollo rápidos. La prueba pide maquetación estática, no una SPA                         | React, Angular, Vue                           |
| TypeScript estricto             | `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes` obligan a tratar los elementos del DOM que no existan | JavaScript sin tipos                          |
| Tokens primitivos → semánticos  | Los componentes solo conocen intenciones; cambiar de marca no toca ninguno. Stylelint lo hace cumplir           | Un solo nivel de variables, o valores sueltos |
| SCSS sin Tailwind               | Un CSS de componentes legible, donde se ven las decisiones de layout                                            | Tailwind, Bootstrap                           |
| BEM + Atomic Design + ITCSS     | Nombres predecibles, carpetas que dicen qué es cada pieza y capas de menos a más específicas                    | CSS Modules, utility-first                    |
| Partials de Handlebars          | El markup se reutiliza sin repetirlo y el HTML final es estático: nada se genera en el navegador                | HTML repetido, plantillas en JavaScript       |
| Fuentes variables en local      | Syne y Nunito en WOFF2 latino, sin terceros, un archivo por familia y preload de la que pinta el hero           | Google Fonts, un archivo por peso             |
| Iconos SVG como máscara CSS     | El color sale de `currentcolor` (de los tokens), los SVG del Figma no se tocan y se ven en alto contraste       | `<img>` por icono, SVG en línea, sprite       |
| Tipografía fluida con `clamp()` | Título y subtítulo interpolan entre los tamaños del Figma de cada breakpoint en lugar de saltar                 | Solo cambios por media query                  |

## Sistema de diseño y multimarca

Los estilos se organizan en dos niveles de variables CSS. Un componente solo usa los de la derecha:

```
primitivos                  →   semánticos                    →   componentes
(settings/_primitives)          (settings/_semantic,              (components/**)
                                 settings/brands/)

--color-primary-700         →   --color-primary               →   .button--primary {
                                                                    background-color: var(--color-primary);
                                                                  }
```

Los primitivos son la paleta cruda del Figma y los semánticos expresan intención (`--color-primary`, `--space-section`, `--text-button`). Una regla de Stylelint impide usar un primitivo, un hex o una longitud suelta fuera de `settings/`, así que la separación no depende de la buena voluntad.

Hoy solo está implementada la marca Waveless (`settings/brands/_default.scss`), pero la estructura está preparada para más. Añadir una marca nueva, como posible evolución, son tres pasos y no toca ningún componente:

1. Añadir su paleta como primitivos en `settings/_primitives.scss`.
2. Crear `settings/brands/_<marca>.scss` con `[data-brand='<marca>'] { … }`, reasignando los mismos semánticos de color que `_default.scss`.
3. Reenviarlo desde `settings/_index.scss` y poner `data-brand="<marca>"` en la etiqueta `<html>`.
