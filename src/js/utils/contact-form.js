import { validateFields } from "./form-validation.js";

const form = document.querySelector(".contact__form");
const status = document.getElementById("contact-form-status");

// There is no backend yet: log the data instead of sending it
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateFields(form)) {
    status.textContent = "Revisa los campos marcados antes de enviar.";
    return;
  }
  console.info(
    "[Contacto] Aún no se gestiona el envío del formulario. Datos recogidos:",
    Object.fromEntries(new FormData(form)),
  );
  status.textContent = "Gracias, hemos recibido tu mensaje.";
  form.reset();
});
