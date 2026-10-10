import { validateFields } from "./form-validation.js";

const form = document.getElementById("newsletter__form");
const status = document.getElementById("newsletter__status");

// Messages come from data-* attributes (translated at build). There is no
// backend yet: log the address instead of sending it
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateFields(form)) {
    status.textContent = form.dataset.invalidMessage;
    return;
  }
  console.info(
    "[Newsletter] Aún no se gestiona el alta. Datos recogidos:",
    Object.fromEntries(new FormData(form)),
  );
  status.textContent = form.dataset.successMessage;
  form.reset();
});
