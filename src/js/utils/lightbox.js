function initLightbox(selector = "[data-gallery] figure") {
  const figures = [...document.querySelectorAll(selector)].filter((f) =>
    f.querySelector("img"),
  );
  if (!figures.length) return;

  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Imagen ampliada");
  dialog.innerHTML = `
    <button type="button" class="lightbox__btn lightbox__close" aria-label="Cerrar">&times;</button>
    <button type="button" class="lightbox__btn lightbox__prev" aria-label="Anterior">&#8249;</button>
    <figure class="lightbox__figure">
      <img class="lightbox__img" alt="" />
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
    <button type="button" class="lightbox__btn lightbox__next" aria-label="Siguiente">&#8250;</button>
  `;
  document.body.append(dialog);

  const img = dialog.querySelector(".lightbox__img");
  const caption = dialog.querySelector(".lightbox__caption");
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

  // The image becomes a real <button>; the caption stays outside it so its
  // heading and paragraph keep their semantics
  figures.forEach((figure, index) => {
    const image = figure.querySelector("img");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery__zoom";
    button.setAttribute("aria-label", `Ampliar: ${image.alt}`);
    button.setAttribute("aria-haspopup", "dialog");
    image.replaceWith(button);
    button.append(image);

    button.addEventListener("click", () => {
      show(index);
      dialog.showModal();
    });
  });

  dialog.addEventListener("click", (e) => {
    if (e.target.closest(".lightbox__close") || e.target === dialog)
      dialog.close();
    else if (e.target.closest(".lightbox__prev")) show(current - 1);
    else if (e.target.closest(".lightbox__next")) show(current + 1);
  });

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

initLightbox();
