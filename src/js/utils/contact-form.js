import { validateFields } from "./form-validation.js";

const form = document.getElementById("contact__form");
const status = document.getElementById("contact__status");

// Messages come from data-* attributes (translated at build). There is no
// backend yet: log the data instead of sending it
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateFields(form)) {
    status.textContent = form.dataset.invalidMessage;
    return;
  }
  console.info(
    "[Contacto] Aún no se gestiona el envío del formulario. Datos recogidos:",
    Object.fromEntries(new FormData(form)),
  );
  status.textContent = form.dataset.successMessage;
  form.reset();
});
