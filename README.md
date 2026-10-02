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

| Decisión                                             | Motivo                                                                                                                                                                                                                                                                                                                            | Alternativa descartada                                             |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Vite sin framework                                   | Build y servidor de desarrollo rápidos. La prueba pide maquetación estática, no una SPA                                                                                                                                                                                                                                           | React, Angular, Vue                                                |
| TypeScript estricto                                  | `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes` obligan a tratar los elementos del DOM que no existan                                                                                                                                                                                                                   | JavaScript sin tipos                                               |
| Colores en tres niveles, como Brand                  | Variables de Sass (global → semántico → componente) en una carpeta, con los nombres de Figma. Los componentes solo usan las de componente y Stylelint lo hace cumplir                                                                                                                                                             | Variables CSS por marca, valores sueltos                           |
| Multimarca por compilación                           | Cada marca genera su propio CSS desde un solo archivo de colores, sin código extra en el navegador                                                                                                                                                                                                                                | Cambio de marca en el navegador                                    |
| Resto de tokens como propiedades CSS                 | Espaciado, tamaños, radios, sombras y tipografía no dependen de la marca y se pueden inspeccionar en las DevTools                                                                                                                                                                                                                 | Variables de Sass para todo                                        |
| SCSS sin Tailwind                                    | Un CSS de componentes legible, donde se ven las decisiones de layout                                                                                                                                                                                                                                                              | Tailwind, Bootstrap                                                |
| BEM + Atomic Design + ITCSS                          | Nombres predecibles, carpetas que dicen qué es cada pieza y capas de menos a más específicas                                                                                                                                                                                                                                      | CSS Modules, utility-first                                         |
| Partials de Handlebars                               | El markup se reutiliza sin repetirlo y el HTML final es estático: nada se genera en el navegador                                                                                                                                                                                                                                  | HTML repetido, plantillas en JavaScript                            |
| Filtros: aside en desktop y dialog en tablet y móvil | El panel es siempre un <aside> estático (visible desde 1280 px y sin JavaScript). Por debajo de 1280 px, con JavaScript, el mismo formulario se mueve a un <dialog> modal al pulsar "Ver filtros" y vuelve al aside al cerrar; un <dialog> siempre abierto en desktop se anunciaría como diálogo y no como contenido de la página | Un <dialog> abierto en todos los anchos, dos copias del formulario |
| Grupos de filtros con details y summary              | Se abren sin JavaScript, el teclado y el estado expandido son accesibles de serie, el buscador del navegador abre el grupo que contiene el texto y el estado se conserva al mover el formulario                                                                                                                                   | Botones con aria-expanded y aria-controls                          |
| Contenido de ejemplo de los filtros                  | Destinos, alojamientos, las 21 aventuras de "Ver 21 más" y los textos de los tooltips no están en el Figma: son de ejemplo y viven en src/data/filters.json                                                                                                                                                                       | Escribir cada opción en el HTML                                    |
| Fuentes variables en local                           | Syne y Nunito en WOFF2 latino, sin terceros, un archivo por familia y preload de la que pinta el hero                                                                                                                                                                                                                             | Google Fonts, un archivo por peso                                  |
| Iconos SVG como máscara CSS                          | El color sale de `currentcolor` (de los tokens), los SVG del Figma no se tocan y se ven en alto contraste                                                                                                                                                                                                                         | `<img>` por icono, SVG en línea, sprite                            |
| Tipografía fluida con `clamp()`                      | Título y subtítulo interpolan entre los tamaños del Figma de cada breakpoint en lugar de saltar                                                                                                                                                                                                                                   | Solo cambios por media query                                       |

## Imágenes y carrusel del hero

La foto del hero se sirve en WebP (todos los navegadores objetivo lo soportan), sin PNG de respaldo: `hero-1440.webp` y `hero-2880.webp` (1x y 2x) para anchos desde 744 px, y `hero-mobile-744.webp` y `hero-mobile-1488.webp` por debajo, con el recorte de la parte izquierda que enseña el diseño. Así un móvil descarga unos 20 KB (47 KB en pantallas 2x) en lugar de los 800 KB del PNG original. La primera imagen se pide con `fetchpriority="high"` por ser la candidata a LCP y reserva su espacio con `width` y `height`.

El carrusel funciona sin JavaScript (pista con `scroll-snap`) y `hero.ts` añade las flechas, el indicador y el anuncio de la posición. No hay avance automático.

## Cards y desglose de precios

Las cards son una rejilla de columnas de 264 px: 1 en móvil, 2 desde 744 px y 3 desde 1024 px, siempre con ese número de columnas aunque el ancho dé para más. Desde 1280 px el catálogo reserva a la izquierda una columna de 264 px para los filtros, solo con el grid, sin ningún elemento vacío. Los dos grupos de la home repiten el contenido de ejemplo del diseño: el primero con tres cards y el segundo con seis, como en los layouts de desktop y tablet grande. Cada foto se sirve en WebP a 264 y 528 px (`srcset` con `sizes`) y con `loading="lazy"`.

El desglose de precios es un `<dialog>` dentro de cada card que se abre de dos maneras según el ancho. Por debajo de 744 px es un modal a pantalla completa (`showModal()`), como la variante móvil del diseño: el navegador mantiene el foco dentro y cierra con Escape. Desde 744 px es un popover no modal de 400 px centrado sobre la card (`show()`): se cierra con Escape, con el botón de cerrar o con un clic fuera, y solo hay uno abierto a la vez. El CSS decide el modo con una propiedad (`--price-popover-modal`) que lee el script, así el punto de corte no se repite en TypeScript. No usa la API nativa `popover`, que no soportan Firefox 120 ni Safari 16.4. Sin JavaScript el botón "Ver desglose" no se muestra.

## Filtros

El panel de filtros es un `<aside>` con un formulario que, desde 1280 px, ocupa la columna reservada del catálogo y se ve también sin JavaScript. Ahí se queda fijo al desplazar la página (`position: sticky`, a 24 px del borde superior) y se detiene al acabar su fila, sin pisar el pie; si no cabe en la pantalla, tiene alto máximo y scroll interno con la barra fina. Por debajo de 1280 px y con JavaScript, `filters.ts` mueve **el mismo nodo del formulario** a un `<dialog>` vacío y lo abre con `showModal()`, como un cajón a la izquierda de 296 px (a ancho completo en móvil); al cerrar lo devuelve al `<aside>`. Al ser el mismo nodo se conservan las casillas, los precios escritos y los grupos abiertos. Se cierra con Escape, con el botón de cerrar o con un clic fuera, el foco vuelve a "Ver filtros" y, si la ventana pasa a 1280 px o más, se cierra solo. Mientras está abierto, la página de fondo no se desplaza: el `body` se fija en su sitio (`position: fixed` con el desplazamiento ya hecho, porque iOS Safari ignora `overflow: hidden` con el dedo) y se conserva la barra de scroll de la página para que el contenido no cambie de ancho; al cerrar, la página vuelve a donde estaba. Lo mismo vale para el desglose de precios a pantalla completa; el cajón mide `100vh` y, donde se soporta, `100dvh`. Su barra de scroll interna (y la del desglose de precios en móvil) es fina y del color de la paleta, con las propiedades estándar `scrollbar-width` y `scrollbar-color`; la barra de la página no se toca, y donde esas propiedades no existen (Chrome 120, Safari anterior a 18.2) queda la del sistema.

"Ver filtros" y el ocultar el `<aside>` van con `@media (scripting: enabled)`, igual que el menú. Sin JavaScript, o en navegadores que no conocen esa media query (Safari anterior a 17), el panel queda apilado encima de los resultados, sin el botón. Tampoco se pierde contenido: las 21 aventuras de "Ver 21 más" se ven todas y el botón no aparece; con JavaScript empiezan ocultas desde el primer pintado, sin parpadeo. Los grupos son `<details>` nativos, así que Destinos y Alojamiento se abren sin JavaScript. Los grupos son independientes, como en el diseño, que dibuja Aventura y Precio abiertos a la vez.

Los filtros todavía no filtran las cards: los controles son de un `<form>` sin botón de envío que no recarga la página, tampoco con Enter. El contenido de los filtros (destinos, alojamientos, las 21 aventuras adicionales y los textos de los tooltips) es de ejemplo: no está en el Figma y se puede cambiar en `src/data/filters.json`.

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
- **Contraste de las flechas del carrusel:** el icono blanco queda a 1,81:1 sobre el fondo de Brand (el 32 % de morado sobre blanco), por debajo del 3:1 que exige WCAG 1.4.11. Hay dos soluciones: subir la opacidad del fondo al 56 % (icono a 3,05:1) o, manteniendo el fondo, pintar el icono con el morado de la marca (`$color-icon-primary-dark-default`, 5,55:1). El cambio está aislado en `src/styles/settings/brand/components/_slider.scss`.
- **Fotos de las cards en móvil:** las tres fotos de las que se parte miden 528 × 376 px. En desktop y tablet equivalen a 2x, pero en móvil, donde la card mide 358 px, quedan algo blandas en pantallas 3x. Con exportaciones a 4x del diseño se generarían más anchos (716 y 1056 px) y se ampliaría el `srcset`.
- **Filtrado real de las cards:** el diseño no define cómo se aplican los filtros ni sus resultados. Hoy los controles son un formulario sin efecto; faltaría decidir el comportamiento (filtrar al marcar o con un botón, orden y estado vacío) y conectarlo con las cards.
- **Contenido de ejemplo de los filtros:** los destinos, los alojamientos, las 21 aventuras y los tooltips son inventados para que el panel funcione; hay que sustituirlos por los reales.
- **Cajón de filtros sin animación:** el diseño no dibuja la transición, así que el cajón aparece sin movimiento. Si se añade una entrada, habría que respetar prefers-reduced-motion.
- **Envío del formulario de filtros:** hoy el formulario no tiene botón de envío porque no envía nada, y la regla wcag/h32 de html-validate está desactivada en esa línea de `filters.hbs` con el motivo escrito. Cuando se añada el envío hay que añadir un `<button type="submit">`, quitar ese comentario y quitar el `preventDefault` del evento `submit` en `filters.ts`.
