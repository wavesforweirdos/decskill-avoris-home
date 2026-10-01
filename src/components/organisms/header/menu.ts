// Menú del navbar por debajo de 1024 px. La visibilidad del botón y del panel la decide el CSS
// (@media (scripting: enabled)); este módulo solo gestiona el estado: abrir, cerrar, Escape, clic
// fuera y devolver el foco. Si el módulo no llega a cargarse con JavaScript activo, el botón queda
// sin función (D-34).

const STATE_ATTRIBUTE = 'data-menu';

export function initMenu(): void {
  const header = document.querySelector<HTMLElement>('.header');
  const toggle = header?.querySelector<HTMLButtonElement>('.header__toggle');

  if (!header || !toggle) {
    return;
  }

  const isOpen = (): boolean => header.getAttribute(STATE_ATTRIBUTE) === 'open';

  const setOpen = (open: boolean): void => {
    header.setAttribute(STATE_ATTRIBUTE, open ? 'open' : 'closed');
    toggle.setAttribute('aria-expanded', String(open));
  };

  setOpen(false);

  toggle.addEventListener('click', () => {
    setOpen(!isOpen());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (isOpen() && event.target instanceof Node && !header.contains(event.target)) {
      setOpen(false);
    }
  });

  // Al llegar a 1024 px el CSS oculta el botón: sin él el menú no se puede cerrar, así que se cierra
  // y queda limpio. Se detecta con el propio botón para no repetir el breakpoint aquí.
  new ResizeObserver(() => {
    if (isOpen() && toggle.offsetParent === null) {
      setOpen(false);
    }
  }).observe(toggle);
}
