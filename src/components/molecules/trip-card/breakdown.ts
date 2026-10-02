// Desglose de precios de las cards. El HTML es un <dialog> dentro de cada card; este módulo lo abre
// como modal a pantalla completa en móvil (showModal) o como popover no modal desde 744 px (show).
// Qué modo toca lo dice el CSS con --price-popover-modal, así el punto de corte no se repite aquí.
// Sin JavaScript el botón "Ver desglose" queda oculto (hidden) y el desglose no se ofrece.

const MODE_PROPERTY = '--price-popover-modal';

interface Breakdown {
  trigger: HTMLButtonElement;
  dialog: HTMLDialogElement;
  closeButton: HTMLButtonElement;
}

export function initBreakdowns(): void {
  const items: Breakdown[] = [];

  for (const card of document.querySelectorAll<HTMLElement>('.trip-card')) {
    const trigger = card.querySelector<HTMLButtonElement>('.trip-card__breakdown');
    const dialog = card.querySelector<HTMLDialogElement>('.price-popover');
    const closeButton = dialog?.querySelector<HTMLButtonElement>('.price-popover__close');

    if (trigger && dialog && closeButton) {
      items.push({ trigger, dialog, closeButton });
    }
  }

  if (items.length === 0) {
    return;
  }

  let current: (Breakdown & { modal: boolean }) | undefined;

  const isModalMode = (dialog: HTMLDialogElement): boolean =>
    getComputedStyle(dialog).getPropertyValue(MODE_PROPERTY).trim() === '1';

  const close = (returnFocus: boolean): void => {
    if (!current) {
      return;
    }

    const { dialog, trigger } = current;

    // Se limpia antes de cerrar para que el evento "close" del dialog no vuelva a entrar aquí.
    current = undefined;

    if (dialog.open) {
      dialog.close();
    }

    trigger.setAttribute('aria-expanded', 'false');

    if (returnFocus) {
      trigger.focus();
    }
  };

  const open = (item: Breakdown): void => {
    close(false);

    const modal = isModalMode(item.dialog);

    if (modal) {
      // El navegador mueve el foco al primer elemento (el botón de cerrar) y lo mantiene dentro.
      item.dialog.showModal();
    } else {
      item.dialog.show();
      item.closeButton.focus();
    }

    item.trigger.setAttribute('aria-expanded', 'true');
    current = { ...item, modal };
  };

  for (const item of items) {
    item.trigger.hidden = false;

    item.trigger.addEventListener('click', () => {
      if (current?.dialog === item.dialog) {
        close(true);
      } else {
        open(item);
      }
    });

    item.closeButton.addEventListener('click', () => {
      close(true);
    });

    // Escape en el modal lo cierra el navegador: aquí solo se actualiza el estado y se devuelve el foco.
    item.dialog.addEventListener('close', () => {
      if (current?.dialog === item.dialog) {
        close(true);
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && current && !current.modal) {
      close(true);
    }
  });

  // Clic fuera del popover no modal: se cierra sin mover el foco.
  document.addEventListener('click', (event) => {
    if (!current || current.modal || !(event.target instanceof Node)) {
      return;
    }

    if (!current.dialog.contains(event.target) && !current.trigger.contains(event.target)) {
      close(false);
    }
  });

  // Si el ancho cruza el punto de corte con el desglose abierto, cambia de modo: se cierra.
  window.addEventListener('resize', () => {
    if (current && isModalMode(current.dialog) !== current.modal) {
      close(false);
    }
  });
}
