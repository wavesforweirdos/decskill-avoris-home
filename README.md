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

El menú de navegación por debajo de 1024 px usa `@media (scripting: enabled)` para plegarse solo si hay JavaScript. Los navegadores que no conocen esa media query, como Safari anterior a 17, muestran la navegación siempre desplegada: es menos compacta pero funciona igual.

## Decisiones técnicas

| Decisión                             | Motivo                                                                                                                                                                | Alternativa descartada                   |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Vite sin framework                   | Build y servidor de desarrollo rápidos. La prueba pide maquetación estática, no una SPA                                                                               | React, Angular, Vue                      |
| TypeScript estricto                  | `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes` obligan a tratar los elementos del DOM que no existan                                                       | JavaScript sin tipos                     |
| Colores en tres niveles, como Brand  | Variables de Sass (global → semántico → componente) en una carpeta, con los nombres de Figma. Los componentes solo usan las de componente y Stylelint lo hace cumplir | Variables CSS por marca, valores sueltos |
| Multimarca por compilación           | Cada marca genera su propio CSS desde un solo archivo de colores, sin código extra en el navegador                                                                    | Cambio de marca en el navegador          |
| Resto de tokens como propiedades CSS | Espaciado, tamaños, radios, sombras y tipografía no dependen de la marca y se pueden inspeccionar en las DevTools                                                     | Variables de Sass para todo              |
| SCSS sin Tailwind                    | Un CSS de componentes legible, donde se ven las decisiones de layout                                                                                                  | Tailwind, Bootstrap                      |
| BEM + Atomic Design + ITCSS          | Nombres predecibles, carpetas que dicen qué es cada pieza y capas de menos a más específicas                                                                          | CSS Modules, utility-first               |
| Partials de Handlebars               | El markup se reutiliza sin repetirlo y el HTML final es estático: nada se genera en el navegador                                                                      | HTML repetido, plantillas en JavaScript  |
| Fuentes variables en local           | Syne y Nunito en WOFF2 latino, sin terceros, un archivo por familia y preload de la que pinta el hero                                                                 | Google Fonts, un archivo por peso        |
| Iconos SVG como máscara CSS          | El color sale de `currentcolor` (de los tokens), los SVG del Figma no se tocan y se ven en alto contraste                                                             | `<img>` por icono, SVG en línea, sprite  |
| Tipografía fluida con `clamp()`      | Título y subtítulo interpolan entre los tamaños del Figma de cada breakpoint en lugar de saltar                                                                       | Solo cambios por media query             |

## Sistema de diseño y multimarca

Los colores siguen los tres niveles de la página Brand del Figma, como variables de Sass dentro de una carpeta, `src/styles/settings/brand/`, con un archivo por nivel (`_global.scss`, `_semantic.scss`) y uno por componente en `components/` (`_button.scss`, `_tag.scss`…). Cada nivel solo usa los anteriores, y un componente solo usa el último:

```
global                      →   semántico                              →   componente
(la paleta)                     (fondo, texto, borde, icono)               (con los nombres de Figma)

$primary-700                →   $color-background-primary-dark-default →   $button-primary-background-default
                                                                            └─ .button--primary { … }
```

Los nombres de las variables de componente son los de Figma cambiando la barra por un guion: `button/primary-background-default` pasa a `$button-primary-background-default`. Una regla de Stylelint impide usar fuera de `settings/` una variable de color global o semántica, un hex o una longitud suelta, así que la separación no depende de la buena voluntad. El resto de tokens (espaciado, tamaños, radios, sombras y tipografía) no dependen de la marca y son propiedades CSS.

### Cambiar de marca

La multimarca es por compilación: cada marca genera su propio CSS a partir del archivo de colores, y el color se resuelve al compilar, no en el navegador. Hoy solo está la marca Waveless. Para otro proyecto:

1. Ajustar la paleta de `brand/_global.scss` (los colores globales).
2. Revisar `brand/_semantic.scss` y `brand/components/` solo si el diseño de esa marca mapea los colores de otra forma.
3. Compilar con `npm run build`.

## Mejoras que haría con más tiempo

- **Estado abierto del menú de navegación:** el Figma no lo dibuja. Hoy se muestran las mismas pestañas y el botón "Reserva" apilados bajo la barra, sin diseño propio; falta que diseño defina su aspecto (fondo, separación, marcador de la pestaña activa) para sustituir esta versión mínima.
