## Qué

<!-- Resumen del cambio en una o dos frases. -->

## Por qué

<!-- Motivo y decisiones relevantes. Enlaza la issue: -->

Closes #

## Cómo probarlo

1.
2.

## Capturas

| Móvil (390) | Tablet (744 / 1024) | Desktop (1280+) |
| ----------- | ------------------- | --------------- |
|             |                     |                 |

## Checklist

**Responsive**

- [ ] Revisado a 390, 744, 1024 y 1280 px contra el Figma
- [ ] Sin scroll horizontal a 320 px ni con zoom al 200 %

**Accesibilidad**

- [ ] Navegación completa por teclado, con foco visible
- [ ] Landmarks y jerarquía de headings correctas
- [ ] Contraste AA, `alt` y `label` donde corresponda
- [ ] `prefers-reduced-motion` respetado si hay animación

**General**

- [ ] `npm run lint`, `npm run typecheck` y `npm run build` pasan
- [ ] Sin `!important`, estilos inline ni valores sueltos: todo sale de los tokens
- [ ] Las decisiones relevantes están en el README o en un comentario del código
