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

| Navegador | Estado                                              |
| --------- | --------------------------------------------------- |
| Chrome    | Verificado                                          |
| Firefox   | No verificado (ver «No verificado» en la auditoría) |
| Safari    | No verificado en macOS; iPhone, comprobado a mano   |

`text-wrap: balance` en los títulos es una mejora progresiva: los navegadores que no lo soportan muestran el texto sin equilibrar.

El menú de navegación por debajo de 1024 px (y «Ver filtros» y «Ver 21 más») se pliega solo si hay JavaScript, con `@media (scripting: enabled)`. Si el módulo de JavaScript no llega a cargar, un script del `<head>` marca `data-js-failed` y esos estilos se desactivan: la página queda como sin JavaScript. Safari anterior a 17 no conoce la media query; `main.ts` lo detecta y activa los mismos estilos al cargar (mixin `js-enhanced`, en `src/styles/tools/_enhance.scss`).

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

La foto del hero se sirve en WebP (todos los navegadores objetivo lo soportan), sin PNG de respaldo: `hero-1440.webp` y `hero-2880.webp` (1x y 2x) para anchos desde 744 px, y `hero-mobile-744.webp` y `hero-mobile-1488.webp` por debajo, con el recorte de la parte izquierda que enseña el diseño. Hasta 430 px de ancho, que es lo que enseña un teléfono, se sirve un recorte más estrecho (`hero-mobile-430.webp` y `hero-mobile-860.webp`). Así un móvil descarga unos 5 KB (15 KB en pantallas 2x) en lugar de los 800 KB del PNG original. La primera imagen se pide con `fetchpriority="high"` por ser la candidata a LCP y reserva su espacio con `width` y `height`.

El carrusel funciona sin JavaScript (pista con `scroll-snap`) y `hero.ts` añade las flechas, el indicador y el anuncio de la posición. No hay avance automático.

## Cards y desglose de precios

Las cards son una rejilla de columnas de 264 px: 1 en móvil, 2 desde 744 px y 3 desde 1024 px, siempre con ese número de columnas aunque el ancho dé para más. Desde 1280 px el catálogo reserva a la izquierda una columna de 264 px para los filtros, solo con el grid, sin ningún elemento vacío. Los dos grupos de la home repiten el contenido de ejemplo del diseño: el primero con tres cards y el segundo con seis, como en los layouts de desktop y tablet grande. Cada foto se sirve en WebP a 264 y 528 px (`srcset` con `sizes`) y con `loading="lazy"`.

El desglose de precios es un `<dialog>` dentro de cada card que se abre de dos maneras según el ancho. Por debajo de 744 px es un modal a pantalla completa (`showModal()`), como la variante móvil del diseño: el navegador mantiene el foco dentro y cierra con Escape. Desde 744 px es un popover no modal de 400 px centrado sobre la card (`show()`): se cierra con Escape, con el botón de cerrar o con un clic fuera, y solo hay uno abierto a la vez. El CSS decide el modo con una propiedad (`--price-popover-modal`) que lee el script, así el punto de corte no se repite en TypeScript. No usa la API nativa `popover`, que no soportan Firefox 120 ni Safari 16.4. Sin JavaScript el botón "Ver desglose" no se muestra.

## Filtros

El panel de filtros es un `<aside>` con un formulario que, desde 1280 px, ocupa la columna reservada del catálogo y se ve también sin JavaScript. Ahí se queda fijo al desplazar la página (`position: sticky`, a 24 px del borde superior) y se detiene al acabar su fila, sin pisar el pie; si no cabe en la pantalla, tiene alto máximo y scroll interno con la barra fina. Por debajo de 1280 px y con JavaScript, `filters.ts` mueve **el mismo nodo del formulario** a un `<dialog>` vacío y lo abre con `showModal()`, como un cajón a la izquierda de 296 px (a ancho completo en móvil); al cerrar lo devuelve al `<aside>`. Al ser el mismo nodo se conservan las casillas, los precios escritos y los grupos abiertos. Se cierra con Escape, con el botón de cerrar o con un clic fuera, el foco vuelve a "Ver filtros" y, si la ventana pasa a 1280 px o más, se cierra solo. Mientras está abierto, la página de fondo no se desplaza: el `body` se fija en su sitio (`position: fixed` con el desplazamiento ya hecho, porque iOS Safari ignora `overflow: hidden` con el dedo) y se conserva la barra de scroll de la página para que el contenido no cambie de ancho; al cerrar, la página vuelve a donde estaba. Lo mismo vale para el desglose de precios a pantalla completa; el cajón mide `100vh` y, donde se soporta, `100dvh`. Su barra de scroll interna (y la del desglose de precios en móvil) es fina y del color de la paleta, con las propiedades estándar `scrollbar-width` y `scrollbar-color`; la barra de la página no se toca, y donde esas propiedades no existen (Chrome 120, Safari anterior a 18.2) queda la del sistema.

"Ver filtros" y el ocultar el `<aside>` van con la misma mejora progresiva que el menú (`js-enhanced`). Sin JavaScript, o si su módulo no carga, el panel queda apilado encima de los resultados, sin el botón. Tampoco se pierde contenido: las 21 aventuras de "Ver 21 más" se ven todas y el botón no aparece; con JavaScript empiezan ocultas desde el primer pintado, sin parpadeo. Los grupos son `<details>` nativos, así que Destinos y Alojamiento se abren sin JavaScript. Los grupos son independientes, como en el diseño, que dibuja Aventura y Precio abiertos a la vez.

Los filtros todavía no filtran las cards: los controles son de un `<form>` sin botón de envío que no recarga la página, tampoco con Enter. El contenido de los filtros (destinos, alojamientos, las 21 aventuras adicionales y los textos de los tooltips) es de ejemplo: no está en el Figma y se puede cambiar en `src/data/filters.json`.

## Decisiones de comportamiento respecto al Figma

El diseño manda en colores, tamaños, espaciados y tipografía. Estas decisiones son de comportamiento (el Figma es estático) o de semántica, y se mantienen:

| Qué                             | Figma                                         | Hoy                                                                                                                              | Motivo                                                                                          |
| ------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Burbuja del tooltip             | Una línea, sin ancho máximo                   | Ancho máximo de 176 px con salto de línea, y `display: none` mientras está oculta                                                | Una burbuja oculta pero con su caja ampliaba el ancho de la página y producía scroll horizontal |
| Cajón de filtros                | Panel bajo el hero, a la altura de la sección | Cajón fijo a la altura de toda la pantalla                                                                                       | Es un modal: cubre la página para que el foco y el scroll de fondo queden bloqueados            |
| Texto del pie                   | «@2024»                                       | «© 2024»                                                                                                                         | El símbolo correcto de copyright                                                                |
| Logo y botón de la cabecera     | Posiciones del diseño                         | 0,5 px de diferencia a partir de 1024 px                                                                                         | Redondeo del layout flexible                                                                    |
| Tamaño de los campos en iOS     | 14 px                                         | 16 px solo en iOS (`-webkit-touch-callout`)                                                                                      | Con menos de 16 px, Safari en iOS hace zoom al enfocar el campo                                 |
| Añadidos que el Figma no dibuja | —                                             | Anillo de foco de dos tonos, enlace «Saltar al contenido», panel del menú abierto, columna de filtros fija, barra de scroll fina | Foco, teclado y comportamiento: el diseño no define estados interactivos ni este recorrido      |

## Contenido de maqueta

Se queda tal cual viene del diseño, para sustituirlo por el real:

- Los 17 enlaces `href="#"` (pestañas del menú, botón «Reserva», «Reservar» de cada card y botones del hero).
- La fila «Lorem ipsum» del desglose de precios.
- El texto repetido de las cards («Descubre Bangkok con Iberojet», «Marruecos, África · 9 días», 248,00 €), que no coincide con las fotos.

**Limitación de la maqueta:** las 9 cards del Figma tienen exactamente el mismo texto (destino, días, título y precio) y solo cambia la foto, que es decorativa, así que no hay ningún dato propio con el que distinguirlas. Por eso el nombre accesible de «Reservar» y «Ver desglose» lleva la posición («Reservar: Descubre Bangkok con Iberojet, Marruecos, África (Asia, grupo 2, opción 4)») para que cada enlace se distinga al recorrerlos con un lector de pantalla. Con contenido real, el título y el destino bastarán y se podrá quitar la posición.

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

## Auditoría

Fecha de las mediciones: 2 de octubre de 2026. Todas sobre el build de producción servido con `vite preview` (`npm run build && npx vite preview --port 4173 --strictPort`).

| Herramienta | Versión                                                 |
| ----------- | ------------------------------------------------------- |
| Lighthouse  | 13.5.0                                                  |
| axe-core    | 4.13.0 (inyectado con Playwright)                       |
| Playwright  | playwright-core 1.63.0                                  |
| Chrome      | 154.0.8037.93 (Lighthouse corre con HeadlessChrome 154) |
| Node y npm  | 24.17.0 y 11.13.0                                       |

Lighthouse, tres pasadas por perfil (la cifra es la mediana):

```bash
npx lighthouse@13.5.0 http://localhost:4173/ --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=lh/mobile-1.json
npx lighthouse@13.5.0 http://localhost:4173/ --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=lh/desktop-1.json
```

axe-core se ejecutó en 15 estados: la home a 1280, 1024, 744 y 390 px; menú abierto; carrusel en la segunda diapositiva; desglose como popover y como modal; cajón de filtros a 390 y 800 px; filtros con todo abierto y «Ver 21 más»; tooltip visible; y tres anchos sin JavaScript (se emula bloqueando el módulo y neutralizando la media query `scripting`).

### Resultados, antes y después

«Antes» es el build previo a esta fase, con los colores ajustados para cumplir. «Después» es el build con los valores del Figma restaurados y las correcciones. La diferencia en accesibilidad **son los valores del Figma marcados con `A11Y-WARNING`** (tabla de abajo), no un fallo de maquetación.

| Medida           | Móvil antes | Móvil después | Escritorio antes | Escritorio después |
| ---------------- | ----------- | ------------- | ---------------- | ------------------ |
| Rendimiento      | 98          | 99            | 100              | 100                |
| Accesibilidad    | 100         | 96            | 100              | 96                 |
| Buenas prácticas | 100         | 100           | 100              | 100                |
| SEO              | 92          | 100           | 92               | 100                |
| FCP              | 1224 ms     | 976 ms        | 340 ms           | 271 ms             |
| LCP              | 2049 ms     | 1819 ms       | 440 ms           | 412 ms             |
| TBT              | 0 ms        | 0 ms          | 0 ms             | 0 ms               |
| CLS              | 0           | 0             | 0                | 0                  |
| Peso descargado  | 245 KB      | 202 KB        | 169 KB           | 160 KB             |

axe-core: antes, 0 violaciones en los 15 estados. Después, una sola regla (`color-contrast`) en cinco nodos, todos con su `A11Y-WARNING`: el subtítulo de sección y el nombre de los grupos de filtros abiertos. El aviso incompleto sobre `aria-controls` desapareció. El SEO sube porque ahora existe un `robots.txt` real (el 92 anterior era un `robots.txt` inválido: `vite preview` devuelve el `index.html` para esa ruta).

### Qué se corrigió

- **Mejora progresiva (WCAG 2.1.1, 4.1.2).** Si JavaScript está activo pero su módulo no llega a cargar, un script del `<head>` marca `data-js-failed` y los estilos de mejora no se aplican: el menú, el panel de filtros y las 21 opciones quedan visibles en vez de ocultos tras botones que no hacen nada. En Safari anterior a 17, que no conoce la media query `scripting`, `main.ts` lo detecta y activa los mismos estilos al cargar (con un salto de maquetación inevitable).
- **Nombres accesibles (WCAG 2.4.4).** «Reservar» y «Ver desglose» de las 9 cards tenían el mismo nombre; ahora cada uno lleva su posición (ver Contenido de maqueta).
- **Hero con espaciado de texto (WCAG 1.4.12).** Con el interlineado y el espaciado de letras y de párrafos del criterio, el texto del hero se salía de su caja de 400 px en móvil. Ahora la caja tiene `min-height` y crece. Con los valores por defecto, las capturas cabecera y hero a 1280, 1024, 744 y 390 px son idénticas píxel a píxel.
- **`aria-controls` del botón «Ver filtros».** Se quita: `aria-haspopup="dialog"` ya anuncia que abre un diálogo y axe no podía verificar el vínculo.
- **`robots.txt`** real en `public/`.
- **Imágenes.** Un móvil de hasta 430 px descarga un recorte exacto de lo que se ve del hero (`hero-mobile-430` y `hero-mobile-860`, 5 y 15 KB) en lugar del recorte de 744 o 1488 px (18 y 46 KB). El resto de fotos se recomprimieron con la calidad más baja cuyo PSNR contra el original es igual o mejor que el del archivo anterior. Las dimensiones mostradas no cambian.
- **Precarga de Nunito**, la fuente del cuerpo, que el navegador solo descubría al leer el CSS.
- **Anillo de foco (WCAG 2.4.7, 2.4.11, 1.4.11).** Se revisó el anillo de los 19 tipos de control enfocable, a 1280 y 390 px y dentro del cajón y del desglose, y se ajustó sin cambiar los tokens (`$focus-ring-color` y `$focus-ring-halo`) ni el aspecto sin foco (capturas idénticas a 1280, 1024, 744 y 390 px):
  - **Tooltip:** el anillo es un círculo a 2 px del icono (antes un cuadrado de 24 px). La burbuja, cuando está abierta, queda por encima del anillo y le tapa la punta del arco superior; sigue visible alrededor del 87 % del anillo, así que cumple 2.4.11, que solo exige que el indicador no quede oculto del todo.
  - **Casilla:** el anillo rodea la caja visible de 18 px, a 2 px y con sus esquinas, y no el `input` de 24 px. Hacia dentro tapaba la marca y casi todo el relleno naranja. El mixin `focus-ring` recibe la separación como parámetro (`$gap`, 2 px por defecto).
  - **Pestañas del navbar, logo y «Ver 21 más» / «Ver menos»:** el anillo es una píldora alrededor del contenido visible (icono y texto, la imagen, o el texto) con la misma separación por los cuatro lados medida desde la caja del contenido, `$focus-gap-link` (6 px). Antes rodeaba el enlace entero: 80 px de alto en una pestaña de 24. El aire propio del contenido (el interlineado y los márgenes del icono) suma hasta 11 px en vertical en las pestañas. El tamaño, el `padding` y el área de clic de los enlaces no cambian: el anillo va en un contenedor interior (pestañas) o en un pseudo-elemento (logo y «Ver 21 más», con el mixin `focus-ring-pill`).
  - **Chevron de los grupos de filtros y de «Ver desglose»:** al enfocar el `summary` o el enlace se resalta solo el chevron, con un anillo circular, y no toda la fila o el enlace. El chevron es un icono con máscara que recortaría su propio anillo, así que el anillo es un pseudo-elemento del control con el tamaño del chevron (mixin `focus-ring-trailing-icon`). En «Ver desglose» no hay separación entre la etiqueta y el chevron (separarlos cambiaría el ancho del enlace), así que el anillo va dentro de la caja del chevron, sin halo, para no montarse sobre la última letra.
  - **Sobre la foto del hero (flechas y botón):** los mismos dos tonos en orden inverso, blanco fuera y morado dentro (mixins `focus-ring-on-photo` y `focus-ring-inset-on-photo`). Antes el morado exterior daba entre 1,0 y 1,8:1 contra la foto oscura; ahora el blanco da 3,5:1 o más y 10,02:1 contra el morado. Las flechas lo dibujan hacia dentro porque tocan el borde de la ventana y se cortaban.
  - **Paneles con scroll:** `scroll-margin-block` de 4 px en los controles, para que el filtro o el cajón no corten el anillo al llegar con Tab (9 recortes antes, ninguno después).
  - Contraste del anillo medido tras los ajustes: de 9,35:1 a 10,02:1 contra el fondo y 10,02:1 entre sus dos tonos (4,44:1 donde el fondo es la raya naranja bajo la pestaña, 3,5:1 o más sobre la foto del hero).
  - En alto contraste de Windows el anillo sigue dibujándose (comprobado con `forced-colors: active` en Chrome; sin NVDA ni Windows real).
- **Valores del Figma restaurados:** nombre y chevron del grupo abierto, color del icono en hover, subtítulo y título de sección, color del placeholder, velo del hero (se quita), ancho de las cards en móvil (360 px), color del borde del pie y solape del popover (9 px).

### Comprobado y sin cambios

- Teclado: 52 paradas de tabulación sin trampas, el foco siempre es visible (anillo de dos tonos, de 9,35:1 a 10,02:1) y nunca queda tapado.
- Reflujo a 320 y 256 px sin scroll horizontal, también con el menú, el cajón y el desglose abiertos.
- Tamaño de los objetivos: nada por debajo de 24 px, salvo los campos de precio (152 × 20 px), que cumplen por separación.
- Con el tamaño de fuente por defecto del navegador al 200 % (32 px) no hay scroll horizontal y la cabecera pasa al menú plegado, porque los breakpoints están en `em`.
- Estructura: un `h1`, sin saltos de nivel, landmarks correctos, sin `id` duplicados y todas las imágenes con `alt`.
- Estados deshabilitados de los botones (2,3:1): exentos por WCAG 1.4.3, y no aparecen en la home.

### Incumplimientos del diseño

Valores que dicta el Figma, no se modifican y llevan un comentario `A11Y-WARNING` justo encima de la declaración (se buscan con ese texto):

| Criterio                           | Dónde (archivo)                                                       | Valor del Figma                                     | Mínimo | Valor propuesto                                                                                 |
| ---------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| WCAG 1.4.3 (contraste)             | Nombre del grupo de filtros abierto · `brand/_semantic.scss`          | `#b85c28` sobre crema, 4,26:1                       | 4,5:1  | `#b25927` (4,50:1)                                                                              |
| WCAG 1.4.3 (contraste)             | Subtítulo de sección · `brand/_own.scss`                              | `#6b7d8d` sobre blanco, 4,25:1                      | 4,5:1  | `#786f78` (4,83:1)                                                                              |
| WCAG 1.4.3 (contraste)             | Placeholder del campo de precio · `brand/components/_text-input.scss` | `#817781` sobre blanco, 4,30:1                      | 4,5:1  | `#786f78` (4,83:1)                                                                              |
| WCAG 1.4.3 (contraste)             | Subtítulo del hero sobre la foto · `brand/components/_hero.scss`      | Blanco sin velo, peor píxel 4,00:1 (1280 y 1440 px) | 4,5:1  | Velo negro del 10 % sobre la foto (`#0000001a`)                                                 |
| WCAG 1.4.11 (contraste no textual) | Relleno de la casilla marcada · `brand/components/_checkbox.scss`     | `#ff8f50` sobre crema, 2,11:1                       | 3:1    | Relleno `#b85c28` (4,26:1) con la marca en blanco (4,57:1)                                      |
| WCAG 1.4.11 (contraste no textual) | Icono de las flechas del carrusel · `brand/components/_slider.scss`   | Blanco sobre el 32 % de morado, 1,80:1              | 3:1    | Fondo al 56 % de `primary-700` (3,05:1) o icono con `$color-icon-primary-dark-default` (5,55:1) |

La casilla marcada sí queda identificada por su borde (9,35:1) y por la marca, así que el aviso afecta solo al relleno. El título del hero cumple en el peor píxel de todos los anchos (3,64:1 como mínimo, con mínimo de 3:1 por ser texto grande), y el subtítulo del hero cumple a 1024 px y menos, donde también es texto grande.

### No verificado

- **Lector de pantalla (NVDA en Firefox y Chrome) y VoiceOver en Safari:** no verificado. La estructura se ha comprobado con axe-core, no escuchando la página.
- **Firefox:** no verificado.
- **Safari en macOS:** no verificado. En un iPhone se comprobó a mano la maquetación, el carrusel, el menú, los tooltips y los filtros; falta repetir el zoom del campo de precio y el bloqueo del scroll con los últimos cambios, y probar VoiceOver y «Reducir movimiento».
- **Safari anterior a 17 (contrapartida de `scripting`):** probado solo en Chrome, quitándole al navegador la media query `scripting` y su soporte en `matchMedia`; no verificado en un Safari real.

### Pendiente

- `canonical`, `og:*` y `theme-color` (necesitan la URL pública del sitio).
- El CSS (un solo archivo de 10 KB) bloquea el primer pintado unos 150 ms. Se podría insertar en línea la parte del primer pliegue; no se hizo para no mantener dos copias del CSS.
- Lighthouse todavía recomienda recomprimir la foto de Bangkok (47 KB) y servirla a su tamaño de pantalla (360 × 256 px); solo existe a 528 px de ancho y bajarla más cambiaría su aspecto.

## Mejoras que haría con más tiempo

- **Estado abierto del menú de navegación:** el Figma no lo dibuja. Hoy se muestran las mismas pestañas y el botón "Reserva" apilados bajo la barra, sin diseño propio; falta que diseño defina su aspecto (fondo, separación, marcador de la pestaña activa) para sustituir esta versión mínima.
- **Incumplimientos de contraste del diseño:** hay seis valores del Figma que no cumplen WCAG y están marcados con `A11Y-WARNING`, con la propuesta que sí cumpliría (ver «Incumplimientos del diseño»). Los cambios están aislados en `src/styles/settings/brand/`.
- **Fotos de las cards en móvil:** las tres fotos de las que se parte miden 528 × 376 px. En desktop y tablet equivalen a 2x, pero en móvil, donde la card mide 360 px, quedan algo blandas en pantallas 3x. Con exportaciones a 4x del diseño se generarían más anchos (716 y 1056 px) y se ampliaría el `srcset`.
- **Filtrado real de las cards:** el diseño no define cómo se aplican los filtros ni sus resultados. Hoy los controles son un formulario sin efecto; faltaría decidir el comportamiento (filtrar al marcar o con un botón, orden y estado vacío) y conectarlo con las cards.
- **Contenido de ejemplo de los filtros:** los destinos, los alojamientos, las 21 aventuras y los tooltips son inventados para que el panel funcione; hay que sustituirlos por los reales.
- **Cajón de filtros sin animación:** el diseño no dibuja la transición, así que el cajón aparece sin movimiento. Si se añade una entrada, habría que respetar prefers-reduced-motion.
- **Envío del formulario de filtros:** hoy el formulario no tiene botón de envío porque no envía nada, y la regla wcag/h32 de html-validate está desactivada en esa línea de `filters.hbs` con el motivo escrito. Cuando se añada el envío hay que añadir un `<button type="submit">`, quitar ese comentario y quitar el `preventDefault` del evento `submit` en `filters.ts`.
