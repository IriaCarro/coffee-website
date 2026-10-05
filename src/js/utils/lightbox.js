function initLightbox(selector = '[data-gallery] figure') {
  const figures = [...document.querySelectorAll(selector)].filter((f) => f.querySelector('img'));
  if (!figures.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Imagen ampliada');
  dialog.innerHTML = `
    <button type="button" class="lightbox-btn lightbox-close" aria-label="Cerrar">&times;</button>
    <button type="button" class="lightbox-btn lightbox-prev" aria-label="Anterior">&#8249;</button>
    <figure class="lightbox-figure">
      <img class="lightbox-img" alt="" />
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
    <button type="button" class="lightbox-btn lightbox-next" aria-label="Siguiente">&#8250;</button>
  `;
  document.body.append(dialog);

  const img = dialog.querySelector('.lightbox-img');
  const caption = dialog.querySelector('.lightbox-caption');
  let current = 0;

  const show = (index) => {
    current = (index + figures.length) % figures.length;
    const source = figures[current].querySelector('img');
    img.src = source.src;
    img.alt = source.alt;
    const title = figures[current].querySelector('h3')?.textContent ?? source.alt;
    const text = figures[current].querySelector('p')?.textContent ?? '';
    caption.textContent = text ? `${title} — ${text}` : title;
  };

  figures.forEach((figure, index) => {
    figure.classList.add('gallery-zoomable');
    figure.tabIndex = 0;
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', `Ampliar: ${figure.querySelector('img').alt}`);
    const open = () => {
      show(index);
      dialog.showModal();
    };
    figure.addEventListener('click', open);
    figure.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  dialog.addEventListener('click', (e) => {
    if (e.target.closest('.lightbox-close') || e.target === dialog) dialog.close();
    else if (e.target.closest('.lightbox-prev')) show(current - 1);
    else if (e.target.closest('.lightbox-next')) show(current + 1);
  });

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}

initLightbox();
