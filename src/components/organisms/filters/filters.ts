// Panel de filtros. La base (el aside con el formulario y los grupos <details>) funciona sin
// JavaScript; este módulo añade tres cosas:
// - "Ver 21 más" / "Ver menos" en el grupo de aventuras;
// - que el formulario no se envíe (los filtros todavía no filtran las cards);
// - por debajo de 1280 px, el cajón: mueve el MISMO formulario al <dialog> y lo abre como modal, y
//   lo devuelve al aside al cerrar, de modo que se conservan casillas, precios y grupos abiertos.

const SCROLL_LOCK = 'data-scroll-locked';

function initMoreButtons(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>('.filter-more')) {
    const list = document.getElementById(button.getAttribute('aria-controls') ?? '');

    if (!list) {
      continue;
    }

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';

      button.setAttribute('aria-expanded', String(!expanded));
      list.toggleAttribute('data-open', !expanded);
      // El texto sale del HTML (con el número real de opciones ocultas). El foco no se mueve.
      button.textContent = (expanded ? button.dataset['more'] : button.dataset['less']) ?? '';
    });
  }
}

export function initFilters(): void {
  initMoreButtons();

  const toggle = document.querySelector<HTMLButtonElement>('.catalog__filters-toggle');
  const aside = document.querySelector<HTMLElement>('.filters');
  const dialog = document.querySelector<HTMLDialogElement>('.filters-dialog');
  const form = aside?.querySelector<HTMLFormElement>('.filters__form');
  const closeButton = form?.querySelector<HTMLButtonElement>('.filters__close');

  if (!toggle || !aside || !dialog || !form || !closeButton) {
    return;
  }

  // Los filtros todavía no filtran: sin esto, Enter en un precio enviaría el formulario.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  toggle.addEventListener('click', () => {
    dialog.append(form);
    document.documentElement.setAttribute(SCROLL_LOCK, '');
    // El navegador mueve el foco al primer elemento (el botón de cerrar) y lo mantiene dentro.
    dialog.showModal();
  });

  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  // Cierra con Escape (nativo), con el botón o con un clic en el hueco de fuera.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    aside.append(form);
    document.documentElement.removeAttribute(SCROLL_LOCK);

    // Si el cierre viene de pasar a 1280 px, el botón ya no está y no hay a dónde devolver el foco.
    if (toggle.offsetParent !== null) {
      toggle.focus();
    }
  });

  // Al llegar a 1280 px el CSS oculta "Ver filtros" y muestra el aside: el cajón se cierra y el
  // formulario vuelve a su sitio. Se detecta con el propio botón para no repetir el breakpoint aquí.
  new ResizeObserver(() => {
    if (dialog.open && toggle.offsetParent === null) {
      dialog.close();
    }
  }).observe(toggle);
}
