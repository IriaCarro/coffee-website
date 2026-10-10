function initGalleryLightbox() {
  const gallery = document.querySelector("[data-gallery]");
  const figures = [...(gallery?.querySelectorAll("figure") ?? [])];
  if (!figures.length) return;

  // Rendered at build time by <gallery-lightbox> in gallery.html
  const dialog = document.getElementById("gallery__lightbox");

  const img = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  let current = 0;

  const show = (index) => {
    current = (index + figures.length) % figures.length;
    const source = figures[current].querySelector("img");
    img.src = source.src;
    img.alt = source.alt;
    const title =
      figures[current].querySelector("h3")?.textContent ?? source.alt;
    const text = figures[current].querySelector("p")?.textContent ?? "";
    caption.textContent = text ? `${title} — ${text}` : title;
  };

  gallery.addEventListener("click", (e) => {
    const figure = e.target
      .closest("button[aria-haspopup=dialog]")
      ?.closest("figure");
    if (!figure) return;
    show(figures.indexOf(figure));
    dialog.showModal();
  });

  // Buttons name their action in data-lightbox-action; a click on the
  // backdrop (the dialog itself) closes it too
  const actions = {
    close: () => dialog.close(),
    previous: () => show(current - 1),
    next: () => show(current + 1),
  };
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) return dialog.close();
    const button = e.target.closest("[data-lightbox-action]");
    actions[button?.dataset.lightboxAction]?.();
  });

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

initGalleryLightbox();
