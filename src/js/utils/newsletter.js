import { validateFields } from "./form-validation.js";

const form = document.getElementById("newsletter__form");
const status = document.getElementById("newsletter__status");

// There is no backend yet: log the address instead of sending it
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateFields(form)) {
    status.textContent = "Revisa el email antes de enviar.";
    return;
  }
  console.info(
    "[Newsletter] Aún no se gestiona el alta. Datos recogidos:",
    Object.fromEntries(new FormData(form)),
  );
  status.textContent = "Gracias, te hemos apuntado a la newsletter.";
  form.reset();
});
