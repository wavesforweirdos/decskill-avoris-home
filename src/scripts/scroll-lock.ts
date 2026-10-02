// Bloqueo del scroll de la página mientras hay un modal abierto (el cajón de filtros y el desglose de
// precios a pantalla completa). overflow: hidden no basta: iOS Safari no lo respeta con el dedo y
// la página de detrás seguía moviéndose. Por eso el body se fija con position: fixed y se desplaza
// hacia arriba lo que ya se había bajado (--scroll-lock-offset), de
// modo que la página no salta; al desbloquear se devuelve a su posición. La barra de scroll de la
// página se conserva (overflow-y: scroll) para que el contenido no cambie de ancho. Los estilos
// están en elements/_base.scss.

const LOCK_ATTRIBUTE = 'data-scroll-locked';
const OFFSET_PROPERTY = '--scroll-lock-offset';

let lockedAt: number | undefined;

export function lockScroll(): void {
  if (lockedAt !== undefined) {
    return;
  }

  const root = document.documentElement;

  lockedAt = window.scrollY;
  root.style.setProperty(OFFSET_PROPERTY, `-${String(lockedAt)}px`);
  root.setAttribute(LOCK_ATTRIBUTE, '');
}

export function unlockScroll(): void {
  if (lockedAt === undefined) {
    return;
  }

  const root = document.documentElement;
  const scrollY = lockedAt;

  lockedAt = undefined;
  root.removeAttribute(LOCK_ATTRIBUTE);
  root.style.removeProperty(OFFSET_PROPERTY);
  window.scrollTo(0, scrollY);
}
