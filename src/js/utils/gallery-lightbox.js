import galleryLightboxTemplate from "../../components/gallery-lightbox.html?raw";

function initGalleryLightbox() {
  const gallery = document.querySelector("[data-gallery]");
  const figures = [...(gallery?.querySelectorAll("figure") ?? [])];
  if (!figures.length) return;

  const dialog = document.createElement("dialog");
  dialog.className =
    "m-auto h-screen max-h-none w-screen max-w-none bg-(--surface-transparent) p-2 backdrop:bg-(--surface-modal-overlay) backdrop:backdrop-blur-[4px] open:flex open:items-center open:justify-center open:gap-2 sm:p-4 sm:open:gap-4";
  dialog.setAttribute("aria-label", "Imagen ampliada");
  dialog.innerHTML = galleryLightboxTemplate;
  document.body.append(dialog);

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

  dialog.addEventListener("click", (e) => {
    if (e.target.closest(".gallery-lightbox__close") || e.target === dialog)
      dialog.close();
    else if (e.target.closest(".gallery-lightbox__prev")) show(current - 1);
    else if (e.target.closest(".gallery-lightbox__next")) show(current + 1);
  });

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

initGalleryLightbox();
